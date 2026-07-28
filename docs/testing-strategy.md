# Testing Strategy for 100% Coverage Verification

## Unit Tests

- Validate every clause code is unique.
- Validate every `parentCode` exists.
- Validate requirement clauses start at clause 4 through 10.
- Validate every clause marked `requires_document` has at least one recommended document.
- Validate coverage status rules:
  - no mapping -> `uncovered`
  - draft/review mapping -> `partial`
  - approved direct mapping -> `covered`

## Integration Tests

- Seed database and assert `SELECT COUNT(*) FROM iatf_clauses` returns `244`.
- Assert `clause_requirement_matrix` has at least one requirement row for every seeded clause.
- Insert approved and draft documents, map clauses, and assert `clause_coverage_summary` returns the expected status.
- Verify CSR mappings are returned in `/coverage/matrix?csr=true`.
- Verify map/unmap endpoints create audit events.

## UI Tests

- Clause tree expands and collapses without layout shift.
- Search returns matches for code, title, owner, CSR, APQP, PPAP, MSA, SPC, and 8D.
- Drag-and-drop mapping updates the selected clause evidence list.
- Quick filters show the expected All, Covered, Partial, Uncovered, and CSR rows.
- Report export creates CSV, JSON, Excel-compatible XLS, and PDF via browser print.
- Mobile viewport keeps tree, matrix, and buttons readable without overlap.

## 100% Coverage Gate

Run this query before claiming audit-ready 100% coverage:

```sql
SELECT code, title, coverage_status
FROM clause_coverage_summary
WHERE coverage_status <> 'covered'
ORDER BY audit_weight DESC, code;
```

The gate passes only when this query returns zero rows for the agreed clause scope. For a stricter gate, require all leaf clauses to be directly covered by approved evidence.

```sql
WITH parents AS (
  SELECT DISTINCT parent_code
  FROM iatf_clauses
  WHERE parent_code IS NOT NULL
)
SELECT c.code, c.title
FROM iatf_clauses c
LEFT JOIN parents p ON p.parent_code = c.code
LEFT JOIN clause_coverage_summary s ON s.code = c.code
WHERE split_part(c.code, '.', 1)::int >= 4
  AND p.parent_code IS NULL
  AND COALESCE(s.coverage_status, 'uncovered') <> 'covered'
ORDER BY c.code;
```
