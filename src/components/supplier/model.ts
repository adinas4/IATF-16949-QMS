export type ChecklistItem = { question: string; guidance: string };
export const CHECKLISTS: Record<string, ChecklistItem[]> = {
  'Quality Assurance': [
    { question: 'Apakah dokumen mutu yang digunakan merupakan revisi terkini?', guidance: 'Periksa master list, persetujuan revisi, dan dokumen di area kerja.' },
    { question: 'Apakah audit internal dilaksanakan sesuai jadwal?', guidance: 'Bandingkan program audit dengan laporan dan kompetensi auditor.' },
    { question: 'Apakah temuan audit ditutup dan efektivitasnya diverifikasi?', guidance: 'Telusuri sampel temuan, akar masalah, tindakan, dan bukti verifikasi.' },
    { question: 'Apakah keluhan pelanggan ditangani tepat waktu?', guidance: 'Periksa register keluhan, respons supplier, dan laporan tindakan koreksi.' },
    { question: 'Apakah persyaratan pelanggan diterjemahkan ke proses kerja?', guidance: 'Telusuri satu persyaratan pelanggan ke prosedur dan rekaman pelaksanaan.' },
    { question: 'Apakah kinerja mutu dipantau dan ditindaklanjuti?', guidance: 'Periksa tren reject, target mutu, serta tindak lanjut saat target tidak tercapai.' },
  ],
  'Quality Control': [
    { question: 'Apakah material masuk diperiksa sesuai spesifikasi?', guidance: 'Periksa sampling plan, hasil incoming inspection, dan status penerimaan.' },
    { question: 'Apakah pemeriksaan proses dilakukan sesuai control plan?', guidance: 'Bandingkan karakteristik, frekuensi, dan metode dengan rekaman inspeksi.' },
    { question: 'Apakah produk akhir diverifikasi sebelum dilepas?', guidance: 'Periksa hasil final inspection serta identitas pemberi persetujuan.' },
    { question: 'Apakah alat ukur sesuai dan masih berlaku kalibrasinya?', guidance: 'Cocokkan identitas alat, sertifikat, masa berlaku, dan kondisi fisiknya.' },
    { question: 'Apakah sistem pengukuran dievaluasi?', guidance: 'Periksa studi pengukuran yang relevan dan tindak lanjut hasil tidak memadai.' },
    { question: 'Apakah produk tidak sesuai dipisahkan dan dikendalikan?', guidance: 'Periksa area karantina, label, keputusan disposisi, dan verifikasi ulang.' },
  ],
  'Process Engineering': [
    { question: 'Apakah alur proses sesuai kondisi aktual?', guidance: 'Telusuri flow proses dari material masuk sampai pengiriman.' },
    { question: 'Apakah risiko proses dianalisis dan diperbarui?', guidance: 'Periksa analisis risiko proses dan tindak lanjut perubahan atau kegagalan.' },
    { question: 'Apakah control plan selaras dengan risiko proses?', guidance: 'Cocokkan karakteristik kritis, metode kontrol, dan reaction plan.' },
    { question: 'Apakah instruksi kerja menjelaskan parameter proses?', guidance: 'Periksa parameter, toleransi, foto atau petunjuk operasi di tempat kerja.' },
    { question: 'Apakah perubahan engineering divalidasi sebelum diterapkan?', guidance: 'Telusuri sampel perubahan, persetujuan, uji coba, dan hasil validasi.' },
    { question: 'Apakah pencegahan kesalahan dan kapabilitas proses dievaluasi?', guidance: 'Periksa uji error proofing, data kapabilitas yang relevan, dan tindak lanjut.' },
  ],
  Production: [
    { question: 'Apakah operator menjalankan instruksi kerja terkini?', guidance: 'Amati operasi dan bandingkan dengan instruksi serta wawancara operator.' },
    { question: 'Apakah setup dan produk pertama diverifikasi?', guidance: 'Periksa checklist setup dan persetujuan first piece setelah pergantian.' },
    { question: 'Apakah parameter produksi dipantau?', guidance: 'Periksa log parameter, batas kontrol, dan tindakan saat terjadi penyimpangan.' },
    { question: 'Apakah material dan produk dapat ditelusuri?', guidance: 'Telusuri satu lot produk ke material, mesin, operator, dan tanggal produksi.' },
    { question: 'Apakah rework dan scrap dikendalikan?', guidance: 'Periksa instruksi rework, identifikasi scrap, dan hasil inspeksi ulang.' },
    { question: 'Apakah kapasitas dan realisasi produksi dievaluasi?', guidance: 'Bandingkan rencana dengan output, downtime, dan tindak lanjut kekurangan.' },
  ],
  Purchasing: [
    { question: 'Apakah supplier dipilih melalui evaluasi yang terdokumentasi?', guidance: 'Periksa kriteria seleksi, hasil evaluasi, dan daftar supplier disetujui.' },
    { question: 'Apakah pesanan mencantumkan spesifikasi yang jelas?', guidance: 'Telusuri PO ke gambar, revisi, jumlah, mutu, dan tanggal pengiriman.' },
    { question: 'Apakah kinerja supplier dipantau berkala?', guidance: 'Periksa scorecard mutu dan pengiriman serta tindak lanjut nilai rendah.' },
    { question: 'Apakah persyaratan pelanggan diteruskan ke supplier?', guidance: 'Periksa kontrak, lampiran teknis, dan bukti penerimaan persyaratan.' },
    { question: 'Apakah perubahan material atau sumber pasokan disetujui?', guidance: 'Periksa permintaan perubahan, kajian risiko, dan persetujuan sebelum pembelian.' },
    { question: 'Apakah risiko keterlambatan pasokan ditangani?', guidance: 'Periksa pemantauan pesanan, eskalasi keterlambatan, dan alternatif pasokan.' },
  ],
  Warehouse: [
    { question: 'Apakah material diterima dengan identitas dan jumlah yang benar?', guidance: 'Cocokkan surat jalan, PO, label, dan hasil pemeriksaan penerimaan.' },
    { question: 'Apakah kondisi penyimpanan menjaga mutu material?', guidance: 'Amati kebersihan, suhu bila relevan, perlindungan, dan batas penumpukan.' },
    { question: 'Apakah FIFO atau FEFO diterapkan?', guidance: 'Telusuri tanggal masuk, kedaluwarsa, dan urutan pengeluaran sampel stok.' },
    { question: 'Apakah stok dan lokasi penyimpanan akurat?', guidance: 'Bandingkan sampel fisik dengan kartu stok atau sistem serta hasil stock opname.' },
    { question: 'Apakah barang karantina dipisahkan dari stok siap pakai?', guidance: 'Periksa penandaan status, area terpisah, dan pengendalian pengeluaran.' },
    { question: 'Apakah pengemasan dan pengiriman memenuhi kebutuhan pelanggan?', guidance: 'Periksa standar kemasan, label, jumlah, dan pemeriksaan sebelum kirim.' },
  ],
  Maintenance: [
    { question: 'Apakah mesin kritis terdaftar dan diprioritaskan?', guidance: 'Periksa daftar aset, tingkat kritikalitas, dan rencana pemeliharaan.' },
    { question: 'Apakah preventive maintenance dilakukan sesuai jadwal?', guidance: 'Bandingkan jadwal dengan checklist pekerjaan dan temuan tertunda.' },
    { question: 'Apakah kerusakan mesin dicatat dan dianalisis?', guidance: 'Periksa histori breakdown, downtime, penyebab berulang, dan tindakan.' },
    { question: 'Apakah spare part kritis tersedia?', guidance: 'Periksa daftar spare part, minimum stok, kondisi penyimpanan, dan lead time.' },
    { question: 'Apakah mesin diverifikasi setelah perbaikan?', guidance: 'Periksa uji fungsi, verifikasi parameter, dan serah terima ke produksi.' },
    { question: 'Apakah inspeksi harian dan keselamatan mesin dijalankan?', guidance: 'Periksa checklist operator, kondisi pelindung, dan penanganan abnormalitas.' },
  ],
  'Human Resources': [
    { question: 'Apakah kompetensi setiap jabatan ditetapkan?', guidance: 'Periksa uraian jabatan dan persyaratan keterampilan personel.' },
    { question: 'Apakah matriks keterampilan sesuai kondisi aktual?', guidance: 'Cocokkan matriks dengan operator yang ditugaskan pada proses.' },
    { question: 'Apakah kebutuhan dan rencana pelatihan tersedia?', guidance: 'Periksa analisis gap kompetensi dan jadwal pelatihan.' },
    { question: 'Apakah pelatihan dilaksanakan dan dicatat?', guidance: 'Periksa daftar hadir, materi, instruktur, dan hasil pelatihan.' },
    { question: 'Apakah efektivitas pelatihan diverifikasi?', guidance: 'Periksa observasi kerja atau evaluasi praktik setelah pelatihan.' },
    { question: 'Apakah personel baru memahami mutu dan tugasnya?', guidance: 'Periksa induksi, pendampingan, dan pemahaman penanganan produk tidak sesuai.' },
  ],
  'Management Representative': [
    { question: 'Apakah sasaran mutu terukur dan dipantau?', guidance: 'Periksa sasaran, penanggung jawab, tren pencapaian, dan tindak lanjut.' },
    { question: 'Apakah tinjauan manajemen dilaksanakan?', guidance: 'Periksa jadwal, notulen, data masukan, serta keputusan rapat.' },
    { question: 'Apakah keputusan tinjauan manajemen ditindaklanjuti?', guidance: 'Telusuri action list, PIC, target waktu, dan bukti penyelesaian.' },
    { question: 'Apakah risiko bisnis dan operasional dievaluasi?', guidance: 'Periksa daftar risiko, prioritas, rencana mitigasi, dan evaluasi berkala.' },
    { question: 'Apakah sumber daya untuk mutu tersedia?', guidance: 'Periksa tindak lanjut kebutuhan personel, alat, fasilitas, dan anggaran.' },
    { question: 'Apakah rencana kontinjensi diuji dan diperbarui?', guidance: 'Periksa skenario gangguan, simulasi, kontak darurat, dan hasil evaluasi.' },
  ],
};
export const DEPARTMENTS = Object.keys(CHECKLISTS);
export type Identity = { name: string; department: string };
export type Answer = { question: string; score: string; evidence: string; action: string; guidance?: string; pic?: string; dueDate?: string };
export type Audit = { id: string; supplier: string; date: string; auditor: string; department: string; status: 'Draft' | 'Final'; answers: Answer[]; updatedAt: string; checklistVersion?: number; location?: string; scope?: string; supplierContact?: string };
export function calculateScore(answers: Answer[]) {
  const applicable = answers.filter(a => /^[0-4]$/.test(a.score));
  return applicable.length ? Math.round(applicable.reduce((sum, a) => sum + Number(a.score), 0) / (applicable.length * 4) * 100) : null;
}
export function grade(score: number | null) {
  return score === null ? 'Belum dinilai' : score >= 85 ? 'A — Memenuhi' : score >= 70 ? 'B — Perlu perbaikan' : 'C — Perlu tindakan koreksi';
}
export function createAnswers(department: string): Answer[] {
  return CHECKLISTS[department].map(item => ({ ...item, score: '', evidence: '', action: '', pic: '', dueDate: '' }));
}
export function canFinalize(audit: Audit) {
  if (!audit.supplier.trim() || !audit.date || !audit.answers.length || calculateScore(audit.answers) === null) return false;
  if (audit.checklistVersion === 2 && !(audit.location?.trim() && audit.scope?.trim() && audit.supplierContact?.trim())) return false;
  return audit.answers.every(answer => {
    if (!(answer.score === 'NA' || /^[0-4]$/.test(answer.score)) || !answer.evidence.trim()) return false;
    if (answer.score === 'NA' || Number(answer.score) >= 3) return true;
    if (!answer.action.trim()) return false;
    return audit.checklistVersion !== 2 || Boolean(answer.pic?.trim() && answer.dueDate && answer.dueDate >= audit.date);
  });
}
