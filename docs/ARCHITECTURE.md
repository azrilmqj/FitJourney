# Struktur proyek

FitJourney memakai pemisahan sederhana untuk produk tahap awal. Tambahkan modul saat ada kebutuhan; belum memakai repository layer, event bus, atau abstraksi enterprise.

## Backend

Alur request:

```text
app.js → routes → middleware → controller → service / model → MongoDB
                              ↓
                       error middleware
```

| Folder         | Tanggung jawab                                                                      |
| -------------- | ----------------------------------------------------------------------------------- |
| `config/`      | Environment dan koneksi MongoDB                                                     |
| `routes/`      | URL, metode HTTP, urutan middleware, pemilihan controller                           |
| `middleware/`  | Authentication, authorization, Origin, rate limit, validasi, error                  |
| `controllers/` | Menerima input tervalidasi, memanggil operasi, mengirim HTTP response               |
| `services/`    | Alur bisnis lintas operasi: autentikasi, sesi, email, password, hapus data, nutrisi |
| `models/`      | Satu model Mongoose per file beserta index                                          |
| `validators/`  | Skema Zod per fitur; hasil middleware tersedia pada `req.validated`                 |
| `seeders/`     | Data contoh, runner seed, migrasi gambar contoh                                     |
| `utils/`       | Error aplikasi bersama                                                              |

Controller boleh memakai model langsung untuk CRUD sederhana. Service dipakai ketika ada alur bisnis, perhitungan, atau operasi beberapa model; tidak ditambahkan hanya untuk meneruskan satu pemanggilan.

Contoh menambah field progres:

1. Tambahkan field dan aturan ke `models/Progress.js` serta `validators/progress.validator.js`.
2. Bila perlu, ubah `controllers/progress.controller.js`.
3. Endpoint dan pemeriksaan hak akses tetap berada di `routes/progress.routes.js`.

## Frontend

```text
src/
  app/                 App, AppRoutes, ProtectedRoute
  config/              URL gambar online dan konfigurasi navigasi
  contexts/            Definisi context bersama
  providers/           Lifecycle context (AuthProvider)
  hooks/               Hook umum: useAuth, useResource
  services/            HTTP client dan API per domain
  types/               Tipe model frontend
  components/
    ui/                Card, Modal, Tabs, Avatar, loading/error state
    layout/            Sidebar, Topbar, MobileNav, AppLayout
  features/
    auth/              pages, components
    landing/           pages
    dashboard/         pages, components, hooks
    workouts/          pages, components
    articles/          pages, components
    nutrition/         pages
    progress/          pages, components
    profile/           pages
    settings/          pages
    admin/             pages, components
  styles/              base, layout, components, dashboard, landing, responsive
```

Halaman menyusun komponen fitur. Form besar mempunyai komponen sendiri, misalnya `AuthForm`, `PasswordForm`, `ProgressEntryForm`, dan `ContentForm`. Dashboard memisahkan pengambilan/perhitungan data dalam `useDashboardData`, kemudian menampilkannya melalui komponen hero, aktivitas, mingguan, dan progres.

Service API menjadi tempat operasi tulis. `useResource` menangani pemuatan GET, retry, dan mengabaikan respons setelah komponen dilepas. Gunakan alias `@/` untuk impor dari `src`.

## Gambar

Hero memakai URL online di `fe/src/config/images.ts`. Gambar konten merupakan URL di MongoDB; default seed ada di `be/src/seeders/demo.data.js`. Tidak ada file foto yang harus dibundel. Foto bawaan menampilkan atlet pria, makanan, atau alam.

## Batas produk awal

Belum ada layanan upload foto, newsletter otomatis, atau infrastruktur deployment multi-instance. Pengaturan SMTP diperlukan untuk email reset password. Contoh konten dapat diganti melalui admin. Lihat README untuk perintah dan konfigurasi.
# Bahasa, admin, dan notifikasi

- `LanguageProvider` menyimpan pilihan EN/ID di browser dan mengatur bahasa dokumen. Kamus berada di `fe/src/i18n/locales`; gunakan `useLanguage().t()` untuk teks antarmuka. Nilai enum formulir tetap menggunakan nilai API asli. Judul dan isi konten editorial mengikuti bahasa yang ditulis admin.
- Admin masuk ke `/admin` dengan navigasi pengelolaan pengguna, latihan, artikel, dan progres komunitas. Anggota masuk ke dashboard pribadi. Pembatasan akses tetap diperiksa oleh middleware backend.
- Logout membuka dialog konfirmasi sebelum permintaan API dilakukan. Batal dan Escape mempertahankan sesi; konfirmasi menjalankan transisi logout.
- `GET /api/notifications` menghasilkan kabar sesuai role dari data aplikasi: anggota baru dalam tujuh hari terakhir dan draf untuk admin; sambutan dan konten baru untuk anggota. Daftar dibatasi per jenis dan diurutkan terbaru.
- `POST /api/notifications/read` menyimpan waktu baca pada pengguna yang sedang masuk. Ini adalah panel pembaruan sederhana, bukan arsip notifikasi atau pengiriman push/email. Preferensi email terpisah dari status baca panel.
