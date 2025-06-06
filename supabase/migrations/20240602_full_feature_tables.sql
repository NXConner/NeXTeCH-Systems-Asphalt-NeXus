-- Asphalt Detection
create table if not exists asphalt_detections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  geometry geometry,
  area numeric,
  confidence numeric,
  created_at timestamp default now()
);

-- Geocoding Results
create table if not exists geocoding_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  address text,
  lat numeric,
  lng numeric,
  created_at timestamp default now()
);

-- Pressure Wash Zones
create table if not exists pressure_wash_zones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  zone_type text, -- 'dirty' or 'clean'
  geometry geometry,
  created_at timestamp default now()
);

-- PCI Polygons
create table if not exists pci_polygons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  geometry geometry,
  pci_score numeric,
  created_at timestamp default now()
);

-- Line Striping Templates
create table if not exists line_striping_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  type text,
  geometry geometry,
  created_at timestamp default now()
);

-- Compliance Overlays
create table if not exists compliance_overlays (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  type text,
  geometry geometry,
  warning text,
  created_at timestamp default now()
);

-- Geofences
create table if not exists geofences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  center geometry,
  radius numeric,
  name text,
  created_at timestamp default now()
);

-- Geofence Events
create table if not exists geofence_events (
  id uuid primary key default gen_random_uuid(),
  geofence_id uuid references geofences(id),
  user_id uuid references auth.users(id),
  event_type text,
  timestamp timestamp default now()
);

-- GPS Tracks
create table if not exists gps_tracks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  coordinates jsonb,
  timestamp timestamp default now()
);

-- Time Entries
create table if not exists time_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  start_time timestamp,
  end_time timestamp,
  activity_type text,
  location geometry,
  created_at timestamp default now()
);

-- Employee Locations
create table if not exists employee_locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  lat numeric,
  lng numeric,
  timestamp timestamp default now()
);

-- Logs
create table if not exists logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  type text,
  content jsonb,
  date date
);

-- Reports
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  type text,
  content jsonb,
  date date
);

-- Tax Summaries
create table if not exists tax_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  year int,
  data jsonb,
  created_at timestamp default now()
);

-- Contracts
create table if not exists contracts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  content text,
  signed boolean default false,
  created_at timestamp default now()
);

-- Receipts
create table if not exists receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  file_url text,
  amount numeric,
  vendor text,
  category text,
  date date
);

-- Invoices
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  contract_id uuid references contracts(id),
  amount numeric,
  status text,
  due_date date,
  created_at timestamp default now()
);

-- AR Detections
create table if not exists ar_detections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  type text,
  geometry geometry,
  score numeric,
  created_at timestamp default now()
);

-- Achievements
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  badge_id text,
  progress numeric,
  completed boolean default false,
  created_at timestamp default now()
);

-- Client Portal Shares
create table if not exists client_portal_shares (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  client_id uuid,
  type text,
  file_url text,
  created_at timestamp default now()
);

-- Safety Checklists
create table if not exists safety_checklists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  checklist jsonb,
  completed boolean,
  date date
);

-- Compliance Checks
create table if not exists compliance_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  type text,
  status text,
  notes text,
  date date
);

-- Integrations
create table if not exists integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  type text,
  status text,
  config jsonb
);

-- API Keys
create table if not exists api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  key text,
  permissions jsonb,
  created_at timestamp default now()
);

-- PWA Events
create table if not exists pwa_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  event_type text,
  timestamp timestamp default now()
);

-- Notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  type text,
  message text,
  read boolean default false,
  created_at timestamp default now()
);

-- Feedback
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  message text,
  rating int,
  created_at timestamp default now()
);

-- User Docs
create table if not exists user_docs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  doc_type text,
  url text,
  created_at timestamp default now()
);

-- Training Materials
create table if not exists training_materials (
  id uuid primary key default gen_random_uuid(),
  title text,
  url text,
  type text,
  created_at timestamp default now()
); 