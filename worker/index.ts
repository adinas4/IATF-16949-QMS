interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  ACCESS_CODE: string;
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

function isAudit(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const audit = value as Record<string, unknown>;
  return typeof audit.id === 'string' && audit.id.length <= 100 &&
    typeof audit.supplier === 'string' && audit.supplier.length <= 160 &&
    typeof audit.department === 'string' && audit.department.length <= 100 &&
    typeof audit.auditor === 'string' && audit.auditor.length <= 100 &&
    (audit.status === 'Draft' || audit.status === 'Final') &&
    Array.isArray(audit.answers) && audit.answers.length <= 150;
}

async function signature(secret: string, expires: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(expires));
  return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function authorized(request: Request, secret: string) {
  const token = request.headers.get('cookie')?.match(/(?:^|;\s*)iatf_session=([^;]+)/)?.[1];
  if (!token) return false;
  const [expires, supplied] = token.split('.');
  if (!expires || !supplied || Number(expires) < Date.now()) return false;
  return supplied === await signature(secret, expires);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);

    try {
      if (request.method === 'GET' && url.pathname === '/api/health') {
        return json({ ok: true, storage: 'cloudflare-d1' });
      }

      if (request.method === 'POST' && url.pathname === '/api/session') {
        const body = await request.json<{ accessCode?: string }>();
        if (!env.ACCESS_CODE || body.accessCode !== env.ACCESS_CODE) return json({ error: 'Kode akses tidak valid.' }, 401);
        const expires = String(Date.now() + 12 * 60 * 60 * 1000);
        const token = `${expires}.${await signature(env.ACCESS_CODE, expires)}`;
        const response = json({ ok: true });
        response.headers.append('set-cookie', `iatf_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`);
        return response;
      }

      if (!await authorized(request, env.ACCESS_CODE)) return json({ error: 'Sesi tidak valid. Silakan masuk kembali.' }, 401);

      if (request.method === 'GET' && url.pathname === '/api/audits') {
        const result = await env.DB.prepare('SELECT payload FROM supplier_audits ORDER BY updated_at DESC LIMIT 500').all<{ payload: string }>();
        return json(result.results.map(row => JSON.parse(row.payload)));
      }

      const match = url.pathname.match(/^\/api\/audits\/([a-zA-Z0-9-]+)$/);
      if (request.method === 'PUT' && match) {
        if (Number(request.headers.get('content-length') || 0) > 1_500_000) return json({ error: 'Data audit terlalu besar.' }, 413);
        const audit: unknown = await request.json();
        if (!isAudit(audit) || audit.id !== match[1]) return json({ error: 'Format data audit tidak valid.' }, 400);

        const current = await env.DB.prepare('SELECT status, updated_at FROM supplier_audits WHERE id = ?').bind(audit.id).first<{ status: string; updated_at: string }>();
        if (current?.status === 'Final') return json({ error: 'Audit final tidak dapat diubah.' }, 409);

        const updatedAt = new Date().toISOString();
        const saved = { ...audit, updatedAt };
        await env.DB.prepare(`INSERT INTO supplier_audits (id, supplier, department, auditor, audit_date, status, score, payload, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET supplier=excluded.supplier, department=excluded.department, auditor=excluded.auditor,
          audit_date=excluded.audit_date, status=excluded.status, score=excluded.score, payload=excluded.payload, updated_at=excluded.updated_at`)
          .bind(saved.id, saved.supplier, saved.department, saved.auditor, saved.date || '', saved.status,
            typeof saved.score === 'number' ? saved.score : null, JSON.stringify(saved), updatedAt).run();
        return json(saved);
      }

      return json({ error: 'Endpoint tidak ditemukan.' }, 404);
    } catch (error) {
      console.error(error);
      return json({ error: 'Penyimpanan online sedang bermasalah.' }, 500);
    }
  },
};
