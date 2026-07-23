-- 001_init_schema_timescale.sql
-- Habilitar extensión TimescaleDB en PostgreSQL 16
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- 1. Tablas Estructurales Multi-Tenant
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    tax_id VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productivity_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_group_id UUID NOT NULL REFERENCES staff_groups(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profile_apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES productivity_profiles(id) ON DELETE CASCADE,
    package_name VARCHAR(255) NOT NULL,
    app_name VARCHAR(150),
    category VARCHAR(50) NOT NULL CHECK (category IN ('productive', 'neutral', 'unproductive')),
    expected_daily_minutes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    profile_id UUID REFERENCES productivity_profiles(id) ON DELETE SET NULL,
    device_name VARCHAR(100) NOT NULL,
    imei VARCHAR(100) UNIQUE,
    serial_number VARCHAR(100),
    model VARCHAR(100),
    android_version VARCHAR(50),
    battery_level INT DEFAULT 100,
    is_locked BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT FALSE,
    last_ping_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS platform_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'company_admin' CHECK (role IN ('master', 'company_admin', 'branch_supervisor', 'read_only')),
    is_two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tablas de Series de Tiempo (TimescaleDB Hypertables)

-- Telemetría de Uso de Apps
CREATE TABLE IF NOT EXISTS usage_events (
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    package_name VARCHAR(255) NOT NULL,
    app_name VARCHAR(150),
    duration_seconds INT NOT NULL,
    is_foreground BOOLEAN DEFAULT TRUE
);

-- Convertir usage_events en Hypertable de TimescaleDB particionada por tiempo (chunks de 1 día)
SELECT create_hypertable('usage_events', 'timestamp', if_not_exists => TRUE);

-- Telemetría de Coordenadas GPS
CREATE TABLE IF NOT EXISTS location_pings (
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    speed REAL,
    accuracy REAL,
    battery_level INT
);

-- Convertir location_pings en Hypertable de TimescaleDB
SELECT create_hypertable('location_pings', 'timestamp', if_not_exists => TRUE);

-- 3. Índices de Alto Rendimiento para Consultas de <10ms
CREATE INDEX IF NOT EXISTS idx_usage_events_device_time ON usage_events (device_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_location_pings_device_time ON location_pings (device_id, timestamp DESC);
