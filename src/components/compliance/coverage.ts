import { ClauseNode, LEAF_REQUIREMENT_CLAUSES, REQUIREMENT_CLAUSES } from '../../data/iatfClauses';

export type CoverageStatus = 'covered' | 'partial' | 'uncovered';

export type ComplianceDocument = {
  id: string;
  docNumber: string;
  title: string;
  status: string;
  level?: string;
  department?: string;
  clauses: string[];
  csr?: string[];
  reviewDueDate?: string;
};

export type ClauseCoverage = {
  clause: ClauseNode;
  status: CoverageStatus;
  directDocs: ComplianceDocument[];
  inheritedDocs: ComplianceDocument[];
  csrMapped: boolean;
  auditReady: boolean;
  progress: number;
  recommendations: string[];
};

const matchesClause = (documentClause: string, clauseCode: string) =>
  documentClause === clauseCode || documentClause.startsWith(`${clauseCode}.`);

const hasApproved = (documents: ComplianceDocument[]) =>
  documents.some((doc) => doc.status === 'Approved');

export const getDocumentsForClause = (
  documents: ComplianceDocument[],
  clauseCode: string,
  directOnly = false,
) =>
  documents.filter((doc) =>
    doc.clauses?.some((documentClause) =>
      directOnly ? documentClause === clauseCode : matchesClause(documentClause, clauseCode),
    ),
  );

export const getClauseCoverage = (
  clause: ClauseNode,
  documents: ComplianceDocument[],
): ClauseCoverage => {
  const directDocs = getDocumentsForClause(documents, clause.code, true);
  const inheritedDocs = getDocumentsForClause(documents, clause.code, false);
  const csrMapped = inheritedDocs.some((doc) => (doc.csr || []).some((csr) => csr !== 'General Automotive'));
  const approvedDirect = hasApproved(directDocs);
  const approvedInherited = hasApproved(inheritedDocs);
  const status: CoverageStatus = approvedDirect ? 'covered' : inheritedDocs.length || approvedInherited ? 'partial' : 'uncovered';
  const progress = status === 'covered' ? 100 : status === 'partial' ? 55 : 0;
  const auditReady = approvedDirect && clause.auditWeight >= 4;
  const recommendations =
    status === 'covered'
      ? []
      : clause.recommendedDocuments.map((name) => `Buat atau mapping dokumen: ${name}`);

  return {
    clause,
    status,
    directDocs,
    inheritedDocs,
    csrMapped: clause.csrRelevant || csrMapped,
    auditReady,
    progress,
    recommendations,
  };
};

export const getCoverageRows = (documents: ComplianceDocument[]) =>
  REQUIREMENT_CLAUSES.map((clause) => getClauseCoverage(clause, documents));

export const getCoverageSummary = (documents: ComplianceDocument[]) => {
  const rows = getCoverageRows(documents);
  const leafRows = LEAF_REQUIREMENT_CLAUSES.map((clause) => getClauseCoverage(clause, documents));
  const covered = rows.filter((row) => row.status === 'covered').length;
  const partial = rows.filter((row) => row.status === 'partial').length;
  const uncovered = rows.filter((row) => row.status === 'uncovered').length;
  const leafCovered = leafRows.filter((row) => row.status === 'covered').length;
  const weightedTotal = rows.reduce((sum, row) => sum + row.clause.auditWeight, 0);
  const weightedScore = rows.reduce((sum, row) => sum + row.clause.auditWeight * (row.progress / 100), 0);

  return {
    total: rows.length,
    covered,
    partial,
    uncovered,
    leafTotal: leafRows.length,
    leafCovered,
    coveragePercent: Math.round((covered / (rows.length || 1)) * 100),
    leafCoveragePercent: Math.round((leafCovered / (leafRows.length || 1)) * 100),
    auditReadinessPercent: Math.round((weightedScore / (weightedTotal || 1)) * 100),
    rows,
    leafRows,
    sectionPercentages: ['4', '5', '6', '7', '8', '9', '10'].map((section) => {
      const sectionRows = rows.filter((row) => row.clause.code === section || row.clause.code.startsWith(`${section}.`));
      const sectionCovered = sectionRows.filter((row) => row.status === 'covered').length;
      return {
        section,
        total: sectionRows.length,
        covered: sectionCovered,
        percent: Math.round((sectionCovered / (sectionRows.length || 1)) * 100),
      };
    }),
  };
};

export const statusTone: Record<CoverageStatus, string> = {
  covered: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900',
  partial: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
  uncovered: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900',
};

export const statusLabel: Record<CoverageStatus, string> = {
  covered: 'Covered',
  partial: 'Partial',
  uncovered: 'Uncovered',
};
