# Step-by-Step Implementation

## 1. Database

1. Provision PostgreSQL 15+.
2. Run `docs/database-schema-and-seed.sql`.
3. Confirm the seed count:

```sql
SELECT COUNT(*) FROM iatf_clauses;
```

Expected result for this baseline: `244`.

## 2. Backend API

1. Implement endpoints in `docs/api.md`.
2. Use `clause_coverage_summary` as the source for dashboard and matrix counts.
3. Use `clause_requirement_matrix` as the source for documentation requirements and audit evidence recommendations.
4. Write audit logs on every document status change and clause mapping change.
5. Keep official IATF text out of the database unless the company has licensed content and access controls.

## 3. Frontend Integration

Implemented components:

- `src/components/compliance/ClauseTree.tsx`
- `src/components/compliance/ClauseMapping.tsx`
- `src/components/compliance/CoverageDashboard.tsx`
- `src/components/compliance/GapAnalyzer.tsx`
- `src/components/compliance/ComplianceMatrix.tsx`
- `src/components/compliance/ClauseSearch.tsx`
- `src/components/compliance/CoverageReport.tsx`

The clause workspace is wired into the existing `Mapping Klausul` tab through `ClauseComplianceWorkspace`.

## 4. Coverage Workflow

1. Upload or register a QMS document.
2. Map the document to exact leaf clauses whenever possible.
3. Move the document through Draft -> Review -> Approved.
4. Use `ComplianceMatrix` quick filters for `Uncovered`, `Partial`, and `CSR`.
5. Use `GapAnalyzer` to prioritize high-weight gaps.
6. Export the coverage report before internal audit or management review.

## 5. Production Hardening

- Add authentication and role-based authorization.
- Move file uploads to object storage.
- Replace local coverage calculations with API responses.
- Add immutable audit events for create, update, approve, obsolete, map, and unmap.
- Add scheduled notifications for uncovered critical clauses and overdue review dates.
