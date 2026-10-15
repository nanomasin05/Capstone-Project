# UT Shop Management – UI Redesign

Versi ini mempertahankan alur backend/database project sebelumnya dan mengubah antarmuka agar mendekati desain dashboard UT Shop yang diberikan: sidebar biru, top header, KPI cards, tabel compact, filter, modal input, halaman keuntungan, SHU, laporan, pengguna, dan login baru.

## Jalankan

```powershell
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Buka http://localhost:3000

Demo:
- admin / admin123
- staff / staff123

## Catatan

- Database tetap SQLite untuk development lokal.
- API dan Prisma tetap digunakan untuk transaksi barang, pengadaan, stok, penjualan, laporan, SHU, dan pengguna.
- Rumus/persentase SHU tidak dibuat berdasarkan asumsi; nilai awal 0% sampai ketentuan resmi UT diberikan.
- Data seed hanyalah data contoh untuk pengujian.
- Revisi UI utama berada pada `app/globals.css`, `components/Shell.tsx`, `components/Nav.tsx`, dan seluruh `*Client.tsx`.
- Halaman `Keuntungan` ditambahkan pada `app/profit`.
