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

Jalankan server bawaan (Node.js, tanpa dependencies tambahan):

```bash
node backend/server.js
# → http://localhost:3000
```

Fitur **Backup Data** otomatis menyimpan file JSON ke folder `data/` ketika server berjalan. Jika server tidak aktif, backup akan fallback ke download browser biasa.

> Alternatif: tetap bisa pakai VS Code Live Server / static server lain, tapi fitur backup otomatis ke folder `data/` tidak akan aktif.

### Tech Stack

`HTML5` · `CSS3` (`base.css` design tokens) · `Vanilla JS` (ES6+) · `localStorage` · `Font Awesome 6` · `Google Fonts (Inter + JetBrains Mono)`
