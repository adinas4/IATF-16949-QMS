import { AlertTriangle, CheckCircle2, ClipboardList } from 'lucide-react';
import { ComplianceDocument, getCoverageRows, statusLabel, statusTone } from './coverage';

type GapAnalyzerProps = {
  documents: ComplianceDocument[];
  selectedCode: string;
  onSelect: (code: string) => void;
};

export function GapAnalyzer({ documents, selectedCode, onSelect }: GapAnalyzerProps) {
  const rows = getCoverageRows(documents);
  const selected = rows.find((row) => row.clause.code === selectedCode) || rows[0];
  const gaps = rows
    .filter((row) => row.status !== 'covered')
    .sort((a, b) => b.clause.auditWeight - a.clause.auditWeight || a.clause.code.localeCompare(b.clause.code, undefined, { numeric: true }))
    .slice(0, 8);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold">GapAnalyzer</h3>
        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${statusTone[selected.status]}`}>
          {statusLabel[selected.status]}
        </span>
      </div>

      <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-xs font-bold text-indigo-600">{selected.clause.code}</div>
            <h4 className="text-sm font-bold">{selected.clause.title}</h4>
          </div>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold dark:bg-slate-800">
            Weight {selected.clause.auditWeight}
          </span>
        </div>
        <p className="text-xs text-slate-500">{selected.clause.summary}</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <div className="rounded-md bg-slate-50 p-2 text-xs dark:bg-slate-800/60">
            <span className="font-bold">Owner:</span> {selected.clause.owner}
          </div>
          <div className="rounded-md bg-slate-50 p-2 text-xs dark:bg-slate-800/60">
            <span className="font-bold">Evidence:</span> {selected.directDocs.length} direct / {selected.inheritedDocs.length} inherited
          </div>
        </div>
        <div className="mt-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold">
            {selected.status === 'covered' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <ClipboardList className="h-4 w-4 text-amber-600" />}
            Rekomendasi dokumen
          </div>
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
            {(selected.recommendations.length ? selected.recommendations : ['Evidence approved sudah tersedia untuk klausul ini.']).map((item) => (
              <li key={item} className="rounded-md bg-slate-50 px-2 py-1.5 dark:bg-slate-800/50">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-300">
          <AlertTriangle className="h-4 w-4" />
          Gap prioritas
        </div>
        <div className="max-h-72 space-y-2 overflow-auto">
          {gaps.map((row) => (
            <button
              key={row.clause.code}
              type="button"
              onClick={() => onSelect(row.clause.code)}
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-left text-xs hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-800 dark:hover:bg-indigo-950/30"
            >
              <span className="min-w-0">
                <span className="font-mono font-bold">{row.clause.code}</span>
                <span className="ml-2 font-medium">{row.clause.title}</span>
              </span>
              <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold ${statusTone[row.status]}`}>
                {statusLabel[row.status]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
