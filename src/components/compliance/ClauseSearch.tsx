import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { IATF_CLAUSES } from '../../data/iatfClauses';
import { ComplianceDocument, getClauseCoverage, statusLabel, statusTone } from './coverage';

type ClauseSearchProps = {
  documents: ComplianceDocument[];
  onSelect: (code: string) => void;
  levelFilter: string;
  documentationOnly: boolean;
};

export function ClauseSearch({ documents, onSelect, levelFilter, documentationOnly }: ClauseSearchProps) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const base = IATF_CLAUSES.filter((clause) => {
      const levelMatches = levelFilter === 'ALL' || (levelFilter === '4' ? clause.level >= 4 : clause.level === Number(levelFilter));
      const docMatches = !documentationOnly || clause.requiresDocument;
      return levelMatches && docMatches;
    });
    if (!normalized) return base.slice(0, 8);

    return base.filter((clause) => {
      const searchable = [clause.code, clause.title, clause.summary, clause.owner, ...clause.keywords].join(' ').toLowerCase();
      return searchable.includes(normalized);
    }).slice(0, 12);
  }, [documentationOnly, levelFilter, query]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-bold">ClauseSearch</h3>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari kode, judul, owner, CSR, APQP, PPAP..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-800"
        />
      </div>
      <div className="mt-3 max-h-72 overflow-auto">
        {results.map((clause) => {
          const coverage = getClauseCoverage(clause, documents);
          return (
            <button
              key={clause.code}
              type="button"
              onClick={() => onSelect(clause.code)}
              className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="min-w-0">
                <span className="font-mono font-bold text-indigo-600">{clause.code}</span>
                <span className="ml-2 font-medium">{clause.title}</span>
                <span className="block truncate text-[11px] text-slate-500">{clause.summary}</span>
              </span>
              <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold ${statusTone[coverage.status]}`}>
                {statusLabel[coverage.status]}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
