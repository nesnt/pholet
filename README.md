# PHOLET - Photo Library and Management

Pholet adalah aplikasi manajemen perpustakaan foto yang dikembangkan dengan bantuan AI seperti Gemini, Claude, dan OpenAI.

Pada repositori proyek ini, terdapat dua *branch* utama: `local` dan `main`. Berikut adalah panduan setup untuk masing-masing *branch*.

Adapun link video untuk melihat tour aplikasi atau contoh penggunaan pada link berikut ini : 
"https://drive.google.com/drive/folders/1_vj4MzyF88rZe4QYk8aj5tMf-xTX0Efv?usp=sharing"

Dan untuk Link website sementara ada disini : 
"https://pholet.vercel.app/"

---

## 1. Branch `local`
Branch ini menggunakan database PostgreSQL yang dijalankan di komputer lokal.

**Langkah-langkah Setup:**
1. Lakukan *clone* repositori dan pastikan berada di branch `local`.
2. Buat file `.env` di direktori utama (root) proyek.
3. Tambahkan konfigurasi URL database lokal ke dalam file `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/?schema=public"
   ```
4. Jalankan perintah `npm install` untuk menginstal dependensi.
5. Terakhir, jalankan `npm run dev` untuk memulai aplikasi.

---

## 2. Branch `main`
Branch ini menggunakan PostgreSQL dari **Supabase** dan penyimpanan gambar menggunakan **Google Drive API**, sehingga branch ini beroperasi secara *serverless*.

**Langkah-langkah Setup:**

### A. Konfigurasi Supabase
1. Buat proyek dan database baru di [Supabase](https://supabase.com/).
2. Simpan URL koneksi database yang nantinya akan dimasukkan ke file `.env`.

### B. Konfigurasi Google Drive API
1. Akses [Google Cloud Console](https://console.cloud.google.com/) dan buat proyek baru.
2. Di kolom pencarian, ketik **"Drive API"** lalu klik dan instal/aktifkan. Tunggu hingga proses selesai.
3. Navigasi ke menu: **APIs & Services > Credentials > Create Credentials > OAuth client ID**.
4. Pada pilihan *Application type*, pilih **Web application**. 
5. Gulir ke bawah ke bagian *Authorized redirect URIs*, tambahkan URL berikut: `https://developers.google.com/oauthplayground`, lalu klik **Save**.
6. Catat atau simpan **Client ID** dan **Client Secret** yang muncul.
7. Kunjungi halaman [OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
8. Klik ikon roda gigi di pojok kanan atas, lalu centang opsi **"Use your own OAuth credentials"**.
9. Masukkan **Client ID** dan **Client Secret** yang sudah Anda dapatkan sebelumnya, kemudian tutup jendela pengaturan.
10. Pada menu di sebelah kiri (Step 1), cari dan klik **"Drive API v3"**.
11. Centang scope: `https://www.googleapis.com/auth/drive`, lalu klik tombol otorisasi.
12. Lanjutkan ke Step 2, lalu klik tombol untuk menukar kode dengan token. Salin dan simpan **Refresh Token** yang didapatkan.
13. Kembali ke Google Cloud Console, navigasi ke: **APIs & Services > OAuth consent screen**.
14. Pada bagian *Publishing status*, ubah opsi **"In production"** (atau *Testing*) menjadi **Public**.
15. Buka Google Drive dengan akun Google yang sama dengan yang digunakan di Google Cloud Console.
16. Buat folder baru yang nantinya akan digunakan untuk menampung foto-foto.
17. Buka folder tersebut dan salin **ID Folder** dari URL browser Anda.

### C. Menjalankan Aplikasi
1. Lakukan *clone* repositori dan pastikan Anda berada di branch `main`.
2. Buat file `.env` di direktori utama proyek.
3. Masukkan konfigurasi berikut ke dalam `.env` dan isi sesuai dengan data kredensial yang telah Anda kumpulkan:

   ```env
   # Connect to Postgres via the shared transaction-mode pooler (IPv4-only)
   DATABASE_URL=
   
   # Connect to Postgres via the shared session-mode pooler (used for migrations)
   DIRECT_URL=
   
   # Google Drive API (OAuth 2.0)
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GOOGLE_REFRESH_TOKEN=
   GOOGLE_DRIVE_FOLDER_ID=
   ```
4. Jalankan perintah `npm install` untuk menginstal dependensi.
5. Terakhir, jalankan `npm run dev` untuk memulai aplikasi.
