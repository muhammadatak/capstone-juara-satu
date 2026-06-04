FROM python:3.12-slim

WORKDIR /app

# -- system deps: psycopg + Playwright browser --
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    curl \
    libnss3 libnspr4 libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
    libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 \
    libasound2t64 \
    && rm -rf /var/lib/apt/lists/*

# -- uv (Rust-based, 10-100x lebih cepat dari pip) --
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# -- Python deps (pakai lock file biar versi persis sama) --
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# -- Playwright browser --
RUN uv run playwright install chromium --with-deps

# -- app code --
COPY . .

# -- model dir (biarkan jalan walaupun model di-mount volume) --
RUN mkdir -p /app/services/model

# -- screenshots dir --
RUN mkdir -p /app/screenshots

EXPOSE 8000

# jalankan alembic lalu FastAPI
CMD ["sh", "-c", "uv run alembic upgrade head && uv run uvicorn main:app --host 0.0.0.0 --port 8000"]
