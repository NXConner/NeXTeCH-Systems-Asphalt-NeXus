CREATE TABLE IF NOT EXISTS payroll (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id),
  pay_period jsonb NOT NULL,
  gross_pay numeric NOT NULL,
  deductions jsonb NOT NULL,
  net_pay numeric NOT NULL,
  pay_date date NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
); 