-- Enable necessary extensions
SET ROLE postgres;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create auth schema
CREATE SCHEMA IF NOT EXISTS auth;

-- Create public schema tables
CREATE TABLE IF NOT EXISTS public.todas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    center_latitude DOUBLE PRECISION NOT NULL,
    center_longitude DOUBLE PRECISION NOT NULL,
    radius DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    toda_id UUID REFERENCES public.todas(id),
    status VARCHAR(50) DEFAULT 'offline',
    current_latitude DOUBLE PRECISION,
    current_longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    passenger_id UUID NOT NULL,
    driver_id UUID REFERENCES public.drivers(id),
    pickup_latitude DOUBLE PRECISION NOT NULL,
    pickup_longitude DOUBLE PRECISION NOT NULL,
    dropoff_latitude DOUBLE PRECISION NOT NULL,
    dropoff_longitude DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_todas_latitude ON public.todas(center_latitude);
CREATE INDEX IF NOT EXISTS idx_todas_longitude ON public.todas(center_longitude);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON public.drivers(status);
CREATE INDEX IF NOT EXISTS idx_rides_status ON public.rides(status);

-- Create or replace function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_todas_updated_at
    BEFORE UPDATE ON public.todas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at
    BEFORE UPDATE ON public.drivers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rides_updated_at
    BEFORE UPDATE ON public.rides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample TODA data
INSERT INTO public.todas (name, area, center_latitude, center_longitude, radius)
VALUES
    ('PETHTODA', 'BF Executive, Almanza Uno', 14.4521, 120.9845, 1.0),
    ('BFATODA', 'BF Almanza, Almanza Dos', 14.4489, 120.9867, 1.0),
    ('MDVPTODA', 'Manila Doctors, Almanza Uno', 14.4512, 120.9834, 1.0),
    ('MSTODA', 'Metrocor Subdivision, Almanza Uno', 14.4534, 120.9856, 1.0),
    ('TSCTODA', 'TS Cruz Subdivision, Almanza Dos', 14.4501, 120.9878, 1.0),
    ('ZOLIVIMATODA', 'DBP Village, Almanza Uno', 14.4545, 120.9823, 1.0)
ON CONFLICT DO NOTHING; 