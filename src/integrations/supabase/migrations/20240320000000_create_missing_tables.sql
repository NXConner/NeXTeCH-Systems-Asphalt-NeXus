-- Create geofences table
CREATE TABLE IF NOT EXISTS public.geofences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    geometry GEOMETRY(POLYGON, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create layers table
CREATE TABLE IF NOT EXISTS public.layers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Add RLS policies
ALTER TABLE public.geofences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.layers ENABLE ROW LEVEL SECURITY;

-- Create policies for geofences
CREATE POLICY "Enable read access for all users" ON public.geofences
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.geofences
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.geofences
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.geofences
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for layers
CREATE POLICY "Enable read access for all users" ON public.layers
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.layers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.layers
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.layers
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_geofences_geometry ON public.geofences USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_geofences_created_by ON public.geofences(created_by);
CREATE INDEX IF NOT EXISTS idx_layers_type ON public.layers(type);
CREATE INDEX IF NOT EXISTS idx_layers_created_by ON public.layers(created_by); 