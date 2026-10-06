-- The Ecological Network — PostgreSQL / Supabase schema
-- Designed to scale to thousands of organizations with relational integrity.
-- Run in Supabase SQL editor or any PostgreSQL 14+ instance.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE verification_status AS ENUM (
  'PENDING_REVIEW',
  'REGISTERED',
  'VERIFIED',
  'IMPACT_DOCUMENTED',
  'NETWORK_PARTNER'
);

CREATE TYPE organization_type AS ENUM (
  'Nonprofit',
  'Research Institute',
  'Land Trust',
  'Community Organization',
  'Tribal Organization',
  'Coalition',
  'University Program',
  'Government Partner'
);

CREATE TYPE relationship_type AS ENUM (
  'Partnership',
  'Shared project',
  'Funding',
  'Research collaboration',
  'Government partnership',
  'University partnership',
  'Shared conservation area',
  'Coalition membership'
);

CREATE TYPE source_type AS ENUM (
  'Official website',
  'IRS nonprofit information',
  'State nonprofit registry',
  'Annual report',
  'Government database',
  'Scientific publication',
  'University research',
  'Conservation database',
  'Other'
);

CREATE TYPE project_status AS ENUM ('Active', 'Completed', 'Planned');

-- Core tables
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_demo_data BOOLEAN NOT NULL DEFAULT FALSE,
  website TEXT,
  logo_url TEXT,
  logo_initials TEXT,
  logo_color TEXT,
  founded_year INTEGER NOT NULL CHECK (founded_year >= 1600 AND founded_year <= EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER),
  organization_type organization_type NOT NULL,
  mission TEXT NOT NULL,
  primary_focus TEXT NOT NULL,
  geographic_service_area TEXT NOT NULL,
  verification_status verification_status NOT NULL DEFAULT 'PENDING_REVIEW',
  last_verified TIMESTAMPTZ,
  contact_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_organizations_status ON organizations (verification_status);
CREATE INDEX idx_organizations_type ON organizations (organization_type);
CREATE INDEX idx_organizations_founded ON organizations (founded_year);
CREATE INDEX idx_organizations_demo ON organizations (is_demo_data);
-- Optional: CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- Optional: CREATE INDEX idx_organizations_name_trgm ON organizations USING gin (name gin_trgm_ops);

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  state_code CHAR(2) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  service_area_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_locations_org ON locations (organization_id);
CREATE INDEX idx_locations_state ON locations (state_code);
CREATE INDEX idx_locations_geo ON locations (latitude, longitude);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE organization_categories (
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (organization_id, category_id)
);

CREATE TABLE ecosystems (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE organization_ecosystems (
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  ecosystem_id INTEGER NOT NULL REFERENCES ecosystems(id) ON DELETE CASCADE,
  PRIMARY KEY (organization_id, ecosystem_id)
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  status project_status NOT NULL DEFAULT 'Active',
  year_started INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_org ON projects (organization_id);

CREATE TABLE project_ecosystems (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  ecosystem_id INTEGER NOT NULL REFERENCES ecosystems(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, ecosystem_id)
);

CREATE TABLE impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  year INTEGER,
  is_demo_placeholder BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_impact_org ON impact_metrics (organization_id);

CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  type source_type NOT NULL,
  url TEXT,
  accessed_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sources_org ON sources (organization_id);

-- Junction: many-to-many attribution of sources to metrics/projects
CREATE TABLE impact_metric_sources (
  impact_metric_id UUID NOT NULL REFERENCES impact_metrics(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  PRIMARY KEY (impact_metric_id, source_id)
);

CREATE TABLE project_sources (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, source_id)
);

CREATE TABLE partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  target_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type relationship_type NOT NULL,
  description TEXT NOT NULL,
  geographic_connection TEXT,
  is_demo_data BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (source_org_id <> target_org_id),
  UNIQUE (source_org_id, target_org_id, type)
);

CREATE INDEX idx_partnerships_source ON partnerships (source_org_id);
CREATE INDEX idx_partnerships_target ON partnerships (target_org_id);

CREATE TABLE partnership_ecosystems (
  partnership_id UUID NOT NULL REFERENCES partnerships(id) ON DELETE CASCADE,
  ecosystem_id INTEGER NOT NULL REFERENCES ecosystems(id) ON DELETE CASCADE,
  PRIMARY KEY (partnership_id, ecosystem_id)
);

CREATE TABLE partnership_sources (
  partnership_id UUID NOT NULL REFERENCES partnerships(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  PRIMARY KEY (partnership_id, source_id)
);

-- Environmental datasets remain separate from organization data
CREATE TABLE environmental_datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  is_demo_placeholder BOOLEAN NOT NULL DEFAULT FALSE,
  dataset_name TEXT NOT NULL,
  source_organization TEXT NOT NULL,
  source_url TEXT NOT NULL,
  dataset_date DATE,
  geographic_resolution TEXT NOT NULL,
  methodology TEXT NOT NULL,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE environmental_layer_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id UUID NOT NULL REFERENCES environmental_datasets(id) ON DELETE CASCADE,
  state_code CHAR(2) NOT NULL,
  intensity DOUBLE PRECISION NOT NULL CHECK (intensity >= 0 AND intensity <= 1),
  geometry JSONB,
  UNIQUE (dataset_id, state_code)
);

CREATE INDEX idx_env_values_dataset ON environmental_layer_values (dataset_id);

-- Submission queue (Add Your Organization)
CREATE TABLE organization_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payload JSONB NOT NULL,
  status verification_status NOT NULL DEFAULT 'PENDING_REVIEW',
  accuracy_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT
);

CREATE INDEX idx_submissions_status ON organization_submissions (status);

-- Verification audit trail
CREATE TABLE verification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  previous_status verification_status,
  new_status verification_status NOT NULL,
  notes TEXT,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_by TEXT
);

CREATE INDEX idx_verification_org ON verification_events (organization_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
