import { useState } from 'react';
import { Link2, Plus, Trash2 } from 'lucide-react';
import { IATF_CLAUSES, buildClauseBreadcrumb } from '../../data/iatfClauses';
import { ComplianceDocument, getClauseCoverage } from './coverage';

type ClauseMappingProps = {
  documents: ComplianceDocument[];
  selectedCode: string;
  onAssignClause: (documentId: string, clauseCode: string) => void;
  onRemoveClause: (documentId: string, clauseCode: string) => void;
};

export function ClauseMapping({ documents, selectedCode, onAssignClause, onRemoveClause }: ClauseMappingProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const breadcrumb = buildClauseBreadcrumb(selectedCode);
  const selectedClause = breadcrumb[breadcrumb.length - 1];
  const coverage = selectedClause ? getClauseCoverage(selectedClause, documents) : null;
  const availableDocuments = documents.filter((doc) => !doc.clauses.includes(selectedCode));

  const suggestClauses = (doc: ComplianceDocument) => {
    const content = [doc.title, doc.docNumber, doc.department, doc.level, ...(doc.csr || [])].join(' ').toLowerCase();
    return IATF_CLAUSES
      .filter((clause) => Number(clause.code.split('.')[0]) >= 4)
      .map((clause) => {
        const terms = [clause.title, clause.summary, clause.owner, ...clause.keywords, ...clause.recommendedDocuments].join(' ').toLowerCase().split(/\W+/);
        const score = terms.reduce((sum, term) => (term.length > 2 && content.includes(term) ? sum + 1 : sum), 0);
        return { clause, score };
      })
      .filter((item) => item.score > 0 && !doc.clauses.includes(item.clause.code))
      .sort((a, b) => b.score - a.score || a.clause.code.localeCompare(b.clause.code, undefined, { numeric: true }))
      .slice(0, 3);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold">ClauseMapping</h3>
          <p className="text-xs text-slate-500">Drag dokumen ke klausul terpilih atau gunakan tombol plus.</p>
        </div>
        <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs font-bold dark:bg-slate-800">
          {selectedCode}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="text-xs font-bold">Dokumen tersedia</div>
          <div className="max-h-80 space-y-2 overflow-auto rounded-lg border border-slate-200 p-2 dark:border-slate-800">
            {availableDocuments.map((doc) => (
              <div
                key={doc.id}
                draggable
                onDragStart={() => setDraggingId(doc.id)}
                onDragEnd={() => setDraggingId(null)}
                className={`flex cursor-grab items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs active:cursor-grabbing ${
                  draggingId === doc.id ? 'border-indigo-300 bg-indigo-50 dark:bg-indigo-950/30' : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50'
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{doc.title}</span>
                  <span className="font-mono text-[11px] text-slate-500">{doc.docNumber}</span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {suggestClauses(doc).map((item) => (
                      <button
                        key={item.clause.code}
                        type="button"
                        onClick={() => onAssignClause(doc.id, item.clause.code)}
                        className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-50 dark:bg-slate-900 dark:text-indigo-300 dark:ring-indigo-900"
                        title={`Auto-suggest: ${item.clause.title}`}
                      >
                        {item.clause.code}
                      </button>
                    ))}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => onAssignClause(doc.id, selectedCode)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  title="Mapping ke klausul"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            if (draggingId) onAssignClause(draggingId, selectedCode);
            setDraggingId(null);
          }}
          className="rounded-lg border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-3 dark:border-indigo-900 dark:bg-indigo-950/20"
        >
          <div className="mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <Link2 className="h-4 w-4" />
              Klausul tujuan
            </div>
            <h4 className="mt-1 text-sm font-bold">
              {selectedCode} {selectedClause?.title}
            </h4>
            <p className="mt-1 text-xs text-slate-500">{selectedClause?.summary}</p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold">Evidence mapped direct</div>
            {(coverage?.directDocs || []).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-xs dark:bg-slate-900">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{doc.title}</span>
                  <span className="font-mono text-[11px] text-slate-500">{doc.docNumber} - {doc.status}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveClause(doc.id, selectedCode)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  title="Hapus mapping"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {coverage?.directDocs.length === 0 && (
              <div className="rounded-lg bg-white px-3 py-6 text-center text-xs text-slate-500 dark:bg-slate-900">
                Drop dokumen di area ini untuk membuat mapping klausul.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
