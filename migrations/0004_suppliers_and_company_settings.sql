ALTER TABLE organizations ADD COLUMN settings_code_salt TEXT;
ALTER TABLE organizations ADD COLUMN settings_code_hash TEXT;

UPDATE organizations
SET settings_code_salt = '9cfda9cf891d9947f165c8f9d0bbd7ec',
    settings_code_hash = '5878d26fb7a2815193fe9cba577ae736e1749d740bb0f45373f1dbb8afe264b7'
WHERE id = '5c7e9876-8519-47fd-a2cf-27fd7a294d10';

CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  contact TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  scope TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (organization_id, code),
  UNIQUE (organization_id, name)
);

CREATE INDEX IF NOT EXISTS idx_suppliers_organization ON suppliers(organization_id, active, name);
