-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types if they don't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_type AS ENUM ('paving', 'maintenance', 'striping', 'sealcoating', 'patching');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE account_type AS ENUM ('asset', 'liability', 'equity', 'revenue', 'expense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE bank_account_type AS ENUM ('checking', 'savings', 'credit');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM ('contract', 'tax-form', 'certification', 'review', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('pending', 'scheduled', 'in-progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inventory_category AS ENUM ('asphalt', 'aggregate', 'equipment', 'tools', 'chemicals', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE purchase_order_status AS ENUM ('draft', 'sent', 'confirmed', 'received', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create or update tables
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role user_role DEFAULT 'employee',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    street TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    company TEXT,
    notes TEXT,
    status TEXT DEFAULT 'active',
    type TEXT DEFAULT 'individual',
    contact_person TEXT,
    credit_limit DECIMAL(10,2) DEFAULT 0,
    payment_terms TEXT,
    total_value DECIMAL(10,2) DEFAULT 0,
    last_contact TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customer_contacts table
CREATE TABLE customer_contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    subject TEXT NOT NULL,
    notes TEXT,
    date TIMESTAMPTZ NOT NULL,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    client_id UUID REFERENCES customers(id),
    project_type project_type NOT NULL,
    description TEXT,
    location TEXT,
    estimated_area DECIMAL(10,2),
    estimated_cost DECIMAL(10,2),
    status job_status DEFAULT 'pending',
    priority job_priority DEFAULT 'medium',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    estimated_duration INTEGER,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job_assignments table
CREATE TABLE job_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    vehicle_id UUID,
    crew_member_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job_timeline table
CREATE TABLE job_timeline (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Create estimates table
CREATE TABLE estimates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    client_id UUID REFERENCES customers(id),
    project_type project_type NOT NULL,
    description TEXT,
    location TEXT,
    area DECIMAL(10,2),
    linear_feet DECIMAL(10,2),
    materials_cost DECIMAL(10,2),
    labor_cost DECIMAL(10,2),
    equipment_cost DECIMAL(10,2),
    overhead DECIMAL(10,2),
    profit DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    status TEXT DEFAULT 'draft',
    valid_until TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create estimate_materials table
CREATE TABLE estimate_materials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    quantity DECIMAL(10,2),
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    coverage DECIMAL(10,2)
);

-- Create estimate_labor table
CREATE TABLE estimate_labor (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    hours DECIMAL(10,2),
    rate DECIMAL(10,2),
    total_cost DECIMAL(10,2)
);

-- Create estimate_equipment table
CREATE TABLE estimate_equipment (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    daily_rate DECIMAL(10,2),
    days INTEGER,
    total_cost DECIMAL(10,2)
);

-- Create inventory_items table
CREATE TABLE inventory_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category inventory_category NOT NULL,
    sku TEXT UNIQUE,
    current_stock DECIMAL(10,2),
    minimum_stock DECIMAL(10,2),
    maximum_stock DECIMAL(10,2),
    unit TEXT,
    unit_cost DECIMAL(10,2),
    total_value DECIMAL(10,2),
    supplier_id UUID,
    location TEXT,
    last_restocked TIMESTAMPTZ,
    expiration_date TIMESTAMPTZ,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create suppliers table
CREATE TABLE suppliers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    street TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    payment_terms TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create purchase_orders table
CREATE TABLE purchase_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    subtotal DECIMAL(10,2),
    tax DECIMAL(10,2),
    total DECIMAL(10,2),
    status purchase_order_status DEFAULT 'draft',
    order_date TIMESTAMPTZ DEFAULT NOW(),
    expected_delivery TIMESTAMPTZ,
    actual_delivery TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create purchase_order_items table
CREATE TABLE purchase_order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_id UUID REFERENCES inventory_items(id),
    quantity DECIMAL(10,2),
    unit_cost DECIMAL(10,2),
    total DECIMAL(10,2),
    received DECIMAL(10,2) DEFAULT 0
);

-- Create invoices table
CREATE TABLE invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    estimate_id UUID REFERENCES estimates(id),
    job_id UUID REFERENCES jobs(id),
    subtotal DECIMAL(10,2),
    tax_rate DECIMAL(5,2),
    tax_amount DECIMAL(10,2),
    total DECIMAL(10,2),
    balance_remaining DECIMAL(10,2),
    status invoice_status DEFAULT 'draft',
    issue_date TIMESTAMPTZ DEFAULT NOW(),
    due_date TIMESTAMPTZ,
    paid_date TIMESTAMPTZ,
    payment_method TEXT,
    notes TEXT,
    terms TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invoice_items table
CREATE TABLE invoice_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2),
    unit_price DECIMAL(10,2),
    total DECIMAL(10,2)
);

