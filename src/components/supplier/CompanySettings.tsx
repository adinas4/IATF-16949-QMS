import React, { useState } from 'react';
import { Identity } from './model';

const field = 'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2';
export function CompanySettings({ identity }: { identity: Identity }) {
  const [settingsCode, setSettingsCode] = useState('');
  const [newAccessCode, setNewAccessCode] = useState('');
  const [newSettingsCode, setNewSettingsCode] = useState('');
  const [message, setMessage] = useState('');
  const update = async (kind: 'access-code' | 'settings-code') => {
    const value = kind === 'access-code' ? newAccessCode : newSettingsCode;
    const body = kind === 'access-code' ? { settingsCode, newAccessCode: value } : { settingsCode, newSettingsCode: value };
    const response = await fetch(`/api/company/${kind}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const result = await response.json() as { error?: string };
    if (!response.ok) { setMessage(result.error || 'Pengaturan gagal diperbarui.'); return; }
    setSettingsCode(''); setNewAccessCode(''); setNewSettingsCode('');
    setMessage(kind === 'access-code' ? 'Kode akses login perusahaan berhasil diubah.' : 'Kode pengaturan perusahaan berhasil diubah. Gunakan kode baru untuk perubahan berikutnya.');
  };
  return <div className="max-w-2xl space-y-5">
    <div><h3 className="text-xl font-bold">Pengaturan perusahaan</h3><p className="text-sm text-slate-500">{identity.companyName}. Perubahan dilindungi kode pengaturan khusus.</p></div>
    {message && <p role="status" className="rounded-lg border border-indigo-300 p-3">{message}</p>}
    <label className="block">Kode pengaturan perusahaan<input type="password" autoComplete="current-password" className={field} value={settingsCode} onChange={e => setSettingsCode(e.target.value)} /></label>
    <div className="rounded-xl border dark:border-slate-700 p-4 space-y-3"><h4 className="font-semibold">Ubah kode akses login</h4><p className="text-sm text-slate-500">Kode ini dipakai auditor saat masuk. Minimal 10 karakter.</p><input type="password" className={field} placeholder="Kode akses login baru" value={newAccessCode} onChange={e => setNewAccessCode(e.target.value)} /><button disabled={!settingsCode || newAccessCode.length < 10} className="rounded-lg bg-indigo-600 disabled:opacity-40 px-4 py-2 text-white" onClick={() => update('access-code')}>Ubah kode akses</button></div>
    <div className="rounded-xl border dark:border-slate-700 p-4 space-y-3"><h4 className="font-semibold">Ubah kode pengaturan</h4><p className="text-sm text-slate-500">Simpan kode ini hanya untuk administrator perusahaan. Minimal 12 karakter.</p><input type="password" className={field} placeholder="Kode pengaturan baru" value={newSettingsCode} onChange={e => setNewSettingsCode(e.target.value)} /><button disabled={!settingsCode || newSettingsCode.length < 12} className="rounded-lg bg-indigo-600 disabled:opacity-40 px-4 py-2 text-white" onClick={() => update('settings-code')}>Ubah kode pengaturan</button></div>
  </div>;
}
