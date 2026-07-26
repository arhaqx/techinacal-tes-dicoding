# Dicoding Jobs Submission

Aplikasi web pencarian dan manajemen lowongan kerja (Dicoding Jobs) fullstack yang dibangun menggunakan Next.js (App Router) sebagai frontend dan Django REST Framework (DRF) sebagai backend RESTful API.

---

## 1. Project Overview

Project Dicoding Jobs memfasilitasi pencarian kerja bagi pengembang software serta penyediaan portal rekrutmen bagi perusahaan/recruiter.
Aplikasi ini memiliki fitur utama:
- **Daftar Lowongan Kerja**: Menampilkan daftar lowongan kerja responsif berbasis kartu.
- **Pencarian Real-time**: Fitur pencarian lowongan kerja berdasarkan posisi/judul dengan query filter `?search=`.
- **Detail Lowongan Kerja**: Halaman terpisah yang menampilkan kualifikasi dan informasi lengkap lowongan.
- **Tambah Lowongan (Recruiter)**: Modal interaktif untuk posting lowongan baru secara instan.
- **CORS Handling**: Terkonfigurasi untuk integrasi antara frontend Next.js dan backend Django REST Framework.

---

## 2. Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router) & React 19
- **Styling**: Tailwind CSS v4 & Lucide React Icons
- **State Management & Data Fetching**: TanStack Query v5 (`@tanstack/react-query`)
- **HTTP Client**: Axios
- **E2E Testing**: Playwright (`@playwright/test`)

### Backend
- **Framework**: Python 3.14 & Django 6
- **REST API**: Django REST Framework (DRF)
- **CORS**: `django-cors-headers`
- **Database**: SQLite3 (Bawaan Django, siap pakai)
- **Unit & Integration Testing**: Django Test Suite (`APITestCase`)

---

## 3. Cara Menjalankan Backend (Django REST Framework)

### Prerequisites
- Python 3.10+ installed

### Langkah-langkah:

1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```

2. Buat dan aktifkan Virtual Environment (`venv`):
   - **Windows (PowerShell)**:
     ```powershell
     py -m venv venv
     .\venv\Scripts\activate
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install dependensi yang dibutuhkan:
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

4. Jalankan migrasi database SQLite:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Jalankan server development backend:
   ```bash
   python manage.py runserver
   ```
   Backend API akan berjalan di `http://127.0.0.1:8000/`.

---

## 4. Cara Menjalankan Frontend (Next.js)

### Prerequisites
- Node.js v18+ & npm installed

### Langkah-langkah:

1. Masuk ke direktori frontend:
   ```bash
   cd frontend
   ```

2. Install dependensi Node.js:
   ```bash
   npm install
   ```

3. Jalankan server development Next.js:
   ```bash
   npm run dev
   ```
   Frontend akan berjalan di `http://localhost:3000/`.

---

## 5. Cara Menjalankan Testing

### Backend Unit & Integration Testing (Django)
Jalankan pengujian model & API endpoint di dalam direktori `backend/`:
```bash
cd backend
python manage.py test
```
*Menguji skenario string representation model Vacancy, validasi field wajib diisi, serta endpoint CRUD API (`POST`, `GET`, `GET ?search=`, `GET <id>`, `PUT`, `DELETE`).*

### Frontend End-to-End (E2E) Testing (Playwright)
Jalankan pengujian E2E browser di dalam direktori `frontend/`:
```bash
cd frontend
npx playwright test
```
*Menguji 3 skenario user:*
1. **User opens vacancies list page**: Memastikan halaman utama terbuka & daftar lowongan muncul.
2. **User searches a job by title**: Memasukkan kata kunci pencarian & memastikan hasil filter terupdate.
3. **User views vacancy details**: Mengklik JobCard & memastikan navigasi ke halaman detail lowongan.

---

## 6. API Documentation Ringkas

Base URL: `http://127.0.0.1:8000/api/vacancies/`

| HTTP Method | Endpoint Path | Deskripsi | Query Parameters / Body Payload |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/vacancies/` | Mengambil daftar seluruh lowongan kerja | `?search=<query>` *(opsional)* |
| **POST** | `/api/vacancies/` | Menambahkan lowongan kerja baru (Recruiter) | `{ "title": "...", "company_name": "...", "location": "...", "job_type": "...", "description": "..." }` |
| **GET** | `/api/vacancies/<id>/` | Mengambil detail 1 lowongan kerja berdasarkan UUID `id` | - |
| **PUT** | `/api/vacancies/<id>/` | Memperbarui data lowongan kerja | Body JSON lengkap |
| **PATCH** | `/api/vacancies/<id>/` | Memperbarui parsial data lowongan kerja | Body JSON parsial |
| **DELETE** | `/api/vacancies/<id>/` | Menghapus data lowongan kerja | - |

---

## Struktur Direktori Project

```text
dicoding-jobs-submission/
├── backend/
│   ├── config/             # Django settings & URL root
│   ├── vacancies/          # App vacancies (models, serializers, views, urls, tests)
│   ├── db.sqlite3          # SQLite Database
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router (pages & layout)
│   │   ├── components/     # Reusable UI (JobCard, AddVacancyModal)
│   │   └── services/       # Axios API client (api.ts)
│   ├── tests/              # Playwright E2E spec (vacancies.spec.ts)
│   ├── playwright.config.ts
│   ├── package.json
│   └── next.config.ts
└── README.md               # Dokumentasi Project Utama
```
