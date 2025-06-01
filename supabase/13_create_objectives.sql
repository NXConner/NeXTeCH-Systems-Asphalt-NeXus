CREATE TABLE IF NOT EXISTS objectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL, -- daily or weekly
  priority text NOT NULL, -- high, medium, low
  completed boolean DEFAULT false,
  due_date date NOT NULL,
  assigned_to uuid REFERENCES employees(id),
  progress integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
); 