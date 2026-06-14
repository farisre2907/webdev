# 🎓 Panduan Arsitektur & Deployment Multi-Stack Unpad Merch Hub

Berkas ini menyediakan panduan konfigurasi, struktur berkas, dan langkah-langkah deployment untuk mereplikasi, mengembangkan, atau merilis aplikasi Unpad Merch Hub Anda ke berbagai infrastruktur production tanpa batasan (`full-stack`).

---

## 🌐 1. Front-End (HTML, CSS, Tailwind/Bootstrap, JavaScript)
Aplikasi front-end Anda dirancang sebagai **Single Page Application (SPA)** yang responsif menggunakan React (dapat dideploy langsung tanpa build step/bundling, atau dibundel via Vite).

### Langkah Hosting Front-End secara Statis (Gratis & Cepat):
*   **Melalui GitHub Pages**:
    1. Buat repositori baru di GitHub, unggah berkas `index.html` dan folder `assets`.
    2. Masuk ke **Settings > Pages**.
    3. Pilih Branch `main` sebagai sumber folder kearsipan, tekan tombol **Save**.
    4. Web Anda aktif dalam 1 menit!
*   **Melalui Vercel**:
    1. Hubungkan akun GitHub Anda ke [Vercel](https://vercel.com).
    2. Pilih menu **Add New > Project**, lalu impor repositori GitHub tersebut.
    3. Pilih preset **Other / Static** dan langsung klik **Deploy**.
*   **Melalui Netlify**:
    1. Daftarkan diri di [Netlify](https://netlify.com).
    2. Tarik folder aplikasi desktop Anda secara langsung ke kotak unggahan seret-dan-taruh (Drag & Drop box).
    3. Atur nama domain gratis sesuai keinginan Anda!

---

## ⚙️ 2. Back-End & REST API
Pilih salah satu dari 3 teknologi backend modern di bawah ini untuk mengelola logic dan otentikasi aman database SQL:

### A. PHP / Laravel (Sangat Cocok untuk Shared Hosting cPanel / VPS)
*   **Berkas Rujukan**: [`/src/blueprints/laravel_controller.php`](./laravel_controller.php)
*   **Cara Memasang di Shared Hosting (cPanel)**:
    1. Buat folder baru di luar folder `public_html` (misal: `merchandis_core`).
    2. Unggah berkas Laravel Anda ke folder tersebut kecuali folder `public`.
    3. Unggah isi folder `public` Laravel langsung ke dalam `public_html`.
    4. Edit berkas `public_html/index.php`, sesuaikan jalur manual (path) `autoload.php` dan `app.php` ke folder `merchandis_core/bootstrap/...`.
    5. Atur koneksi DB pada file `.env`.

### B. Node.js & Express (Modern, Ringan, Instan di VPS / VPS Docker)
*   **Berkas Rujukan**: [`/src/blueprints/nodejs_server.js`](./nodejs_server.js)
*   **Cara Meluncurkan di VPS (Ubuntu)**:
    1. Pasang Node.js & npm: `sudo apt update && sudo apt install nodejs npm -y`
    2. Salin folder backend, unduh dependensi: `npm install express cors pg mysql2`
    3. Pasang manajer proses latar belakang: `sudo npm install pm2 -g`
    4. Nyalakan server: `pm2 start nodejs_server.js --name "unpad-merch-api"`
    5. Agar server tetap menyala setelah booting ulang VPS: `pm2 startup && pm2 save`

### C. Django / Python (Kuat, Terstruktur, Terbaik untuk Backend Berkeamanan Tinggi)
*   **Berkas Rujukan**: [`/src/blueprints/django_views.py`](./django_views.py)
*   **Cara Deploy**: Dapat di-host menggunakan Gunicorn & Nginx sebagai reverse proxy di VPS Anda.

---

## 🗄️ 3. Database SQL
Sesuaikan database pilihan Anda berdasarkan skema relasional terstruktur:

*   **Pilihan A: MySQL**
    *   **Berkas Skema**: [`./schema.sql`](../../schema.sql)
    *   **Shared Hosting cPanel Setup**: Gunakan menu **MySQL Database Wizard**, buat database & user baru, berikan hak akses (privileges), lalu buka **phpMyAdmin** dan lakukan **Import** berkas `schema.sql`.
*   **Pilihan B: PostgreSQL**
    *   **Berkas Skema**: [`./postgresql_schema.sql`](./postgresql_schema.sql)
    *   **Cloud Setup**: Dapat dideploy langsung di penyedia pangkalan cloud serverless gratis seperti [Neon.tech](https://neon.tech) atau Supabase, atau diinstal di VPS Linux `sudo apt install postgresql postgresql-contrib`.

---

## 🚀 4. Panduan Deployment VPS Singkat (Ubuntu Server)
Gunakan kombinasi Nginx + PM2 + MySQL untuk setup VPS milik Anda:

### Langkah instalasi MySQL di VPS ubuntu:
```bash
sudo apt update
sudo apt install mysql-server -y
sudo mysql_secure_installation
# Hubungkan Database
sudo mysql -u root -p < schema.sql
```

### Konfigurasi Nginx Reverse Proxy (`/etc/nginx/sites-available/default`):
```nginx
server {
    listen 80;
    server_name api.unpadmerch.my.id;

    location / {
        proxy_pass http://localhost:3000; # Mengarahkan ke Port Node.js Express
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Hubungkan konfigurasi dan restart Nginx: `sudo systemctl restart nginx`
