interface Organization { id: string; name: string; code_salt: string; code_hash: string }
interface Session { organizationId: string; expires: number }
interface AuditPayload {
  id: string;
  supplier: string;
  department: string;
  auditor: string;
  date?: string;
  status: 'Draft' | 'Final';
  score?: number;
  answers: unknown[];
  [key: string]: unknown;
}

const encoder = new TextEncoder();
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

function isAudit(value: unknown): value is AuditPayload {
  if (!value || typeof value !== 'object') return false;
  const audit = value as Record<string, unknown>;
  return typeof audit.id === 'string' && audit.id.length <= 100 && typeof audit.supplier === 'string' && audit.supplier.length <= 160 &&
    typeof audit.department === 'string' && audit.department.length <= 100 && typeof audit.auditor === 'string' && audit.auditor.length <= 100 &&
    (audit.status === 'Draft' || audit.status === 'Final') && Array.isArray(audit.answers) && audit.answers.length <= 150;
}

function hexToBytes(value: string) {
  if (!/^[0-9a-f]+$/i.test(value) || value.length % 2 !== 0) return new Uint8Array();
  return Uint8Array.from(value.match(/.{2}/g) ?? [], byte => Number.parseInt(byte, 16));
}

function toBase64Url(value: Uint8Array) {
  return btoa(String.fromCharCode(...value)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function fromBase64Url(value: string) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const decoded = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
  return Uint8Array.from(decoded, character => character.charCodeAt(0));
}

async function deriveAccessCodeHash(accessCode: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(accessCode), 'PBKDF2', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: hexToBytes(salt), iterations: 100_000 }, key, 256));
}

async function sessionKey(secret: string) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function createSessionToken(secret: string, organizationId: string) {
  const payload = toBase64Url(encoder.encode(JSON.stringify({ organizationId, expires: Date.now() + 12 * 60 * 60 * 1000 })));
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', await sessionKey(secret), encoder.encode(payload)));
  return `${payload}.${toBase64Url(signature)}`;
}

async function readSession(request: Request, secret: string): Promise<Session | null> {
  const token = request.headers.get('cookie')?.match(/(?:^|;\s*)iatf_session=([^;]+)/)?.[1];
  if (!token) return null;
  try {
    const [payload, suppliedSignature] = token.split('.');
    if (!payload || !suppliedSignature) return null;
    const valid = await crypto.subtle.verify('HMAC', await sessionKey(secret), fromBase64Url(suppliedSignature), encoder.encode(payload));
    if (!valid) return null;
    const session = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as Session;
    return session.organizationId && session.expires >= Date.now() ? session : null;
  } catch { return null; }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    try {
      if (request.method === 'GET' && url.pathname === '/api/health') return json({ ok: true, storage: 'cloudflare-d1', access: 'registered-companies' });

      if (request.method === 'POST' && url.pathname === '/api/session') {
        const body = await request.json<{ company?: string; accessCode?: string }>();
        const company = body.company?.trim();
        const accessCode = body.accessCode ?? '';
        if (!company || !accessCode || company.length > 120 || accessCode.length > 200) return json({ error: 'Perusahaan atau kode akses tidak valid.' }, 401);
        const organization = await env.DB.prepare('SELECT id, name, code_salt, code_hash FROM organizations WHERE name = ? COLLATE NOCASE AND active = 1')
          .bind(company).first<Organization>();
        if (!organization) return json({ error: 'Perusahaan atau kode akses tidak terdaftar.' }, 401);
        const suppliedHash = await deriveAccessCodeHash(accessCode, organization.code_salt);
        const expectedHash = hexToBytes(organization.code_hash);
        if (suppliedHash.length !== expectedHash.length || !crypto.subtle.timingSafeEqual(suppliedHash, expectedHash)) return json({ error: 'Perusahaan atau kode akses tidak terdaftar.' }, 401);
        const token = await createSessionToken(env.SESSION_SECRET, organization.id);
        const response = json({ ok: true, company: { id: organization.id, name: organization.name } });
        response.headers.append('set-cookie', `iatf_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`);
        return response;
      }

      if (request.method === 'DELETE' && url.pathname === '/api/session') {
        const response = json({ ok: true });
        response.headers.append('set-cookie', 'iatf_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
        return response;
      }

      const session = await readSession(request, env.SESSION_SECRET);
      if (!session) return json({ error: 'Sesi tidak valid. Silakan masuk kembali.' }, 401);
      const activeOrganization = await env.DB.prepare('SELECT name FROM organizations WHERE id = ? AND active = 1')
        .bind(session.organizationId).first<{ name: string }>();
      if (!activeOrganization) return json({ error: 'Perusahaan sudah tidak aktif.' }, 403);
      if (request.method === 'GET' && url.pathname === '/api/audits') {
        const result = await env.DB.prepare('SELECT payload FROM supplier_audits WHERE organization_id = ? ORDER BY updated_at DESC LIMIT 500')
          .bind(session.organizationId).all<{ payload: string }>();
        return json(result.results.map(row => JSON.parse(row.payload)));
      }

      const match = url.pathname.match(/^\/api\/audits\/([a-zA-Z0-9-]+)$/);
      if (request.method === 'PUT' && match) {
        if (Number(request.headers.get('content-length') || 0) > 1_500_000) return json({ error: 'Data audit terlalu besar.' }, 413);
        const audit: unknown = await request.json();
        if (!isAudit(audit) || audit.id !== match[1]) return json({ error: 'Format data audit tidak valid.' }, 400);
        const current = await env.DB.prepare('SELECT status, organization_id FROM supplier_audits WHERE id = ?')
          .bind(audit.id).first<{ status: string; organization_id: string }>();
        if (current && current.organization_id !== session.organizationId) return json({ error: 'ID audit sudah digunakan.' }, 409);
        if (current?.status === 'Final') return json({ error: 'Audit final tidak dapat diubah.' }, 409);
        const updatedAt = new Date().toISOString();
        const saved = { ...audit, companyId: session.organizationId, companyName: activeOrganization.name, updatedAt };
        await env.DB.prepare(`INSERT INTO supplier_audits (id, supplier, department, auditor, audit_date, status, score, payload, updated_at, organization_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET supplier=excluded.supplier, department=excluded.department, auditor=excluded.auditor,
          audit_date=excluded.audit_date, status=excluded.status, score=excluded.score, payload=excluded.payload, updated_at=excluded.updated_at`)
          .bind(saved.id, saved.supplier, saved.department, saved.auditor, saved.date || '', saved.status,
            typeof saved.score === 'number' ? saved.score : null, JSON.stringify(saved), updatedAt, session.organizationId).run();
        return json(saved);
      }
      return json({ error: 'Endpoint tidak ditemukan.' }, 404);
    } catch (error) {
      console.error(JSON.stringify({ event: 'request_error', path: url.pathname, message: error instanceof Error ? error.message : 'unknown' }));
      return json({ error: 'Penyimpanan online sedang bermasalah.' }, 500);
    }
  },
};
