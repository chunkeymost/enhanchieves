# DocsCMS v1

**Documentation CMS** — Aplikasi berbasis web untuk mengelola dokumentasi software. Client-side SPA dengan penyimpanan di browser (localStorage).

### Fitur Utama

| Fitur | Deskripsi |
|---|---|
| **Dashboard** | Lihat semua dokumen dengan jumlah per status (draft / review / accepted / declined) |
| **Filter & Cari** | Cari judul, filter berdasarkan status dan platform (Mobile / Web / Backend) |
| **Buat & Edit** | Form 6 seksi: Info Dasar, Overview, Screenshots, Flow Diagram, API, Notes |
| **Upload Gambar** | Lampirkan screenshot dan flow diagram per item |
| **API Endpoint** | Definisikan method, endpoint, request/response untuk tiap fitur |
| **Preview** | Lihat dokumen lengkap dengan sidebar navigasi dan breadcrumb |
| **Import / Export** | Download data sebagai JSON atau upload file JSON ke sistem |

### Cara Menjalankan

Karena aplikasi menggunakan `fetch()` untuk seed data, jalankan melalui static server:

```bash
# Python
python3 -m http.server 8000

# Atau pakai VS Code Live Server / extension static server apa pun
```

### Tech Stack

`HTML5` · `CSS3` (`base.css` design tokens) · `Vanilla JS` (ES6+) · `localStorage` · `Font Awesome 6` · `Google Fonts (Inter + JetBrains Mono)`
