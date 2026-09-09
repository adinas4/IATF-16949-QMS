import React, { useState } from 'react';
import { Audit, CHECKLISTS, DEPARTMENTS, Identity, Supplier, calculateScore, canFinalize, grade, createAnswers } from './model';
import { SupplierMaster } from './SupplierMaster';
import { CompanySettings } from './CompanySettings';
const KEY = 'iatf:supplier-audits:v1';
const field = 'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2';
const button = 'rounded-lg bg-indigo-600 text-white px-4 py-2 disabled:opacity-40';
function readAudits(storageKey = KEY): Audit[] {
  const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (!Array.isArray(value) || value.some(a => !a || typeof a.id !== 'string' || typeof a.supplier !== 'string' || !DEPARTMENTS.includes(a.department) || !Array.isArray(a.answers) || !a.answers.every(x => x && ['question', 'score', 'evidence', 'action'].every(k => typeof x[k] === 'string')))) throw new Error('Data audit tersimpan tidak dapat dibaca.');
  return value;
}
export function SupplierAudit({ identity }: { identity: Identity }) {
  const storageKey = identity.companyId ? `${KEY}:${identity.companyId}` : KEY;
  const [loaded] = useState(() => { try { return { audits: readAudits(storageKey), error: '' }; } catch { return { audits: [] as Audit[], error: 'Data lokal tidak dapat dibaca. Penyimpanan diblokir agar data lama tidak tertimpa.' }; } });
  const [audits, setAudits] = useState(loaded.audits);
  const [draft, setDraft] = useState<Audit | null>(null);
  const [previewDepartment, setPreviewDepartment] = useState(identity.department);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState(loaded.error);
  const [dirty, setDirty] = useState(false);
  const [storageStatus, setStorageStatus] = useState('Menghubungkan penyimpanan online...');
  const [view, setView] = useState<'audit' | 'suppliers' | 'settings'>('audit');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [currentPoint, setCurrentPoint] = useState(0);
  React.useEffect(() => {
    let active = true;
    fetch('/api/audits', { headers: { accept: 'application/json' } })
      .then(async response => {
        if (response.status === 401) {
          sessionStorage.removeItem('iatf:identity');
          window.location.reload();
          throw new Error('Sesi berakhir.');
        }
        if (!response.ok) throw new Error('API penyimpanan tidak tersedia.');
        const cloudAudits = await response.json() as Audit[];
        if (!Array.isArray(cloudAudits)) throw new Error('Respons penyimpanan tidak valid.');
        if (!active) return;
        const merged = [...cloudAudits, ...loaded.audits.filter(local => !cloudAudits.some(cloud => cloud.id === local.id))];
        setAudits(merged);
        localStorage.setItem(storageKey, JSON.stringify(merged));
        setStorageStatus('Online - Cloudflare D1');
      })
      .catch(() => { if (active) setStorageStatus('Offline - menggunakan penyimpanan browser'); });
    return () => { active = false; };
  }, [loaded.audits, storageKey]);
  React.useEffect(() => {
    fetch('/api/suppliers').then(async response => {
      if (!response.ok) throw new Error();
      const data = await response.json() as Supplier[];
      setSuppliers(Array.isArray(data) ? data : []);
    }).catch(() => setMessage('Daftar supplier online belum dapat dimuat.'));
  }, []);
  React.useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const switchDraft = (next: Audit | null) => {
    if (dirty && !window.confirm('Perubahan belum disimpan. Tinggalkan perubahan?')) return;
    setDraft(next); setCurrentPoint(0); setDirty(false); setMessage(loaded.error);
  };
  const change = (next: Audit) => { setDraft(next); setDirty(true); };
  const save = async (final: boolean) => {
    if (!draft || loaded.error) return;
    if (!draft.supplier.trim() || !draft.date) { setMessage('Isi nama supplier dan tanggal audit.'); return; }
    if (final && !canFinalize(draft)) { setMessage('Lengkapi identitas audit, nilai, bukti aktual, dan kategori hasil. Observation, OFI, Minor, dan Major wajib memuat uraian temuan. Minor dan Major juga wajib memiliki tindakan koreksi, PIC, dan target penyelesaian.'); return; }
    let saved: Audit = { ...draft, supplier: draft.supplier.trim(), status: final ? 'Final' : 'Draft', updatedAt: new Date().toISOString() };
    try {
      const response = await fetch(`/api/audits/${encodeURIComponent(saved.id)}`, {
        method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(saved),
      });
      const result = await response.json() as Audit & { error?: string };
      if (response.status === 401) {
        sessionStorage.removeItem('iatf:identity');
        window.location.reload();
        return;
      }
      if (!response.ok) throw new Error(result.error || 'Gagal menyimpan ke penyimpanan online.');
      saved = result;
      const latest = readAudits(storageKey);
      const next = [saved, ...latest.filter(a => a.id !== saved.id)];
      localStorage.setItem(storageKey, JSON.stringify(next)); setAudits(next); setDraft(saved); setDirty(false);
      setStorageStatus('Online - Cloudflare D1');
      setMessage(final ? 'Audit difinalisasi dan tersimpan online.' : 'Draft tersimpan online.');
    } catch (error) {
      if (final) { setMessage(error instanceof Error ? error.message : 'Finalisasi gagal disimpan online.'); return; }
      try {
        const latest = readAudits(storageKey);
        const next = [saved, ...latest.filter(a => a.id !== saved.id)];
        localStorage.setItem(storageKey, JSON.stringify(next)); setAudits(next); setDraft(saved); setDirty(false);
        setStorageStatus('Offline - menggunakan penyimpanan browser');
        setMessage('Koneksi online gagal. Draft diamankan di browser ini dan perlu disimpan ulang saat online.');
      } catch { setMessage('Draft tidak dapat disimpan.'); }
    }
  };
  const visible = audits.filter(a => (filter === 'ALL' || a.department === filter) && a.supplier.toLowerCase().includes(search.toLowerCase()));
  const finalAudits = visible.filter(a => a.status === 'Final');
  const scoredSuppliers = [...new Set(finalAudits.map(a => a.supplier.toLowerCase()))];
  const editable = draft?.status === 'Draft' && draft.auditor === identity.name && draft.department === identity.department;
  const nav = <div className="flex flex-wrap gap-2 border-b dark:border-slate-700 pb-4">{([['audit', 'Pelaksanaan audit'], ['suppliers', 'Daftar supplier'], ['settings', 'Pengaturan perusahaan']] as const).map(([id, label]) => <button key={id} onClick={() => setView(id)} className={`rounded-lg px-4 py-2 ${view === id ? 'bg-indigo-600 text-white' : 'border dark:border-slate-700'}`}>{label}</button>)}</div>;
  if (view === 'suppliers') return <section className="space-y-6">{nav}<SupplierMaster suppliers={suppliers} onChange={setSuppliers} /></section>;
  if (view === 'settings') return <section className="space-y-6">{nav}<CompanySettings identity={identity} /></section>;
  return <section className="space-y-6">
    {nav}
    <div className="flex flex-wrap justify-between gap-4"><div><h2 className="text-2xl font-bold">Audit Supplier</h2><p className="text-slate-500">Checklist, klausul IATF 16949, bukti objektif, temuan, dan tindak lanjut per departemen.</p></div><button disabled={!suppliers.some(s => s.active)} className={button} onClick={() => switchDraft({ id: crypto.randomUUID(), supplier: suppliers.find(s => s.active)?.name || '', date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10), auditor: identity.name, department: identity.department, status: 'Draft', answers: createAnswers(identity.department), checklistVersion: 4, location: '', scope: suppliers.find(s => s.active)?.scope || '', supplierContact: suppliers.find(s => s.active)?.contact || '', updatedAt: '' })}>+ Audit baru</button></div>
    {!suppliers.some(s => s.active) && <p className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950 p-3 text-sm">Tambahkan supplier aktif pada menu Daftar supplier sebelum membuat audit baru.</p>}
    <p className="text-xs text-slate-500">Checklist mengacu pada Check and Finding Sheet Audit Supplier PT MRP Certified. <span className="font-semibold">Penyimpanan: {storageStatus}</span></p>
    <div className="rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-4">
      <div><h3 className="text-lg font-bold">Form &amp; checklist per departemen</h3><p className="text-sm text-slate-500">Tersedia 105 pertanyaan dalam 15 area audit. Audit baru membuka bagian yang menjadi tanggung jawab departemen login Anda: {identity.department}.</p></div>
      <label className="block">Pratinjau checklist<select className={field} value={previewDepartment} onChange={e => setPreviewDepartment(e.target.value)}>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></label>
      <details key={previewDepartment}><summary className="cursor-pointer font-semibold">Lihat ringkasan {CHECKLISTS[previewDepartment].length} pertanyaan - {previewDepartment}</summary><ol className="mt-4 space-y-3 list-decimal pl-5">{CHECKLISTS[previewDepartment].map(item => <li key={item.id || item.question}><p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{item.category} · Klausul {item.clauses?.join(', ')}</p><p className="font-medium">{item.question}</p></li>)}</ol></details>
    </div>
    {message && <p role="status" className="rounded-lg border border-indigo-300 p-3">{message}</p>}
    {draft && <div className="rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-5">
      <div className="flex justify-between gap-3"><div><h3 className="text-lg font-bold">{draft.status === 'Final' ? 'Hasil akhir audit' : 'Form audit supplier'}</h3><p className="text-sm text-slate-500">{draft.auditor} · {draft.department} · {draft.status}</p></div><button onClick={() => switchDraft(null)}>Tutup</button></div>
      <div className="grid sm:grid-cols-2 gap-4"><label>Nama supplier<select className={field} value={draft.supplier} disabled={!editable} onChange={e => { const supplier = suppliers.find(item => item.name === e.target.value); change({ ...draft, supplier: e.target.value, scope: supplier?.scope || draft.scope, supplierContact: supplier?.contact || draft.supplierContact }); }}><option value="">Pilih supplier</option>{suppliers.filter(s => s.active || s.name === draft.supplier).map(s => <option key={s.id} value={s.name}>{s.code} · {s.name}</option>)}</select></label><label>Tanggal audit<input type="date" className={field} value={draft.date} disabled={!editable} onChange={e => change({ ...draft, date: e.target.value })} /></label></div>
      <div className="grid sm:grid-cols-3 gap-4">{([['location', 'Lokasi / alamat audit'], ['scope', 'Produk / proses yang diaudit'], ['supplierContact', 'Nama auditee / PIC supplier']] as const).map(([key, label]) => <label key={key}>{label}{(draft.checklistVersion ?? 0) >= 2 ? ' *' : ''}<input className={field} maxLength={250} disabled={!editable} value={draft[key] || ''} onChange={e => change({ ...draft, [key]: e.target.value })} /></label>)}</div>
      <div><p className="text-sm font-semibold">Progres penilaian: {draft.answers.filter(a => a.score !== '').length} / {draft.answers.length} item</p><progress aria-label="Progres penilaian checklist" className="w-full accent-indigo-600" value={draft.answers.filter(a => a.score !== '').length} max={draft.answers.length} /></div>
      <p className="text-sm text-slate-500">0: tidak diterapkan · 1: kurang · 2: sebagian · 3: memenuhi · 4: sangat baik. N/A dikecualikan dari skor. Isi bukti untuk setiap item, termasuk alasan N/A.</p>
      {[draft.answers[Math.min(currentPoint, draft.answers.length - 1)]].filter(Boolean).map((answer) => {
        const index = Math.min(currentPoint, draft.answers.length - 1);
        const update = (key: string, value: string) => change({ ...draft, answers: draft.answers.map((a, i) => i === index ? { ...a, [key]: value } : a) });
        return <fieldset key={answer.id || index} disabled={!editable} className="border dark:border-slate-700 rounded-xl p-4 space-y-3"><legend className="font-semibold px-2">Poin {index + 1} dari {draft.answers.length}</legend>
          {answer.category && <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Area: {answer.category}</p>}
          <p className="text-lg font-semibold">{answer.question}</p>
          <p className="text-sm"><span className="font-semibold">Klausul terkait:</span> {(answer.clauses?.length ? answer.clauses : CHECKLISTS[draft.department].find(item => item.id === answer.id)?.clauses)?.join(', ') || 'Belum dipetakan'}</p>
          {answer.guidance && <p className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-sm"><span className="font-semibold">Bukti objektif yang diharapkan:</span> {answer.guidance}</p>}
          <label className="block">Nilai<select className={field} value={answer.score} onChange={e => update('score', e.target.value)}><option value="">Belum dinilai</option>{['0', '1', '2', '3', '4', 'NA'].map(v => <option key={v} value={v}>{v === 'NA' ? 'N/A — Tidak berlaku' : v}</option>)}</select></label>
          <div className="grid sm:grid-cols-2 gap-3"><label>Nomor dokumen / referensi observasi<input className={field} maxLength={500} placeholder="Contoh: SOP-QA-01 Rev.03 / observasi Line 2" value={answer.documentRef || ''} onChange={e => update('documentRef', e.target.value)} /></label><label>Kategori hasil *<select className={field} value={answer.findingCategory || ''} onChange={e => update('findingCategory', e.target.value)}><option value="">Pilih kategori</option><option value="CONFORMITY">Conformity</option><option value="OBSERVATION">Observation</option><option value="OFI">OFI - Opportunity for Improvement</option><option value="MINOR">Minor Nonconformity</option><option value="MAJOR">Major Nonconformity</option></select></label></div>
          <div className="grid sm:grid-cols-2 gap-3"><label>Bukti objektif aktual / alasan N/A *<textarea className={field} maxLength={4000} placeholder="Catat dokumen, rekaman, hasil wawancara, dan kondisi lapangan yang diperiksa" value={answer.evidence} onChange={e => update('evidence', e.target.value)} /></label><label>Uraian temuan<textarea className={field} maxLength={4000} placeholder="Wajib untuk Observation, OFI, Minor, dan Major" value={answer.finding || ''} onChange={e => update('finding', e.target.value)} /></label></div>
          <label className="block">Tindakan koreksi<textarea className={field} maxLength={4000} placeholder="Wajib untuk Minor dan Major; jelaskan koreksi dan tindakan permanen" value={answer.action} onChange={e => update('action', e.target.value)} /></label>
          <div className="grid sm:grid-cols-2 gap-3"><label>PIC tindakan koreksi<input className={field} maxLength={100} value={answer.pic || ''} onChange={e => update('pic', e.target.value)} /></label><label>Target penyelesaian<input type="date" min={draft.date} className={field} value={answer.dueDate || ''} onChange={e => update('dueDate', e.target.value)} /></label></div>
        </fieldset>;
      })}
      <div className="flex items-center justify-between gap-3"><button className="rounded-lg border px-4 py-2 disabled:opacity-40" disabled={currentPoint === 0} onClick={() => setCurrentPoint(point => Math.max(0, point - 1))}>← Poin sebelumnya</button><span className="text-sm font-semibold">{currentPoint + 1} / {draft.answers.length}</span><button className="rounded-lg border px-4 py-2 disabled:opacity-40" disabled={currentPoint >= draft.answers.length - 1} onClick={() => setCurrentPoint(point => Math.min(draft.answers.length - 1, point + 1))}>Poin berikutnya →</button></div>
      <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-4 space-y-2"><p className="font-bold text-xl">{draft.status === 'Final' ? 'Skor akhir' : 'Skor sementara'}: {calculateScore(draft.answers) ?? '—'} / 100</p><p>{grade(calculateScore(draft.answers))}</p><div className="flex flex-wrap gap-2 text-xs">{(['CONFORMITY', 'OBSERVATION', 'OFI', 'MINOR', 'MAJOR'] as const).map(category => <span key={category} className="rounded-full bg-white dark:bg-slate-900 px-3 py-1">{category}: {draft.answers.filter(answer => answer.findingCategory === category).length}</span>)}</div><p className="text-xs mt-2">Skor = jumlah nilai / (jumlah item berlaku x 4) x 100. A minimal 85; B minimal 70; C di bawah 70.</p></div>
      {editable && <div className="flex flex-wrap gap-3"><button disabled={!!loaded.error} className={button} onClick={() => save(false)}>Simpan draft</button><button disabled={!!loaded.error || !canFinalize(draft)} className={button} onClick={() => { if (window.confirm('Finalisasi audit? Hasil yang sudah final tidak dapat diedit.')) save(true); }}>Finalisasi audit</button><p className="text-xs text-slate-500 w-full">Finalisasi memerlukan seluruh identitas audit, nilai, bukti aktual, dan kategori hasil. Nilai 0–2 serta temuan Minor/Major wajib dilengkapi tindakan koreksi, PIC, dan target penyelesaian.</p></div>}
    </div>}
    <div className="grid sm:grid-cols-2 gap-3"><label>Cari supplier<input className={field} value={search} onChange={e => setSearch(e.target.value)} placeholder="Nama supplier" /></label><label>Filter departemen<select className={field} value={filter} onChange={e => setFilter(e.target.value)}><option value="ALL">Semua departemen</option>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></label></div>
    <div className="space-y-3"><h3 className="font-bold text-lg">Rekap skor akhir supplier</h3><p className="text-xs text-slate-500">Rata-rata skor audit final terbaru dari setiap departemen yang sudah mengaudit, mengikuti filter. Departemen yang belum mengaudit tidak dihitung.</p>{!scoredSuppliers.length && <p className="text-slate-500">Belum ada hasil final.</p>}{scoredSuppliers.map(supplier => {
      const matching = finalAudits.filter(a => a.supplier.toLowerCase() === supplier).sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt));
      const latest = matching.filter((a, i) => matching.findIndex(b => b.department === a.department) === i);
      const score = Math.round(latest.reduce((sum, a) => sum + (calculateScore(a.answers) ?? 0), 0) / latest.length);
      return <div key={supplier} className="border dark:border-slate-700 rounded-xl p-4"><div className="flex justify-between gap-3 font-bold"><span>{matching[0].supplier}</span><span>{score}/100 · {grade(score)}</span></div><p className="text-sm text-slate-500">{latest.length} departemen dinilai</p>{latest.map(a => <p key={a.id} className="text-sm mt-1">{a.department}: {calculateScore(a.answers)}/100</p>)}</div>;
    })}</div>
    <h3 className="font-bold text-lg">Riwayat audit ({visible.length})</h3>
    {!visible.length && <p className="border rounded-xl p-6 text-slate-500">Belum ada audit yang sesuai. Buat audit baru untuk memulai penilaian.</p>}
    <div className="grid md:grid-cols-2 gap-4">{visible.map(a => <button key={a.id} onClick={() => switchDraft(a)} className="text-left border dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-900 hover:border-indigo-500"><div className="flex justify-between gap-2"><strong>{a.supplier}</strong><span>{a.status}</span></div><p className="text-sm text-slate-500 mt-2">{a.department} · {a.auditor} · {a.date}</p><p className="mt-2">{a.status === 'Final' ? `Skor akhir: ${calculateScore(a.answers)}/100` : 'Draft — penilaian belum final'}</p></button>)}</div>
  </section>;
}
