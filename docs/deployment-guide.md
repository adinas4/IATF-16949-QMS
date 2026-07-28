# Deployment Guide

## Frontend Prototype

1. Install dependencies:

```bash
npm install
```

2. Build:

```bash
npm run build
```

3. Preview:

```bash
npm run preview
```

## Firebase Mode

1. Copy `.env.example` to `.env.local`.
2. Fill `VITE_FIREBASE_*`.
3. Enable Firestore.
4. Deploy the static `dist` output to Firebase Hosting, Netlify, Vercel, or an internal web server.

## API + PostgreSQL Mode

1. Provision PostgreSQL.
2. Run:

```bash
psql "$DATABASE_URL" -f docs/database-schema-and-seed.sql
```

3. Deploy the backend service implementing `docs/api.md`.
4. Set frontend API env var, for example `VITE_API_BASE_URL=https://qms.example.com/api/v1`.
5. Replace direct Firestore calls with the API client.

## Production Checklist

- Authentication enabled.
- Role checks for document approval and mapping changes.
- Object storage configured for original files.
- Database backups scheduled.
- Audit log retention policy approved.
- Official IATF content access restricted to licensed users if stored.
- Monitoring alerts for API errors, failed uploads, and uncovered critical clauses.
