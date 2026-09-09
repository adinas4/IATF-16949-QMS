CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE COLLATE NOCASE,
  code_salt TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at TEXT NOT NULL
);

INSERT OR IGNORE INTO organizations (id, slug, name, code_salt, code_hash, active, created_at)
VALUES (
  '5c7e9876-8519-47fd-a2cf-27fd7a294d10',
  'pt-mrp',
  'PT MRP',
  '2c025bb4d8d4f581eccf5bb2f8bad6a3',
  '8c966755c81bc70dfc1eedeeabdad3d382e04f939a297ef557f5f705c52d8756',
  1,
  '2026-09-09T00:00:00.000Z'
);

ALTER TABLE supplier_audits ADD COLUMN organization_id TEXT REFERENCES organizations(id);
UPDATE supplier_audits
SET organization_id = '5c7e9876-8519-47fd-a2cf-27fd7a294d10'
WHERE organization_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_supplier_audits_organization ON supplier_audits(organization_id, updated_at DESC);
