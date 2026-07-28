# API Documentation

Base path: `/api/v1`

The current React prototype reads/writes Firestore directly when configured. This document defines the backend contract to implement when the project is moved behind a service API.

## Clause Coverage

### `GET /clauses`

Returns the clause tree metadata.

Query parameters:

- `root`: optional clause code, for example `8` or `7.5`.
- `status`: optional `covered`, `partial`, `uncovered`.
- `csr`: optional boolean.
- `level`: optional numeric level filter, for example `1`, `2`, `3`, or `4plus`.
- `requiresDocument`: optional boolean.
- `q`: optional search text.

Response:

```json
{
  "data": [
    {
      "code": "7.5",
      "title": "Informasi terdokumentasi",
      "parentCode": "7",
      "level": 2,
      "category": "support",
      "ownerRole": "Document Control",
      "auditWeight": 5,
      "csrRelevant": true,
      "recommendedDocuments": ["Document control procedure", "Master document list"],
      "coverage": {
        "status": "partial",
        "directDocumentCount": 1,
        "approvedDocumentCount": 0,
        "progress": 55
      }
    }
  ]
}
```

### `GET /clauses/{code}`

Returns one clause with breadcrumb, children, mapped evidence, CSR mappings, gaps, and recommendations.

### `GET /coverage/summary`

Returns dashboard counters:

```json
{
  "totalClauses": 195,
  "covered": 12,
  "partial": 8,
  "uncovered": 175,
  "coveragePercent": 6,
  "auditReadinessPercent": 14,
  "criticalAlerts": 32
}
```

### `GET /coverage/matrix`

Returns the interactive matrix rows. Supports `status`, `owner`, `csr`, `category`, and `q`.

### `GET /coverage/gaps`

Returns prioritized gaps sorted by `auditWeight`, CSR relevance, and due date.

### `GET /clause-requirement-matrix`

Returns documentation and audit evidence expectations by clause.

Query parameters:

- `clauseCode`: optional exact clause code.
- `mandatory`: optional boolean.
- `requirementType`: optional `documented_evidence`, `csr_review`, `record_retention`, `audit_evidence`.

### `POST /clause-requirement-matrix`

Creates or updates a requirement row for a clause. Use this for licensed/internal requirement details, document mandatory flags, and audit evidence expectations.

## Document Mapping

### `POST /documents/{documentId}/clauses`

Maps a document to one or more clauses.

Request:

```json
{
  "clauseCodes": ["7.5.3", "7.5.3.2.1"],
  "evidenceType": "procedure",
  "notes": "Procedure covers retention and controlled copy flow."
}
```

### `DELETE /documents/{documentId}/clauses/{code}`

Removes one mapping. The service must write an audit log entry.

## CSR Integration

### `GET /csr-requirements`

Lists CSR items by customer and status.

### `POST /csr-requirements`

Creates a CSR requirement.

### `POST /csr-requirements/{csrId}/clauses`

Maps CSR to related IATF clauses.

## Reports

### `POST /reports/coverage`

Creates a report snapshot.

Request:

```json
{
    "format": "pdf",
  "filters": {
    "status": ["uncovered", "partial"],
    "includeCsr": true
  }
}
```

Supported `format` values: `pdf`, `xlsx`, `csv`, `json`.

Response:

```json
{
  "reportId": "b1f43d6c-2b3a-4b54-b4ee-2b3fbb741046",
  "downloadUrl": "https://storage.example/reports/iatf-coverage.pdf",
  "expiresAt": "2026-07-28T10:00:00Z"
}
```

## Status Rules

- `covered`: at least one approved direct evidence document is mapped to the clause.
- `partial`: evidence exists but is not approved, or only child evidence exists for a parent clause.
- `uncovered`: no evidence mapped.
- `ready`: covered and no open critical gap.
- `watch`: partial or due date/action close to target.
- `blocked`: uncovered critical clause or overdue action.
