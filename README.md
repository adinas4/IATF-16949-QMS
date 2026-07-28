# IATF 16949 Document Control System

Aplikasi React untuk kontrol dokumen IATF 16949: dashboard, daftar dokumen, detail histori revisi, upload simulasi, workflow approval, audit log, mapping klausul, coverage dashboard, gap analyzer, compliance matrix, CSR indicator, dan report export.

## Modul Clause Coverage

- Clause tree interaktif dengan expand/collapse dan breadcrumb.
- Drag-and-drop mapping dokumen ke klausul.
- Coverage dashboard dengan indikator hijau/kuning/merah.
- Gap analyzer dengan rekomendasi dokumen per klausul.
- Compliance matrix dengan quick filter: All, Covered, Partial, Uncovered, CSR.
- Search klausul dengan autocomplete.
- Report generator export CSV/JSON/Excel dan PDF via browser print.

Catatan lisensi: data klausul di aplikasi memakai kode, judul/parafrase, metadata, dan rekomendasi dokumen. Teks resmi standar tidak disalin ke repo.

## Artefak Implementasi

- Schema dan SQL seed: `docs/database-schema-and-seed.sql`
- API documentation: `docs/api.md`
- Step-by-step implementasi: `docs/implementation-guide.md`
- Testing strategy 100% coverage: `docs/testing-strategy.md`
- Deployment guide: `docs/deployment-guide.md`

## Jalankan Lokal

```bash
npm install
npm run dev
```

Buka URL yang ditampilkan Vite, biasanya:

```text
http://127.0.0.1:5173/
```

## Hubungkan ke Firebase Firestore

1. Buka Firebase Console project `iatf-16949-qms`.
2. Masuk ke Project settings > General > Your apps.
3. Tambahkan Web App jika belum ada, lalu salin Firebase config.
4. Buat file `.env.local` dari `.env.example`.
5. Isi nilai `VITE_FIREBASE_*` sesuai config Web App.
6. Aktifkan Firestore Database di Firebase Console.
7. Jalankan ulang dev server.

Contoh rules awal untuk development:

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Rules di atas hanya untuk development. Untuk produksi, gunakan Firebase Authentication dan batasi write berdasarkan role.

## Build Production

```bash
npm run build
npm run preview
```

## Catatan

- Data dokumen dan audit log disimpan di Firestore jika `.env.local` sudah dikonfigurasi.
- Jika Firebase belum dikonfigurasi atau koneksi gagal, aplikasi fallback ke `localStorage` browser.
- Upload file saat ini menyimpan metadata file, bukan file asli.
- Untuk produksi multi-user perlu backend storage, autentikasi, role permission, dan database.
