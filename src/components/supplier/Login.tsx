import React, { useState } from 'react';
import { DEPARTMENTS, Identity } from './model';
export function readIdentity(): Identity | null {
  try {
    const value = JSON.parse(sessionStorage.getItem('iatf:identity') || 'null');
    return value && typeof value.name === 'string' && value.name.trim() && DEPARTMENTS.includes(value.department) ? value : null;
  } catch { return null; }
}
export function Login({ onLogin }: { onLogin: (identity: Identity) => void }) {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  return <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
    <form className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg space-y-5" onSubmit={e => {
      e.preventDefault();
      if (!name.trim() || !DEPARTMENTS.includes(department)) return;
      const identity = { name: name.trim(), department };
      try { sessionStorage.setItem('iatf:identity', JSON.stringify(identity)); onLogin(identity); }
      catch { setError('Penyimpanan sesi tidak tersedia. Aktifkan penyimpanan browser untuk masuk.'); }
    }}>
      <div><p className="text-indigo-600 font-semibold">IATF 16949 QMS</p><h1 className="text-2xl font-bold mt-2">Masuk ke workspace</h1><p className="text-sm text-slate-500 mt-2">Identitas ini akan dicatat pada audit supplier Anda.</p></div>
      <label className="block">Nama lengkap<input required maxLength={100} autoComplete="name" value={name} onChange={e => setName(e.target.value)} className="mt-2 w-full border rounded-lg p-3" /></label>
      <label className="block">Departemen<select required value={department} onChange={e => setDepartment(e.target.value)} className="mt-2 w-full border rounded-lg p-3"><option value="">Pilih departemen</option>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></label>
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <button className="w-full bg-indigo-600 text-white rounded-lg p-3 font-semibold">Masuk</button>
      <p className="text-xs text-slate-500">Masuk dengan nama dan departemen tanpa password. Identitas belum diverifikasi; sesi berakhir saat keluar.</p>
    </form>
  </main>;
}
