-- Create maintenance_items table
CREATE TABLE IF NOT EXISTS maintenance_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create maintenance_schedules table
CREATE TABLE IF NOT EXISTS maintenance_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_item_id UUID REFERENCES maintenance_items(id),
    frequency TEXT NOT NULL,
    last_performed DATE,
    next_due_date DATE,
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create maintenance_logs table
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_item_id UUID REFERENCES maintenance_items(id),
    performed_by UUID REFERENCES profiles(id),
    performed_date DATE NOT NULL,
    description TEXT,
    cost DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create maintenance_notifications table
CREATE TABLE IF NOT EXISTS maintenance_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_schedule_id UUID REFERENCES maintenance_schedules(id),
    notification_date DATE NOT NULL,
    status TEXT DEFAULT 'pending',
    sent_to UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
); 