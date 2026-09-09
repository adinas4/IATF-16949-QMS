import React, { useState } from 'react';
import { Audit, CHECKLISTS, DEPARTMENTS, Identity, calculateScore, canFinalize, grade } from './model';
const KEY = 'iatf:supplier-audits:v1';
const field = 'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2';
const button = 'rounded-lg bg-indigo-600 text-white px-4 py-2 disabled:opacity-40';
function readAudits(): Audit[] {
  const value = JSON.parse(localStorage.getItem(KEY) || '[]');
  if (!Array.isArray(value) || value.some(a => !a || typeof a.id !== 'string' || typeof a.supplier !== 'string' || !DEPARTMENTS.includes(a.department) || !Array.isArray(a.answers) || !a.answers.every(x => x && ['question', 'score', 'evidence', 'action'].every(k => typeof x[k] === 'string')))) throw new Error('Data audit tersimpan tidak dapat dibaca.');
  return value;
}
export function SupplierAudit({ identity }: { identity: Identity }) {
  const [loaded] = useState(() => { try { return { audits: readAudits(), error: '' }; } catch { return { audits: [] as Audit[], error: 'Data lokal tidak dapat dibaca. Penyimpanan diblokir agar data lama tidak tertimpa.' }; } });
  const [audits, setAudits] = useState(loaded.audits);
  const [draft, setDraft] = useState<Audit | null>(null);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState(loaded.error);
  const [dirty, setDirty] = useState(false);
  React.useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const switchDraft = (next: Audit | null) => {
    if (dirty && !window.confirm('Perubahan belum disimpan. Tinggalkan perubahan?')) return;
    setDraft(next); setDirty(false); setMessage(loaded.error);
  };
  const change = (next: Audit) => { setDraft(next); setDirty(true); };
  const save = (final: boolean) => {
    if (!draft || loaded.error) return;
    if (!draft.supplier.trim() || !draft.date) { setMessage('Isi nama supplier dan tanggal audit.'); return; }
    if (final && !canFinalize(draft)) { setMessage('Lengkapi seluruh nilai dan bukti/alasan N/A. Nilai 0–2 wajib memiliki tindakan koreksi. Minimal satu item harus dinilai.'); return; }
    const saved: Audit = { ...draft, supplier: draft.supplier.trim(), status: final ? 'Final' : 'Draft', updatedAt: new Date().toISOString() };
    try {
      const latest = readAudits();
      const existing = latest.find(a => a.id === saved.id);
      if (existing && (existing.status === 'Final' || existing.updatedAt !== draft.updatedAt)) throw new Error('Audit telah berubah di tab lain. Buka ulang halaman sebelum mengedit.');
      const next = [saved, ...latest.filter(a => a.id !== saved.id)];
      localStorage.setItem(KEY, JSON.stringify(next)); setAudits(next); setDraft(saved); setDirty(false);
      setMessage(final ? 'Audit difinalisasi. Hasil akhir tersimpan.' : 'Draft tersimpan.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Gagal menyimpan audit.'); }
  };
  const visible = audits.filter(a => (filter === 'ALL' || a.department === filter) && a.supplier.toLowerCase().includes(search.toLowerCase()));
  const finalAudits = visible.filter(a => a.status === 'Final');
  const suppliers = [...new Set(finalAudits.map(a => a.supplier.toLowerCase()))];
  const editable = draft?.status === 'Draft' && draft.auditor === identity.name && draft.department === identity.department;
  return <section className="space-y-6">
    <div className="flex flex-wrap justify-between gap-4"><div><h2 className="text-2xl font-bold">Audit Supplier</h2><p className="text-slate-500">Checklist departemen, temuan, dan hasil penilaian supplier.</p></div><button className={button} onClick={() => switchDraft({ id: crypto.randomUUID(), supplier: '', date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10), auditor: identity.name, department: identity.department, status: 'Draft', answers: CHECKLISTS[identity.department].map(question => ({ question, score: '', evidence: '', action: '' })), updatedAt: '' })}>+ Audit baru</button></div>
    <p className="text-xs text-slate-500">Data audit disimpan di browser ini. Checklist dan batas nilai merupakan template internal yang dapat disesuaikan, bukan sertifikasi IATF.</p>
    {message && <p role="status" className="rounded-lg border border-indigo-300 p-3">{message}</p>}
    {draft && <div className="rounded-2xl border dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-5">
      <div className="flex justify-between gap-3"><div><h3 className="text-lg font-bold">{draft.status === 'Final' ? 'Hasil akhir audit' : 'Form audit supplier'}</h3><p className="text-sm text-slate-500">{draft.auditor} · {draft.department} · {draft.status}</p></div><button onClick={() => switchDraft(null)}>Tutup</button></div>
      <div className="grid sm:grid-cols-2 gap-4"><label>Nama supplier<input className={field} maxLength={160} value={draft.supplier} disabled={!editable} onChange={e => change({ ...draft, supplier: e.target.value })} /></label><label>Tanggal audit<input type="date" className={field} value={draft.date} disabled={!editable} onChange={e => change({ ...draft, date: e.target.value })} /></label></div>
      <p className="text-sm text-slate-500">0: tidak diterapkan · 1: kurang · 2: sebagian · 3: memenuhi · 4: sangat baik. N/A dikecualikan dari skor. Isi bukti untuk setiap item, termasuk alasan N/A.</p>
      {draft.answers.map((answer, index) => {
        const update = (key: string, value: string) => change({ ...draft, answers: draft.answers.map((a, i) => i === index ? { ...a, [key]: value } : a) });
        return <fieldset key={index} disabled={!editable} className="border dark:border-slate-700 rounded-xl p-4 space-y-3"><legend className="font-semibold px-2">{index + 1}. {answer.question}</legend>
          <label className="block">Nilai<select className={field} value={answer.score} onChange={e => update('score', e.target.value)}><option value="">Belum dinilai</option>{['0', '1', '2', '3', '4', 'NA'].map(v => <option key={v} value={v}>{v === 'NA' ? 'N/A — Tidak berlaku' : v}</option>)}</select></label>
          <div className="grid sm:grid-cols-2 gap-3"><label>Bukti / temuan / alasan N/A<textarea className={field} maxLength={4000} value={answer.evidence} onChange={e => update('evidence', e.target.value)} /></label><label>Tindakan koreksi (wajib nilai 0–2)<textarea className={field} maxLength={4000} placeholder="Tindakan, PIC, dan target penyelesaian" value={answer.action} onChange={e => update('action', e.target.value)} /></label></div>
        </fieldset>;
      })}
      <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-4"><p className="font-bold text-xl">{draft.status === 'Final' ? 'Skor akhir' : 'Skor sementara'}: {calculateScore(draft.answers) ?? '—'} / 100</p><p>{grade(calculateScore(draft.answers))}</p><p className="text-xs mt-2">Skor = jumlah nilai ÷ (jumlah item berlaku × 4) × 100. A =85; B =70; C &lt;70.</p></div>
      {editable && <div className="flex flex-wrap gap-3"><button disabled={!!loaded.error} className={button} onClick={() => save(false)}>Simpan draft</button><button disabled={!!loaded.error || !canFinalize(draft)} className={button} onClick={() => { if (window.confirm('Finalisasi audit? Hasil yang sudah final tidak dapat diedit.')) save(true); }}>Finalisasi audit</button><p className="text-xs text-slate-500 w-full">Finalisasi aktif setelah semua item dan bukti lengkap, minimal satu nilai berlaku, serta tindakan koreksi untuk nilai 0–2 terisi.</p></div>}
    </div>}
    <div className="grid sm:grid-cols-2 gap-3"><label>Cari supplier<input className={field} value={search} onChange={e => setSearch(e.target.value)} placeholder="Nama supplier" /></label><label>Filter departemen<select className={field} value={filter} onChange={e => setFilter(e.target.value)}><option value="ALL">Semua departemen</option>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></label></div>
    <div className="space-y-3"><h3 className="font-bold text-lg">Rekap skor akhir supplier</h3><p className="text-xs text-slate-500">Rata-rata skor audit final terbaru dari setiap departemen yang sudah mengaudit, mengikuti filter. Departemen yang belum mengaudit tidak dihitung.</p>{!suppliers.length && <p className="text-slate-500">Belum ada hasil final.</p>}{suppliers.map(supplier => {
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
