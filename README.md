# IATF 16949 Document Control System

Aplikasi React untuk kontrol dokumen IATF 16949: dashboard, daftar dokumen, detail histori revisi, upload simulasi, workflow approval, audit log, dan mapping klausul.

## Jalankan Lokal

```bash
npm install
npm run dev
```

Buka URL yang ditampilkan Vite, biasanya:

```text
http://127.0.0.1:5173/
```

## Build Production

```bash
npm run build
npm run preview
```

## Catatan

- Data dokumen dan audit log disimpan di `localStorage` browser.
- Upload file saat ini menyimpan metadata file, bukan file asli.
- Untuk produksi multi-user perlu backend storage, autentikasi, role permission, dan database.
