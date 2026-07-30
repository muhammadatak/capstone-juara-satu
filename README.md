# Phiseye — Fraud and Phising Detection System

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> **Lindungi Diri dari Penipuan Digital**

AmbaPhish adalah sebuah sistem terpadu berbasis web yang dirancang untuk mendeteksi, menganalisis, dan mencegah upaya *phishing* dan *fraud* di ekosistem perbankan digital. Dengan menggunakan kombinasi *Natural Language Processing* (NLP) dan pengecekan parameter secara *real-time*, sistem ini membantu pengguna memverifikasi keabsahan tautan, pesan, dan nomor telepon.

---

## Daftar Isi
1. [Tentang Proyek](#tentang-proyek)
2. [Algoritma Scoring](#algoritma-scoring)
3. [Tech Stack](#tech-stack)
4. [Arsitektur Sistem](#arsitektur-sistem)
5. [Prasyarat](#prasyarat)
6. [Setup & Menjalankan Proyek](#setup--menjalankan-proyek)
7. [Struktur Folder](#struktur-folder)
8. [Kontribusi Tim](#kontribusi-tim)
9. [Lisensi](#lisensi)

---

## Tentang Proyek

Sistem Anti-Phishing dan Fraud (AmbaPhish) ini dikembangkan sebagai bagian dari **Capstone Project FILKOM Universitas Brawijaya Semester Genap 2025/2026** (Topik B.3: Advanced Phishing and Fraud), yang bekerja sama dengan **CIMB Niaga** sebagai mitra industri dan penyedia studi kasus.

**Fitur Utama:**
- Analisis komprehensif pesan SMS/WhatsApp/Email/URL secara *real-time*.
- Kalkulasi *Risk Score* (0–100) dilengkapi penjelasan detail dalam Bahasa Indonesia.
- *Live highlight* indikator dan pola kata manipulatif dalam teks.
- Deteksi *Typosquatting* untuk URL yang mencurigakan.
- Sistem pelaporan terintegrasi dengan pembuatan nomor tiket laporan.
- Pusat edukasi keamanan digital interaktif dengan sistem gamifikasi.
- *Admin dashboard* untuk memantau, menganalisis (analytics), dan melakukan *triage* laporan fraud.

---

## Algoritma Scoring

Sistem kami menggunakan algoritma penilaian risiko (*Risk Scoring*) berbasis aturan dan model *Machine Learning*:

| Kondisi | Poin Penalti |
|---|---|
| URL / Nomor / Email tidak ditemukan di *whitelist* | +80 Poin |
| Terdapat pola bahasa manipulatif (Deteksi via NLP) | +20 Poin |
| Hanya berisi teks manipulatif (tanpa URL/kontak spesifik) | Auto 100 Poin |

**Kategorisasi Tingkat Risiko:**
- **0 - 30**: 🟢 Aman
- **31 - 70**: 🟡 Waspada
- **71 - 100**: 🔴 Bahaya

---

## Tech Stack

Sistem ini dibangun dengan memisahkan arsitektur backend, frontend, dan database:

- **Backend**: FastAPI (Python), PostgreSQL 16, Alembic (Migration), `uv` (Package Manager)
- **Frontend**: React 18, Vite, Tailwind CSS, Zustand, Axios, Recharts, Framer Motion, Lucide React
- **ML/AI**: `[ISI DENGAN NAMA MODEL ML ANDA, misal: phishing_nlp_model.pkl]`
- **Infrastructure**: Docker (hanya untuk menjalankan instance PostgreSQL lokal)

---

## Arsitektur Sistem

Berikut adalah representasi alur pemrosesan data sistem dari masukan pengguna hingga menghasilkan *Risk Score*:

```ascii
[User Input] (URL/SMS/WA/Email)
      │
      ▼
[Frontend UI] ──(REST API POST)──▶ [FastAPI Backend]
                                          │
                                          ▼
                                ┌────────────────────────┐
                                │   Orkestrasi Analisis  │
                                ├────────────────────────┤
                                │ 1. Whitelist Check     │
                                │ 2. Typosquatting Check │
                                │ 3. NLP Model Scoring   │
                                └─────────┬──────────────┘
                                          │
                                          ▼
                                 [Risk Score Engine] ──(Save)──▶ [PostgreSQL DB]
                                          │
                                          ▼
[Frontend UI] ◀──(REST API Response)── [JSON: Score & Highlight]
      │
      ▼
[Tampilan Hasil Analisis di Layar Pengguna]
```

---

## Prasyarat

Pastikan perangkat lokal Anda telah memenuhi kriteria berikut sebelum melakukan proses instalasi:

- **Python**: Versi 3.10 atau lebih tinggi
- **Node.js**: Versi 18 atau lebih tinggi beserta `npm`
- **Docker**: Docker Desktop terinstal dan berjalan (untuk database PostgreSQL)
- **uv**: Package manager untuk Python (install via `pip install uv`)

---

## Setup & Menjalankan Proyek

Ikuti instruksi di bawah ini dengan urutan yang benar untuk menjalankan sistem di komputer lokal Anda.

### A. Clone Repository

Pertama, salin repositori ini ke komputer lokal Anda:

```bash
git clone [URL_REPOSITORY_ANDA]
cd capstone-juara-satu
```

*(Catatan: Sesuaikan URL repository jika diperlukan)*

### B. Setup Database (PostgreSQL via Docker)

Pastikan Docker Desktop sudah terbuka dan berjalan. Jalankan perintah berikut di **CMD/Terminal utama komputer Anda** (bukan terminal internal VS Code):

```bash
docker run -d --name my-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=123 -e POSTGRES_DB=phising_db -p 5432:5432 postgres:16
```
*(Perintah ini harus dijalankan dalam satu baris)*

### C. Setup Backend

1. Buka folder backend.
2. Buat file `.env` di dalam folder `backend/` dan sesuaikan dengan `.env.example` (Minta konfigurasi dari tim jika belum ada, misalnya variabel `DATABASE_URL`, `SECRET_KEY`, dll).
3. Salin file model *Machine Learning* Anda ke dalam folder `backend/services/model/`.
4. Buka **New Terminal Window** di VS Code, lalu jalankan perintah berikut:

```bash
cd backend
uv sync
```

5. Aktivasi *Virtual Environment*:

**Untuk Windows:**
```bash
.venv\Scripts\activate
```

**Untuk Mac/Linux:**
```bash
source .venv/bin/activate
```
*(Pastikan sudah muncul tulisan `(backend)` atau indikator virtual env di terminal Anda)*

6. Lakukan migrasi database:
```bash
alembic upgrade head
```

7. Jalankan server Backend:
```bash
fastapi dev
```

### D. Setup Frontend

1. Buka **New Terminal Window** baru lagi di VS Code (biarkan terminal backend tetap berjalan).
2. Pindah ke direktori frontend, install dependencies, dan jalankan server frontend:

```bash
cd frontend
npm install
npm run dev
```

### E. Akses Aplikasi

Setelah semua layanan berhasil dijalankan, Anda dapat mengakses sistem melalui URL berikut:

- **Frontend Aplikasi**: [http://localhost:5173](http://localhost:5173) (Atau port default Vite yang tertera di terminal Anda)
- **Backend API Server**: [http://localhost:8000](http://localhost:8000)
- **API Documentation (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Struktur Folder

```text
capstone-juara-satu/
├── backend/                  # Konfigurasi dan layanan backend (FastAPI)
│   ├── alembic/              # Konfigurasi migrasi database Alembic
│   ├── routers/              # Endpoint API route
│   ├── services/             # Logic bisnis utama (auth, nlp, scoring, dll)
│   │   └── model/            # Direktori penyimpanan file model ML (.pkl/.onnx)
│   ├── .env                  # Environment variables (buat file ini)
│   ├── main.py               # Entry point aplikasi FastAPI
│   └── uv.lock               # Dependency lockfile uv
│
└── frontend/                 # Source code frontend (React + Vite)
    ├── public/               # Asset statis publik
    ├── src/                  # Komponen, Halaman, dan State Management
    ├── package.json          # List dependency npm
    └── vite.config.js        # Konfigurasi build tools Vite
```

---

## Kontribusi Tim

Sistem ini dirancang dan dikembangkan secara kolaboratif oleh Kelompok 3 Cihuy:

| Nama | NIM | Program Studi | Peran Utama |
|---|---|---|---|
| Muhammad Ahsan Ata Taufik | 235150207111026 | Teknik Informatika | ML Engineer / Backend |
| Samuel Adeputra | 235150207111028 | Teknik Informatika | Backend |
| Dzaky Rezandi | 235150207111006 | Teknik Informatika | ML Engineer / Data Analyst |
| Muhammad Rizqi Hidayatullah | 235150401111039 | Sistem Informasi | Frontend / UI Design |
| Aqila Noraihana | 235150401111057 | Sistem Informasi | Product Manager |
| Daffa Fawwaz Garibaldi | 235150307111011 | Teknik Komputer | QA & Educational Content |
| Arza Marevi Bangun | 235150200111057 | Teknik Informatika | Backend |

---

## Lisensi

[MIT License](https://opensource.org/licenses/MIT) — Proyek Akademik FILKOM UB 2026. 

Sistem ini dikembangkan secara spesifik untuk tujuan edukasi dan perancangan *prototype* solusi industri.

---
*Dibuat oleh Tim Capstone B.3 — FILKOM UB 2026*
