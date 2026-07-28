import { useMemo, useState } from 'react';
import { Filter } from 'lucide-react';
import { ComplianceDocument, CoverageStatus, getCoverageRows, statusLabel, statusTone } from './coverage';

type MatrixFilter = 'all' | CoverageStatus | 'csr';

type ComplianceMatrixProps = {
  documents: ComplianceDocument[];
  onSelect: (code: string) => void;
};

const filters: { id: MatrixFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'covered', label: 'Covered' },
  { id: 'partial', label: 'Partial' },
  { id: 'uncovered', label: 'Uncovered' },
  { id: 'csr', label: 'CSR' },
];

export function ComplianceMatrix({ documents, onSelect }: ComplianceMatrixProps) {
  const [filter, setFilter] = useState<MatrixFilter>('all');
  const [owner, setOwner] = useState('ALL');
  const rows = useMemo(() => getCoverageRows(documents), [documents]);
  const owners = useMemo(() => Array.from(new Set(rows.map((row) => row.clause.owner))).sort(), [rows]);
  const filteredRows = rows.filter((row) => {
    const statusMatch = filter === 'all' || row.status === filter || (filter === 'csr' && row.csrMapped);
    const ownerMatch = owner === 'ALL' || row.clause.owner === owner;
    return statusMatch && ownerMatch;
  });

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h3 className="text-sm font-bold">ComplianceMatrix</h3>
          <p className="text-xs text-slate-500">Quick filter coverage dan CSR per klausul.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                filter === item.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
          <select
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="ALL">All owner</option>
            {owners.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="sticky top-0 bg-slate-100 text-[11px] uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-3 py-2">Klausul</th>
              <th className="px-3 py-2">Judul</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Dokumen</th>
              <th className="px-3 py-2">Owner</th>
              <th className="px-3 py-2">CSR</th>
              <th className="px-3 py-2">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredRows.map((row) => (
              <tr key={row.clause.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="px-3 py-2 font-mono font-bold text-indigo-600">
                  <button type="button" onClick={() => onSelect(row.clause.code)}>
                    {row.clause.code}
                  </button>
                </td>
                <td className="min-w-72 px-3 py-2 font-medium">{row.clause.title}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${statusTone[row.status]}`}>
                    {statusLabel[row.status]}
                  </span>
                </td>
                <td className="px-3 py-2 font-mono">{row.directDocs.length}</td>
                <td className="min-w-44 px-3 py-2">{row.clause.owner}</td>
                <td className="px-3 py-2">{row.csrMapped ? 'Yes' : '-'}</td>
                <td className="min-w-32 px-3 py-2">
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${row.status === 'covered' ? 'bg-emerald-500' : row.status === 'partial' ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${row.progress}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
