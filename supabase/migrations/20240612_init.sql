-- Create heatmap_data table
CREATE TABLE heatmap_data (
  id BIGSERIAL PRIMARY KEY,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  intensity DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create drone_data table
CREATE TABLE drone_data (
  id BIGSERIAL PRIMARY KEY,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pci_data table
CREATE TABLE pci_data (
  id BIGSERIAL PRIMARY KEY,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  value INTEGER NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create geofences table
CREATE TABLE geofences (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  geometry JSONB NOT NULL,
  hazard BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create map_views table
CREATE TABLE map_views (
  id BIGSERIAL PRIMARY KEY,
  center POINT NOT NULL,
  zoom INTEGER NOT NULL,
  layers TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create map_data table
CREATE TABLE map_data (
  id BIGSERIAL PRIMARY KEY,
  geometry JSONB NOT NULL,
  properties JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create compliance_data table
CREATE TABLE compliance_data (
  id BIGSERIAL PRIMARY KEY,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL,
  details JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for spatial queries
CREATE INDEX idx_heatmap_data_location ON heatmap_data (lat, lng);
CREATE INDEX idx_drone_data_location ON drone_data (lat, lng);
CREATE INDEX idx_pci_data_location ON pci_data (lat, lng);
CREATE INDEX idx_compliance_data_location ON compliance_data (lat, lng);

-- Create RLS policies
ALTER TABLE heatmap_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE drone_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE pci_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE geofences ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_data ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow read access for authenticated users"
  ON heatmap_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access for authenticated users"
  ON drone_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access for authenticated users"
  ON pci_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access for authenticated users"
  ON geofences FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access for authenticated users"
  ON map_views FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access for authenticated users"
  ON map_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access for authenticated users"
  ON compliance_data FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for admin users
CREATE POLICY "Allow full access for admin users"
  ON heatmap_data FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow full access for admin users"
  ON drone_data FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow full access for admin users"
  ON pci_data FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow full access for admin users"
  ON geofences FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow full access for admin users"
  ON map_views FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow full access for admin users"
  ON map_data FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow full access for admin users"
  ON compliance_data FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin'); 