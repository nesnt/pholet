# Rencana Migrasi Serverless (Supabase & Google Drive API OAuth)

Kita akan memigrasikan database PostgreSQL lokal ke **Supabase** dan penyimpanan gambar lokal ke **Google Drive API**. Sesuai permintaan Anda, kita akan menggunakan metode otentikasi **OAuth 2.0 (User Credentials)** untuk Google Drive agar terhindar dari pembatasan limit kuota milik Service Account, sehingga akun pribadi Anda yang akan melakukan unggahan.

> [!NOTE]
> **Branch Khusus Dibuat**
> Pekerjaan ini akan dan sedang dilakukan di branch baru bernama `feature/serverless`. Branch utama Anda (dengan local storage) tidak akan terpengaruh.

## Kebutuhan & Instruksi Setup (Mohon Disiapkan)

Karena Anda sudah cukup akrab dengan infrastruktur Google Drive API, berikut adalah pengingat apa saja yang perlu Anda siapkan sebelum kita mengubah kode:

> [!IMPORTANT]
> **1. Kredensial Supabase**
> Buat project di [supabase.com](https://supabase.com), kemudian dapatkan `DATABASE_URL` (Connection string berupa `Transaction` atau `Session` mode) untuk diletakkan di `.env`.

> [!IMPORTANT]
> **2. Kredensial Google Drive API (OAuth 2.0)**
> Karena kita menggunakan OAuth, Anda perlu mendapatkan:
> - `GOOGLE_CLIENT_ID`
> - `GOOGLE_CLIENT_SECRET`
> - `GOOGLE_REDIRECT_URI` (biasanya `https://developers.google.com/oauthplayground` untuk mengambil token awal)
> - `GOOGLE_REFRESH_TOKEN` (Dapatkan dari OAuth Playground menggunakan kredensial di atas, pastikan memiliki scopes: `https://www.googleapis.com/auth/drive.file` atau `https://www.googleapis.com/auth/drive`).
> - `GOOGLE_DRIVE_FOLDER_ID` (ID folder Google Drive tempat foto akan disimpan, pastikan folder ini diset "Anyone with the link can view").

## Perubahan Kode yang Diajukan

### 1. Modifikasi Dependensi

#### [NEW] `package.json`
- Menambahkan library `googleapis` untuk mempermudah integrasi dengan Google Drive API OAuth2.

### 2. Migrasi Database (Supabase)

#### [MODIFY] `prisma/schema.prisma`
- Menyesuaikan `datasource db` jika ada parameter khusus (meskipun biasanya `provider = "postgresql"` dengan `DATABASE_URL` Supabase sudah cukup).

#### [MODIFY] `.env`
- Menambahkan Environment Variables untuk Supabase (`DATABASE_URL`, `DIRECT_URL`) dan Google Drive (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_DRIVE_FOLDER_ID`).

### 3. Modifikasi Logika Upload Foto

#### [NEW] `src/lib/gdrive.ts`
- Membuat file helper khusus untuk inisiasi client Google Drive API (`google.auth.OAuth2`) menggunakan Refresh Token Anda, agar access token diperbarui secara otomatis ketika kedaluwarsa.

#### [MODIFY] `src/app/api/photos/route.ts`
- **Hapus** logika yang menyimpan gambar ke `public/uploads` menggunakan `fs/promises`.
- **Tambahkan** logika untuk mengubah stream file yang di-upload ke format yang bisa dikirimkan lewat `drive.files.create()`.
- **Ambil** ID file dari Google Drive, lalu buat URL publiknya (misal: `https://drive.google.com/uc?id={fileId}` atau `webContentLink` bawaan).
- **Simpan** public URL tersebut ke database PostgreSQL (Supabase).

## Rencana Verifikasi

### 1. Instalasi dan Setup
- Menjalankan `npm install googleapis`.
- Melakukan migrasi database ke Supabase: `npx prisma db push`.

### 2. Pengujian Fungsional
- Mencoba mengunggah foto melalui web app.
- Memverifikasi apakah foto berhasil masuk ke akun Google Drive pribadi Anda di dalam folder yang ditentukan.
- Memverifikasi apakah foto berhasil dirender di galeri web aplikasi menggunakan public URL.

---
**Review & Lanjutkan:** 
Jika rencana ini sudah sesuai dengan ekspektasi Anda, Anda bisa menekan tombol **Proceed** (atau menyetujuinya di chat). Mohon pastikan juga Anda sudah siap dengan nilai-nilai variabel untuk Supabase dan kredensial OAuth Google Drive!
