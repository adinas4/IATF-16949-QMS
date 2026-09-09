export const CHECKLISTS = {
  'Quality Assurance': ['Sistem mutu dan dokumen terkendali', 'Audit internal dan tindak lanjut', 'Penanganan keluhan serta tindakan koreksi'],
  'Quality Control': ['Inspeksi penerimaan dan produk akhir', 'Kalibrasi dan verifikasi alat ukur', 'Pengendalian produk tidak sesuai'],
  'Process Engineering': ['Validasi proses dan perubahan engineering', 'Analisis risiko proses dan control plan', 'Instruksi kerja dan parameter proses'],
  Production: ['Kepatuhan pelaksanaan instruksi kerja', 'Identifikasi dan ketertelusuran produk', 'Kapasitas serta pengendalian proses produksi'],
  Purchasing: ['Evaluasi dan pemantauan pemasok', 'Kesesuaian spesifikasi pesanan', 'Komunikasi perubahan dan komitmen supplier'],
  Warehouse: ['Penyimpanan dan preservasi material', 'FIFO/FEFO dan identifikasi stok', 'Ketepatan pengiriman serta kemasan'],
  Maintenance: ['Pelaksanaan preventive maintenance', 'Ketersediaan spare part kritis', 'Rekaman kerusakan dan perbaikan mesin'],
  'Human Resources': ['Kompetensi personel', 'Pelatihan dan evaluasi efektivitas', 'Matriks keterampilan operator'],
  'Management Representative': ['Sasaran mutu dan evaluasi kinerja', 'Tinjauan manajemen', 'Penyediaan sumber daya dan tindak lanjut risiko'],
};
export const DEPARTMENTS = Object.keys(CHECKLISTS);
export type Identity = { name: string; department: string };
export type Answer = { question: string; score: string; evidence: string; action: string };
export type Audit = { id: string; supplier: string; date: string; auditor: string; department: string; status: 'Draft' | 'Final'; answers: Answer[]; updatedAt: string };
export function calculateScore(answers: Answer[]) {
  const applicable = answers.filter(a => /^[0-4]$/.test(a.score));
  return applicable.length ? Math.round(applicable.reduce((sum, a) => sum + Number(a.score), 0) / (applicable.length * 4) * 100) : null;
}
export function grade(score: number | null) {
  return score === null ? 'Belum dinilai' : score >= 85 ? 'A — Memenuhi' : score >= 70 ? 'B — Perlu perbaikan' : 'C — Perlu tindakan koreksi';
}
export function canFinalize(audit: Audit) {
  return Boolean(audit.supplier.trim() && audit.date && audit.answers.length && calculateScore(audit.answers) !== null && audit.answers.every(a =>
    (a.score === 'NA' || /^[0-4]$/.test(a.score)) && a.evidence.trim() && (a.score === 'NA' || Number(a.score) >= 3 || a.action.trim())));
}
