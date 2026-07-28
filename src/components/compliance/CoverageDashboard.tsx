import { AlertTriangle, Bell, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import { ComplianceDocument, getCoverageSummary } from './coverage';

type CoverageDashboardProps = {
  documents: ComplianceDocument[];
};

export function CoverageDashboard({ documents }: CoverageDashboardProps) {
  const summary = getCoverageSummary(documents);
  const criticalGaps = summary.rows
    .filter((row) => row.status !== 'covered' && row.clause.auditWeight >= 5)
    .slice(0, 5);

  const cards = [
    { label: 'Coverage klausul', value: `${summary.coveragePercent}%`, icon: CheckCircle2, tone: 'text-emerald-600' },
    { label: 'Audit readiness', value: `${summary.auditReadinessPercent}%`, icon: ShieldCheck, tone: 'text-indigo-600' },
    { label: 'Leaf covered', value: `${summary.leafCovered}/${summary.leafTotal}`, icon: FileText, tone: 'text-sky-600' },
    { label: 'Alert gap kritis', value: criticalGaps.length, icon: Bell, tone: 'text-rose-600' },
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold">CoverageDashboard</h3>
          <p className="text-xs text-slate-500">Ringkasan coverage, readiness, dan alert klausul belum tercover.</p>
        </div>
        <span className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-mono dark:border-slate-700">
          {summary.total} nodes
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>{card.label}</span>
                <Icon className={`h-4 w-4 ${card.tone}`} />
              </div>
              <div className={`text-2xl font-bold ${card.tone}`}>{card.value}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {[
          { label: 'Covered', value: summary.covered, color: 'bg-emerald-500' },
          { label: 'Partial', value: summary.partial, color: 'bg-amber-500' },
          { label: 'Uncovered', value: summary.uncovered, color: 'bg-rose-500' },
        ].map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-semibold">{item.label}</span>
              <span className="font-mono">{item.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className={`h-full ${item.color}`} style={{ width: `${Math.round((item.value / summary.total) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="mb-2 text-xs font-bold">Compliance percentage per section</div>
          <div className="space-y-2">
            {summary.sectionPercentages.map((item) => (
              <div key={item.section} className="grid grid-cols-[2.5rem_1fr_3rem] items-center gap-2 text-xs">
                <span className="font-mono font-bold">Sec {item.section}</span>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-indigo-600" style={{ width: `${item.percent}%` }} />
                </div>
                <span className="text-right font-mono">{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-bold">Coverage heat map</div>
          <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(16px, 1fr))' }}>
            {summary.rows.map((row) => (
              <div
                key={row.clause.code}
                title={`${row.clause.code} ${row.clause.title}: ${row.status}`}
                className={`h-4 rounded-sm ${
                  row.status === 'covered' ? 'bg-emerald-500' : row.status === 'partial' ? 'bg-amber-500' : 'bg-rose-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {criticalGaps.length > 0 && (
        <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-900 dark:bg-rose-950/30">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-300">
            <AlertTriangle className="h-4 w-4" />
            Notifikasi klausul prioritas audit
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {criticalGaps.map((row) => (
              <div key={row.clause.code} className="rounded-md bg-white px-3 py-2 text-xs dark:bg-slate-900">
                <span className="font-mono font-bold">{row.clause.code}</span>
                <span className="ml-2 font-medium">{row.clause.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
