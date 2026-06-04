from contextlib import asynccontextmanager
from routers import admins

from database import engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import tickets, auth
from services.url_crawler import crawler
from config import settings


@asynccontextmanager
async def lifespan(_app: FastAPI):
    try:
        # Inisialisasi browser Playwright saat startup
        try:
            await crawler.initialize_browser()
            print("[Crawler] Browser Playwright berhasil diinisialisasi")
        except Exception as e:
            print(f"[Crawler] Gagal inisialisasi browser: {e}")
        yield
    finally:
        await crawler.close()
        await engine.dispose()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.allowed_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/screenshots",
    StaticFiles(directory=str(crawler.screenshot_dir)),
    name="screenshots",
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
app.include_router(admins.router, prefix="/admin/tickets", tags=["admins"])
