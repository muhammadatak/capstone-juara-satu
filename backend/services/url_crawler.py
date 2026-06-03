import asyncio
import threading
import uuid
from pathlib import Path
from typing import Optional

from playwright.sync_api import (
    Browser,
    TimeoutError as PlaywrightTimeoutError,
    sync_playwright,
)

BASE_DIR = Path(__file__).resolve().parent.parent


class UrlCrawler:
    """Crawler menggunakan sync Playwright, dijalankan di thread terpisah
    via asyncio.to_thread() agar tidak memblokir event loop FastAPI."""

    def __init__(self, max_concurrency: int = 7, screenshot_dir: Optional[Path] = None):
        self._lock = threading.Semaphore(max_concurrency)
        self._browser: Optional[Browser] = None
        self._playwright = None
        self.screenshot_dir = screenshot_dir or (BASE_DIR / "screenshots")
        self.screenshot_dir.mkdir(parents=True, exist_ok=True)

    # ── internal sync ──────────────────────────────────────────────

    @staticmethod
    def _normalize_url(url: str) -> str:
        if not url:
            return url
        if "://" not in url:
            return f"https://{url}"
        return url

    def _init_browser_sync(self) -> None:
        if self._browser:
            return
        self._playwright = sync_playwright().start()
        self._browser = self._playwright.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-gpu",
                "--disable-blink-features=AutomationControlled",
                "--disable-dev-shm-usage",
                "--disable-web-security",
            ],
        )

    def _crawl_sync(self, url: str) -> dict[str, str]:
        url = self._normalize_url(url)

        with self._lock:
            self._init_browser_sync()
            if not self._browser:
                raise RuntimeError("Browser failed to initialize")

            context = self._browser.new_context(
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/131.0.0.0 Safari/537.36"
                ),
                viewport={"width": 1280, "height": 720},
                ignore_https_errors=True,
                extra_http_headers={
                    "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                },
            )
            page = context.new_page()
            try:
                # Coba 30 detik — fallback ke load state minimal
                try:
                    page.goto(
                        url,
                        wait_until="domcontentloaded",
                        timeout=30000,
                        referer="https://www.google.com/",
                    )
                except PlaywrightTimeoutError:
                    print(f"[Crawler] Timeout loading page, capturing partial: {url}")
                    try:
                        page.goto(url, wait_until="commit", timeout=10000)
                    except PlaywrightTimeoutError:
                        pass

                # Tunggu network idle sebentar, jangan blocking
                try:
                    page.wait_for_load_state("networkidle", timeout=5000)
                except PlaywrightTimeoutError:
                    pass

                final_url = page.url
                screenshot_uuid = str(uuid.uuid4())
                screenshot_path = self.screenshot_dir / f"{screenshot_uuid}.png"
                page.screenshot(path=str(screenshot_path), full_page=True)

                return {"final_url": final_url, "screenshot_uuid": screenshot_uuid}
            except Exception as e:
                raise RuntimeError(f"Crawl failed for {url}: {type(e).__name__}: {e}")
            finally:
                context.close()

    def _close_sync(self) -> None:
        if self._browser:
            self._browser.close()
            self._browser = None
        if self._playwright:
            self._playwright.stop()
            self._playwright = None

    # ── public async (dipanggil dari endpoint FastAPI) ────────────

    async def initialize_browser(self) -> None:
        """Inisialisasi browser di thread terpisah."""
        await asyncio.to_thread(self._init_browser_sync)

    async def crawl(self, url: str) -> dict[str, str]:
        """Jalankan crawl di thread terpisah agar tidak blocking event loop."""
        return await asyncio.to_thread(self._crawl_sync, url)

    async def close(self) -> None:
        """Tutup browser di thread terpisah."""
        await asyncio.to_thread(self._close_sync)


crawler = UrlCrawler()
