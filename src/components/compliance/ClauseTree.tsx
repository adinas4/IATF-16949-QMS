import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Circle } from 'lucide-react';
import { ClauseNode, IATF_CLAUSES, buildClauseBreadcrumb } from '../../data/iatfClauses';
import { ComplianceDocument, getClauseCoverage, statusLabel, statusTone } from './coverage';

type ClauseTreeProps = {
  documents: ComplianceDocument[];
  selectedCode: string;
  onSelect: (code: string) => void;
  levelFilter: string;
  documentationOnly: boolean;
};

export function ClauseTree({ documents, selectedCode, onSelect, levelFilter, documentationOnly }: ClauseTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '7.5', '8.5', '9.2', '10.2']),
  );

  const childrenByParent = useMemo(() => {
    const visible = new Set(
      IATF_CLAUSES.filter((clause) => {
        const levelMatches = levelFilter === 'ALL' || (levelFilter === '4' ? clause.level >= 4 : clause.level === Number(levelFilter));
        const docMatches = !documentationOnly || clause.requiresDocument;
        return levelMatches && docMatches;
      }).map((clause) => clause.code),
    );

    IATF_CLAUSES.forEach((clause) => {
      if (!visible.has(clause.code)) return;
      let parent = clause.parentCode;
      while (parent) {
        visible.add(parent);
        parent = IATF_CLAUSES.find((item) => item.code === parent)?.parentCode || null;
      }
    });

    const map = new Map<string | null, ClauseNode[]>();
    IATF_CLAUSES.filter((clause) => visible.has(clause.code)).forEach((clause) => {
      const key = clause.parentCode;
      map.set(key, [...(map.get(key) || []), clause]);
    });
    return map;
  }, [documentationOnly, levelFilter]);

  const breadcrumb = buildClauseBreadcrumb(selectedCode);

  const toggle = (code: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const renderNode = (node: ClauseNode) => {
    const children = childrenByParent.get(node.code) || [];
    const coverage = getClauseCoverage(node, documents);
    const isExpanded = expanded.has(node.code);
    const isSelected = selectedCode === node.code;

    return (
      <li key={node.code}>
        <div
          className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs ${
            isSelected
              ? 'bg-indigo-50 text-indigo-800 ring-1 ring-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-200 dark:ring-indigo-900'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800/70'
          }`}
        >
          <button
            type="button"
            aria-label={isExpanded ? 'Collapse clause' : 'Expand clause'}
            onClick={() => children.length && toggle(node.code)}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-md hover:bg-white dark:hover:bg-slate-900"
          >
            {children.length ? (
              isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              <Circle className="h-2.5 w-2.5 fill-current text-slate-300" />
            )}
          </button>
          <button type="button" onClick={() => onSelect(node.code)} className="min-w-0 flex-1 text-left">
            <span className="font-mono font-bold">{node.code}</span>
            <span className="ml-2 truncate align-bottom font-medium">{node.title}</span>
          </button>
          <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold ${statusTone[coverage.status]}`}>
            {statusLabel[coverage.status]}
          </span>
        </div>
        {children.length > 0 && isExpanded && (
          <ul className="ml-5 border-l border-slate-200 pl-2 dark:border-slate-800">
            {children.map(renderNode)}
          </ul>
        )}
      </li>
    );
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3">
        <h3 className="text-sm font-bold">ClauseTree</h3>
        <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
          {breadcrumb.map((item, index) => (
            <span key={item.code} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-3 w-3" />}
              <button type="button" onClick={() => onSelect(item.code)} className="font-mono hover:text-indigo-600">
                {item.code}
              </button>
            </span>
          ))}
        </div>
      </div>
      <ul className="max-h-[620px] space-y-1 overflow-auto pr-1">{(childrenByParent.get(null) || []).map(renderNode)}</ul>
    </section>
  );
}
