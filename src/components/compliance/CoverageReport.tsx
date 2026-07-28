import { Download, FileSpreadsheet, Printer } from 'lucide-react';
import { ComplianceDocument, getCoverageSummary } from './coverage';

type CoverageReportProps = {
  documents: ComplianceDocument[];
};

const downloadFile = (filename: string, content: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export function CoverageReport({ documents }: CoverageReportProps) {
  const summary = getCoverageSummary(documents);
  const generatedAt = new Date().toISOString();

  const exportJson = () => {
    downloadFile(
      `iatf-coverage-${generatedAt.slice(0, 10)}.json`,
      JSON.stringify({ generatedAt, summary }, null, 2),
      'application/json',
    );
  };

  const exportCsv = () => {
    const header = ['code', 'title', 'status', 'direct_documents', 'owner', 'csr_relevant', 'audit_weight'];
    const lines = summary.rows.map((row) =>
      [
        row.clause.code,
        `"${row.clause.title.replaceAll('"', '""')}"`,
        row.status,
        row.directDocs.length,
        `"${row.clause.owner.replaceAll('"', '""')}"`,
        row.csrMapped,
        row.clause.auditWeight,
      ].join(','),
    );
    downloadFile(`iatf-coverage-${generatedAt.slice(0, 10)}.csv`, [header.join(','), ...lines].join('\n'), 'text/csv');
  };

  const exportExcel = () => {
    const rows = summary.rows
      .map(
        (row) => `<tr><td>${escapeHtml(row.clause.code)}</td><td>${escapeHtml(row.clause.title)}</td><td>${row.status}</td><td>${row.directDocs.length}</td><td>${escapeHtml(row.clause.owner)}</td><td>${row.csrMapped ? 'Yes' : '-'}</td></tr>`,
      )
      .join('');
    const workbook = `<html><body><table><thead><tr><th>Code</th><th>Title</th><th>Status</th><th>Documents</th><th>Owner</th><th>CSR</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    downloadFile(`iatf-coverage-${generatedAt.slice(0, 10)}.xls`, workbook, 'application/vnd.ms-excel');
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h3 className="text-sm font-bold">CoverageReport</h3>
          <p className="text-xs text-slate-500">Generator report coverage dengan export JSON, CSV, Excel, dan PDF.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exportCsv} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">
            <FileSpreadsheet className="h-4 w-4" />
            CSV
          </button>
          <button type="button" onClick={exportExcel} className="flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-xs font-bold text-white hover:bg-sky-700">
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </button>
          <button type="button" onClick={exportJson} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700">
            <Download className="h-4 w-4" />
            JSON
          </button>
          <button type="button" onClick={() => window.print()} className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
            <Printer className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      <div className="grid gap-3 text-xs md:grid-cols-4">
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
          <div className="text-slate-500">Generated</div>
          <div className="font-mono font-bold">{generatedAt.slice(0, 19).replace('T', ' ')}</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
          <div className="text-slate-500">Coverage</div>
          <div className="font-mono font-bold">{summary.coveragePercent}%</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
          <div className="text-slate-500">Uncovered</div>
          <div className="font-mono font-bold">{summary.uncovered}</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
          <div className="text-slate-500">Documents</div>
          <div className="font-mono font-bold">{documents.length}</div>
        </div>
      </div>
    </section>
  );
}
