import asyncio
import uuid
from pathlib import Path
from typing import Optional

from playwright.async_api import (
    Browser,
    TimeoutError as PlaywrightTimeoutError,
    async_playwright,
)

BASE_DIR = Path(__file__).resolve().parent.parent


class UrlCrawler:
    def __init__(self, max_concurrency: int = 7, screenshot_dir: Optional[Path] = None):
        self.browser: Optional[Browser] = None
        self.playwright = None
        self.semaphore = asyncio.Semaphore(max_concurrency)
        self.screenshot_dir = screenshot_dir or (BASE_DIR / "screenshots")
        self.screenshot_dir.mkdir(parents=True, exist_ok=True)

    async def initialize_browser(self) -> None:
        if self.browser:
            return

        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-gpu",
            ],
        )

    async def crawl(self, url: str) -> dict[str, str]:
        async with self.semaphore:
            await self.initialize_browser()
            if not self.browser:
                raise RuntimeError("Browser failed to initialize")

            page = await self.browser.new_page()
            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=15000)
                try:
                    await page.wait_for_load_state("networkidle", timeout=3000)
                except PlaywrightTimeoutError:
                    pass

                final_url = page.url
                screenshot_uuid = str(uuid.uuid4())
                screenshot_path = self.screenshot_dir / f"{screenshot_uuid}.png"
                await page.screenshot(path=str(screenshot_path), full_page=True)

                return {"final_url": final_url, "screenshot_uuid": screenshot_uuid}
            finally:
                await page.close()

    async def close(self) -> None:
        if self.browser:
            await self.browser.close()
            self.browser = None
        if self.playwright:
            await self.playwright.stop()
            self.playwright = None


crawler = UrlCrawler()
