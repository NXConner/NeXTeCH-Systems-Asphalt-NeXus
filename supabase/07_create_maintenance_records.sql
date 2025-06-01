CREATE TABLE IF NOT EXISTS maintenance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL,
  priority text NOT NULL,
  scheduled_date timestamptz NOT NULL,
  completed_date timestamptz,
  cost numeric NOT NULL,
  mileage integer NOT NULL,
  performed_by text NOT NULL,
  notes text,
  parts jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
); 