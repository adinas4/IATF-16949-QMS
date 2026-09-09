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

## Audit Supplier dan Identitas Pengguna

- Masuk memakai nama lengkap dan pilihan departemen. Sesi disimpan di sessionStorage; tombol Keluar menghapus sesi. Ini identifikasi tanpa password, bukan autentikasi atau pembatasan akses server.
- Menu Audit Supplier menyediakan checklist dari form audit supplier certified untuk 11 departemen. Auditor dan departemen mengikuti identitas saat masuk; draft hanya dapat diedit melalui UI oleh identitas yang sama. Semua pengguna dapat melihat hasil.
- Buat audit, isi supplier/tanggal, nilai 0-4 atau N/A, bukti, dan tindakan koreksi. Draft dapat dilanjutkan setelah masuk kembali dengan identitas yang sama.
- Finalisasi mensyaratkan semua item terisi, bukti/alasan N/A, minimal satu nilai berlaku, dan tindakan koreksi untuk nilai 0-2. Audit final tidak dapat diedit melalui UI.
- Skor dibulatkan ke bilangan bulat: jumlah nilai / (4 x jumlah item berlaku) x 100. A: minimal 85; B: minimal 70; C: di bawah 70. Ini kriteria internal, bukan hasil sertifikasi.
- Rekap supplier memakai rata-rata skor final terbaru per departemen berdasarkan tanggal audit, kemudian waktu finalisasi. Departemen yang belum mengaudit tidak dihitung. Filter departemen juga berlaku untuk rekap.
- Audit supplier disimpan khusus di localStorage (`iatf:supplier-audits:v1`), belum disinkronkan ke Firestore atau perangkat lain. Jangan hapus data browser jika masih diperlukan.
- Uji logika skor dan finalisasi dengan Node.js 24: `node --test tests/supplier-audit.test.mjs`.

### Form checklist departemen

Menu Audit Supplier memuat 105 pertanyaan dari 15 area audit pada `Check and Finding Sheet Audit Supplier PT MRP Certified`, lalu membagikannya ke 11 departemen terkait. Setiap item menyimpan bukti objektif yang diharapkan, nomor dokumen atau referensi observasi, bukti aktual, uraian temuan, kategori hasil (Conformity, Observation, OFI, Minor, atau Major), nilai, tindakan koreksi, PIC, dan target penyelesaian. Audit baru memakai checklist departemen pengguna; audit lama tetap memakai snapshot checklist aslinya.
