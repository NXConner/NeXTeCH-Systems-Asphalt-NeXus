# Supabase SQL and Tables

Copy and paste the SQL below into Supabase → SQL Editor → New Query, then click **RUN**.

```sql
-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. TABLE DEFINITIONS

-- Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT        UNIQUE,
  username   TEXT,
  avatar_url TEXT,
  role       TEXT        DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT,
  phone      TEXT,
  address    TEXT,
  created_by UUID        REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name             TEXT        NOT NULL,
  type             TEXT,
  license_plate    TEXT,
  status           TEXT        DEFAULT 'active',
  location         TEXT,
  last_maintenance TIMESTAMPTZ,
  assigned_to      UUID        REFERENCES profiles(id),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Vendors
CREATE TABLE IF NOT EXISTS vendors (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT        NOT NULL,
  contact_info TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs
CREATE TABLE IF NOT EXISTS jobs (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT        NOT NULL,
  description    TEXT,
  status         TEXT        DEFAULT 'pending',
  assigned_to    UUID        REFERENCES profiles(id),
  customer_id    UUID        REFERENCES customers(id),
  vehicle_id     UUID        REFERENCES vehicles(id),
  vendor_id      UUID        REFERENCES vendors(id),
  scheduled_date DATE,
  completed_date DATE,
  created_by     UUID        REFERENCES profiles(id),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Estimates
CREATE TABLE IF NOT EXISTS estimates (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id     UUID        REFERENCES jobs(id),
  amount     NUMERIC,
  status     TEXT        DEFAULT 'draft',
  created_by UUID        REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contracts
CREATE TABLE IF NOT EXISTS contracts (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id  UUID        REFERENCES estimates(id),
  customer_id  UUID        REFERENCES customers(id),
  contract_url TEXT,
  signed       BOOLEAN     DEFAULT FALSE,
  signed_by    UUID        REFERENCES profiles(id),
  signed_at    TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  estimate_id    UUID        REFERENCES estimates(id),
  invoice_number TEXT        UNIQUE,
  issued_date    DATE,
  due_date       DATE,
  amount         NUMERIC,
  status         TEXT        DEFAULT 'unpaid',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Items
CREATE TABLE IF NOT EXISTS inventory_items (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  sku        TEXT,
  quantity   INT         DEFAULT 0,
  location   TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Costs
CREATE TABLE IF NOT EXISTS costs (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id      UUID        REFERENCES jobs(id),
  description TEXT,
  amount      NUMERIC,
  cost_date   DATE,
  created_by  UUID        REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Receipts
CREATE TABLE IF NOT EXISTS receipts (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  cost_id      UUID        REFERENCES costs(id),
  file_url     TEXT,
  uploaded_by  UUID        REFERENCES profiles(id),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Logs
CREATE TABLE IF NOT EXISTS maintenance_logs (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id   UUID        REFERENCES vehicles(id),
  description  TEXT,
  performed_by UUID        REFERENCES profiles(id),
  performed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Payroll Records
CREATE TABLE IF NOT EXISTS payroll_records (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID        REFERENCES profiles(id),
  pay_period_start DATE,
  pay_period_end   DATE,
  gross_amount     NUMERIC,
  net_amount       NUMERIC,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Time Tracking
CREATE TABLE IF NOT EXISTS time_tracking (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES profiles(id),
  job_id      UUID        REFERENCES jobs(id),
  clock_in    TIMESTAMPTZ,
  clock_out   TIMESTAMPTZ,
  total_hours NUMERIC,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduling Entries
CREATE TABLE IF NOT EXISTS scheduling_entries (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID        REFERENCES inventory_items(id),
  job_id      UUID        REFERENCES jobs(id),
  start_time  TIMESTAMPTZ,
  end_time    TIMESTAMPTZ,
  created_by  UUID        REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics (event log)
CREATE TABLE IF NOT EXISTS analytics (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES profiles(id),
  event       TEXT,
  details     JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES profiles(id),
  title        TEXT,
  description  TEXT,
  achieved_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Badges
CREATE TABLE IF NOT EXISTS badges (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES profiles(id),
  name         TEXT,
  description  TEXT,
  awarded_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Rewards
CREATE TABLE IF_NOT_EXISTS rewards (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES profiles(id),
  reward_type  TEXT,
  description  TEXT,
  awarded_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback
CREATE TABLE IF_NOT_EXISTS feedback (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES profiles(id),
  message      TEXT,
  rating       INT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Inspection Checklists
CREATE TABLE IF NOT EXISTS inspection_checklists (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  template    JSONB,
  created_by  UUID        REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Inspection Results
CREATE TABLE IF NOT EXISTS inspection_results (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  checklist_id   UUID        REFERENCES inspection_checklists(id),
  job_id         UUID        REFERENCES jobs(id),
  user_id        UUID        REFERENCES profiles(id),
  answers        JSONB,
  completed_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES profiles(id),
  content     TEXT,
  read        BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Resource Allocations
CREATE TABLE IF NOT EXISTS resource_allocations (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id   UUID        REFERENCES inventory_items(id),
  job_id        UUID        REFERENCES jobs(id),
  quantity      NUMERIC,
  allocated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Zones
CREATE TABLE IF NOT EXISTS compliance_zones (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT,
  type        TEXT,
  geom        GEOMETRY,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE IF NOT_EXISTS documents (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id        UUID        REFERENCES jobs(id),
  user_id       UUID        REFERENCES profiles(id),
  document_url  TEXT,
  document_type TEXT,
  uploaded_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Forum Posts
CREATE TABLE IF NOT_EXISTS forum_posts (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES profiles(id),
  title        TEXT,
  content      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard
CREATE TABLE IF NOT_EXISTS leaderboard (
  user_id      UUID        PRIMARY KEY REFERENCES profiles(id),
  points       INT         DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE RLS
... (policies omitted for brevity)
```

(Full policy definitions follow above in main schema script.) 