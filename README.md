# TUTORIAL MENJALANKAN PROYEK DI LOKAL SU



## PERTAMA YA BACKEND

INSTALL UV DI CMD SU

```bash
pip install uv
```

BUAT FILE .env di BACKEND dan isi dengan yang diberikan atak
```bash
whatsapp atak
```

COPY MODEL KE backend/services/model
```bash
whatsapp atak
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

MIGRASI SEK SU
```bash
alembic upgrade head
```

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


## KETIGA SU MENJALANKAN POSTGRES NDEK DOCKER SU
1. BUKA DULU DOCKER DESKTOP

2. Jalankan KODE INI DI CMD YA BUKAN TERMINAL VSCODE:

3. HARUS SEBARIS!

```bash
docker run -d --name my-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=123 -e POSTGRES_DB=phising_db -p 5432:5432 postgres:16
```

TERAKHIR INI Y


## KALO GABISA YAUDA





![contoh](https://i.pinimg.com/474x/db/23/8d/db238d90129dd8233696a607f7f3a030.jpg)