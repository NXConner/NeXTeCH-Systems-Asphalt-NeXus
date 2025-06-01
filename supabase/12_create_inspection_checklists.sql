CREATE TABLE IF NOT EXISTS inspection_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  employee_id uuid REFERENCES employees(id),
  job_id uuid REFERENCES jobs(id),
  items jsonb NOT NULL, -- array of checklist items with label, checked, notes
  photo_url text,
  warranty text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
); 