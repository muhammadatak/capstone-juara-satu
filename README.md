# TUTORIAL MENJALANKAN PROYEK DI LOKAL SU



## PERTAMA YA BACKEND

INSTALL UV DI CMD SU

```bash
pip install uv
```

Masuk ke folder backend LEWAT TERMINAL VSCODE AJA NEW TERMINAL WINDOW:

```bash
cd backend
```


Install dependency:

```bash
uv sync
```

KALO BELOM ADA tulisan "(backend)" di terminal
```bash
.venv/Scripts/activate
````

RUN BACKEND
```bash
fastapi dev
```

## KEDUA SU

BUKA TERMINAL BARU  DI VSCODE YANG NEW TERMINAL WINDOW TERUS CD KE FE

```bash
cd frontend
```

Install dependency:

```bash
npm install
```
Jalankan frontend:

```bash
npm run dev
```

Jalankan migrasi database:

## KETIGA SU MENJALANKAN POSTGRES NDEK DOCKER SU
1. BUKA DULU DOCKER DESKTOP

2. Jalankan KODE INI DI CMD YA BUKAN TERMINAL VSCODE:

3. HARUS SEBARIS!

```bash
docker run -d --name my-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=123 -e POSTGRES_DB=phising_db -p 5432:5432 postgres:16
```

TERAKHIR INI Y

```bash
alembic upgrade head
```

## KALO GABISA YAUDA





