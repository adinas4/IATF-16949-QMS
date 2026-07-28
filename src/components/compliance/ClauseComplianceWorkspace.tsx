import { useState } from 'react';
import { Filter } from 'lucide-react';
import { ClauseTree } from './ClauseTree';
import { ClauseSearch } from './ClauseSearch';
import { ClauseMapping } from './ClauseMapping';
import { CoverageDashboard } from './CoverageDashboard';
import { GapAnalyzer } from './GapAnalyzer';
import { ComplianceMatrix } from './ComplianceMatrix';
import { CoverageReport } from './CoverageReport';
import { ComplianceDocument } from './coverage';

type ClauseComplianceWorkspaceProps = {
  documents: ComplianceDocument[];
  onAssignClause: (documentId: string, clauseCode: string) => void;
  onRemoveClause: (documentId: string, clauseCode: string) => void;
};

export function ClauseComplianceWorkspace({
  documents,
  onAssignClause,
  onRemoveClause,
}: ClauseComplianceWorkspaceProps) {
  const [selectedCode, setSelectedCode] = useState('7.5');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [documentationOnly, setDocumentationOnly] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-xl font-bold">IATF 16949:2016 Clause Coverage Center</h2>
          <p className="text-xs text-slate-500">
            Tree, matrix, gap analysis, CSR mapping, audit readiness, rekomendasi dokumen, dan report export.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          Baseline memakai metadata/parafrase klausul, bukan teks resmi standar.
        </div>
      </div>

      <CoverageDashboard documents={documents} />

      <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center">
        <div className="flex items-center gap-2 text-xs font-bold">
          <Filter className="h-4 w-4 text-slate-400" />
          Clause management filter
        </div>
        <select
          value={levelFilter}
          onChange={(event) => setLevelFilter(event.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
        >
          <option value="ALL">Semua level</option>
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <option value="3">Level 3</option>
          <option value="4">Level 4+</option>
        </select>
        <label className="flex items-center gap-2 text-xs font-medium">
          <input
            type="checkbox"
            checked={documentationOnly}
            onChange={(event) => setDocumentationOnly(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600"
          />
          Hanya klausul dengan persyaratan dokumentasi
        </label>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_1fr]">
        <div className="space-y-6">
          <ClauseSearch
            documents={documents}
            onSelect={setSelectedCode}
            levelFilter={levelFilter}
            documentationOnly={documentationOnly}
          />
          <ClauseTree
            documents={documents}
            selectedCode={selectedCode}
            onSelect={setSelectedCode}
            levelFilter={levelFilter}
            documentationOnly={documentationOnly}
          />
        </div>
        <div className="space-y-6">
          <GapAnalyzer documents={documents} selectedCode={selectedCode} onSelect={setSelectedCode} />
          <ClauseMapping
            documents={documents}
            selectedCode={selectedCode}
            onAssignClause={onAssignClause}
            onRemoveClause={onRemoveClause}
          />
        </div>
      </div>

      <ComplianceMatrix documents={documents} onSelect={setSelectedCode} />
      <CoverageReport documents={documents} />
    </div>
  );
}
