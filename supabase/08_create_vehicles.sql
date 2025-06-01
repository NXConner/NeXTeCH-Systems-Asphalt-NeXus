CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  status text NOT NULL,
  location jsonb NOT NULL,
  driver text,
  fuel_level integer NOT NULL,
  mileage integer NOT NULL,
  maintenance_score integer NOT NULL,
  route text,
  speed integer NOT NULL,
  engine_hours integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
); 