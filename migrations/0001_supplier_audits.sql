CREATE TABLE IF NOT EXISTS supplier_audits (
  id TEXT PRIMARY KEY,
  supplier TEXT NOT NULL,
  department TEXT NOT NULL,
  auditor TEXT NOT NULL,
  audit_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Draft', 'Final')),
  score INTEGER,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_supplier_audits_updated_at ON supplier_audits(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_supplier_audits_supplier ON supplier_audits(supplier);
CREATE INDEX IF NOT EXISTS idx_supplier_audits_department ON supplier_audits(department);