-- Create accounts table
CREATE TABLE accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    account_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type account_type NOT NULL,
    sub_type TEXT,
    balance DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    parent_account UUID REFERENCES accounts(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create journal_entries table
CREATE TABLE journal_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    account_id UUID REFERENCES accounts(id),
    debit DECIMAL(10,2),
    credit DECIMAL(10,2),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bank_accounts table
CREATE TABLE bank_accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    account_name TEXT NOT NULL,
    account_number TEXT UNIQUE NOT NULL,
    bank_name TEXT NOT NULL,
    routing_number TEXT,
    account_type bank_account_type NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create employee_documents table
CREATE TABLE employee_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type document_type NOT NULL,
    name TEXT NOT NULL,
    upload_date TIMESTAMPTZ DEFAULT NOW(),
    file_url TEXT NOT NULL,
    is_confidential BOOLEAN DEFAULT false
);

-- Create departments table
CREATE TABLE departments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    manager_id UUID REFERENCES profiles(id),
    budget DECIMAL(10,2),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create maintenance_schedules table
CREATE TABLE maintenance_schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vehicle_id UUID,
    task_type TEXT NOT NULL,
    interval_type TEXT NOT NULL,
    interval_value INTEGER,
    description TEXT,
    estimated_cost DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to existing tables
DO $$ BEGIN
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS total_value DECIMAL(10,2) DEFAULT 0;
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_contact TIMESTAMPTZ;
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'individual';
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS contact_person TEXT;
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS credit_limit DECIMAL(10,2) DEFAULT 0;
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS payment_terms TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create indexes if they don't exist
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
    CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
    CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
    CREATE INDEX IF NOT EXISTS idx_inventory_sku ON inventory_items(sku);
    CREATE INDEX IF NOT EXISTS idx_estimates_status ON estimates(status);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create or replace functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers if they don't exist
DO $$ BEGIN
    DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
    CREATE TRIGGER update_profiles_updated_at
        BEFORE UPDATE ON profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
    CREATE TRIGGER update_customers_updated_at
        BEFORE UPDATE ON customers
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
    CREATE TRIGGER update_jobs_updated_at
        BEFORE UPDATE ON jobs
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_estimates_updated_at ON estimates;
    CREATE TRIGGER update_estimates_updated_at
        BEFORE UPDATE ON estimates
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_inventory_items_updated_at ON inventory_items;
    CREATE TRIGGER update_inventory_items_updated_at
        BEFORE UPDATE ON inventory_items
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
    CREATE TRIGGER update_invoices_updated_at
        BEFORE UPDATE ON invoices
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
    CREATE TRIGGER update_accounts_updated_at
        BEFORE UPDATE ON accounts
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_bank_accounts_updated_at ON bank_accounts;
    CREATE TRIGGER update_bank_accounts_updated_at
        BEFORE UPDATE ON bank_accounts
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_departments_updated_at ON departments;
    CREATE TRIGGER update_departments_updated_at
        BEFORE UPDATE ON departments
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN undefined_table THEN null;
END $$;

-- Enable RLS on tables if not already enabled
DO $$ BEGIN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
    ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
    ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
    ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
    ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
    ALTER TABLE employee_documents ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN undefined_table THEN null;
END $$;

-- Create or replace RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id); 