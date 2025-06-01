CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  client jsonb NOT NULL,
  project jsonb NOT NULL,
  status text NOT NULL,
  priority text NOT NULL,
  schedule jsonb NOT NULL,
  assigned_vehicles text[],
  assigned_crew text[],
  progress integer NOT NULL,
  timeline jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
); 