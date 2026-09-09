import React, { useEffect, useState } from 'react';
import { Supplier } from './model';

const field = 'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2';
const emptySupplier = (): Supplier => ({ id: crypto.randomUUID(), code: '', name: '', address: '', contact: '', email: '', phone: '', scope: '', active: true });

export function SupplierMaster({ suppliers, onChange }: { suppliers: Supplier[]; onChange: (suppliers: Supplier[]) => void }) {
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [message, setMessage] = useState('');
  const save = async () => {
    if (!editing?.code.trim() || !editing.name.trim()) { setMessage('Kode dan nama supplier wajib diisi.'); return; }
    const response = await fetch('/api/suppliers', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(editing) });
    const result = await response.json() as Supplier & { error?: string };
    if (!response.ok) { setMessage(result.error || 'Supplier gagal disimpan.'); return; }
    onChange([result, ...suppliers.filter(item => item.id !== result.id)].sort((a, b) => a.name.localeCompare(b.name)));
    setEditing(null); setMessage('Data supplier tersimpan online.');
  };
  useEffect(() => { setMessage(''); }, [editing?.id]);
  return <div className="space-y-5">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-xl font-bold">Daftar supplier</h3><p className="text-sm text-slate-500">Master supplier perusahaan untuk dipilih saat membuat audit.</p></div><button className="rounded-lg bg-indigo-600 px-4 py-2 text-white" onClick={() => setEditing(emptySupplier())}>+ Tambah supplier</button></div>
    {message && <p role="status" className="rounded-lg border border-indigo-300 p-3">{message}</p>}
    {editing && <div className="rounded-xl border dark:border-slate-700 p-4 space-y-4">
      <div className="grid sm:grid-cols-2 gap-3"><label>Kode supplier *<input className={field} maxLength={50} value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value })} /></label><label>Nama supplier *<input className={field} maxLength={160} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></label></div>
      <label className="block">Alamat<textarea className={field} maxLength={500} value={editing.address} onChange={e => setEditing({ ...editing, address: e.target.value })} /></label>
      <div className="grid sm:grid-cols-2 gap-3"><label>PIC supplier<input className={field} value={editing.contact} onChange={e => setEditing({ ...editing, contact: e.target.value })} /></label><label>Ruang lingkup produk/jasa<input className={field} value={editing.scope} onChange={e => setEditing({ ...editing, scope: e.target.value })} /></label><label>Email<input type="email" className={field} value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} /></label><label>Telepon<input className={field} value={editing.phone} onChange={e => setEditing({ ...editing, phone: e.target.value })} /></label></div>
      <label className="flex items-center gap-2"><input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} /> Supplier aktif</label>
      <div className="flex gap-2"><button className="rounded-lg bg-indigo-600 px-4 py-2 text-white" onClick={save}>Simpan</button><button className="rounded-lg border px-4 py-2" onClick={() => setEditing(null)}>Batal</button></div>
    </div>}
    <div className="grid md:grid-cols-2 gap-3">{suppliers.map(supplier => <button key={supplier.id} onClick={() => setEditing({ ...supplier })} className="text-left rounded-xl border dark:border-slate-700 p-4 hover:border-indigo-500"><div className="flex justify-between gap-2"><strong>{supplier.name}</strong><span className={supplier.active ? 'text-emerald-600' : 'text-slate-400'}>{supplier.active ? 'Aktif' : 'Nonaktif'}</span></div><p className="text-sm text-slate-500">{supplier.code} · {supplier.scope || 'Ruang lingkup belum diisi'}</p><p className="text-sm mt-2">{supplier.contact || 'PIC belum diisi'}{supplier.phone ? ` · ${supplier.phone}` : ''}</p></button>)}</div>
    {!suppliers.length && <p className="rounded-xl border p-6 text-slate-500">Belum ada supplier. Tambahkan supplier sebelum membuat audit baru.</p>}
  </div>;
}
