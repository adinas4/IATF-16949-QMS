import React, { useState } from 'react';
import { DEPARTMENTS, Identity } from './model';
export function readIdentity(): Identity | null {
  try {
    const value = JSON.parse(sessionStorage.getItem('iatf:identity') || 'null');
    return value && typeof value.name === 'string' && value.name.trim() && DEPARTMENTS.includes(value.department) ? value : null;
  } catch { return null; }
}
export function Login({ onLogin }: { onLogin: (identity: Identity) => void }) {
  const [company, setCompany] = useState('PT MRP');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  return <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
    <form className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg space-y-5" onSubmit={async e => {
      e.preventDefault();
      if (!name.trim() || !DEPARTMENTS.includes(department)) return;
      setSubmitting(true); setError('');
      let identity: Identity = { name: name.trim(), department };
      try {
        if (window.location.hostname === 'audit.appmsks-mrp.com') {
          const response = await fetch('/api/session', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ company, accessCode }) });
          const result = await response.json() as { error?: string; company?: { id: string; name: string } };
          if (!response.ok) throw new Error(result.error || 'Tidak dapat membuat sesi.');
          if (!result.company) throw new Error('Identitas perusahaan tidak ditemukan.');
          identity = { ...identity, companyId: result.company.id, companyName: result.company.name };
        }
        sessionStorage.setItem('iatf:identity', JSON.stringify(identity)); onLogin(identity);
      } catch (reason) { setError(reason instanceof Error ? reason.message : 'Penyimpanan sesi tidak tersedia.'); }
      finally { setSubmitting(false); }
    }}>
      <div><p className="text-indigo-600 font-semibold">IATF 16949 QMS</p><h1 className="text-2xl font-bold mt-2">Masuk ke workspace</h1><p className="text-sm text-slate-500 mt-2">Identitas ini akan dicatat pada audit supplier Anda.</p></div>
      {window.location.hostname === 'audit.appmsks-mrp.com' && <label className="block">Perusahaan terdaftar<input required maxLength={120} autoComplete="organization" value={company} onChange={e => setCompany(e.target.value)} className="mt-2 w-full border rounded-lg p-3" /></label>}
      <label className="block">Nama lengkap<input required maxLength={100} autoComplete="name" value={name} onChange={e => setName(e.target.value)} className="mt-2 w-full border rounded-lg p-3" /></label>
      <label className="block">Departemen<select required value={department} onChange={e => setDepartment(e.target.value)} className="mt-2 w-full border rounded-lg p-3"><option value="">Pilih departemen</option>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></label>
      {window.location.hostname === 'audit.appmsks-mrp.com' && <label className="block">Kode akses perusahaan<input required type="password" autoComplete="current-password" value={accessCode} onChange={e => setAccessCode(e.target.value)} className="mt-2 w-full border rounded-lg p-3" /></label>}
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <button disabled={submitting} className="w-full bg-indigo-600 disabled:opacity-50 text-white rounded-lg p-3 font-semibold">{submitting ? 'Memverifikasi...' : 'Masuk'}</button>
      <p className="text-xs text-slate-500">Nama dan departemen dicatat sebagai identitas auditor. Sesi online dilindungi kode akses perusahaan dan berlaku hingga 12 jam.</p>
    </form>
  </main>;
}
