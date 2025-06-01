CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  personal_info jsonb NOT NULL,
  employment jsonb NOT NULL,
  compensation jsonb NOT NULL,
  benefits jsonb NOT NULL,
  skills text[],
  certifications jsonb,
  performance_reviews jsonb,
  time_tracking jsonb,
  emergency_contact jsonb,
  documents jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
); 