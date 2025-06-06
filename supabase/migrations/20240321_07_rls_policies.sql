-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_items ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Create policies for customers
CREATE POLICY "Authenticated users can view customers"
    ON customers FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can modify customers"
    ON customers FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create policies for jobs
CREATE POLICY "Authenticated users can view jobs"
    ON jobs FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins and managers can modify jobs"
    ON jobs FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'manager')
        )
    );

-- Create policies for invoices
CREATE POLICY "Authenticated users can view invoices"
    ON invoices FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can modify invoices"
    ON invoices FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create policies for inventory
CREATE POLICY "Authenticated users can view inventory"
    ON inventory_items FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins and managers can modify inventory"
    ON inventory_items FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'manager')
        )
    );

-- Create policies for maintenance
CREATE POLICY "Authenticated users can view maintenance items"
    ON maintenance_items FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins and managers can modify maintenance items"
    ON maintenance_items FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'manager')
        )
    ); 