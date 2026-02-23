-- ============================================================
-- Colombia Digital Wallet - Initial Database Schema
-- ============================================================
-- This migration creates all core tables for the digital wallet
-- platform, including citizen profiles, digital documents,
-- vehicles, health records, vaccinations, family members,
-- social services, work/tax records, appointments,
-- verification logs, admin users, and notifications.
-- ============================================================

-- Citizens table (extends Supabase auth.users)
CREATE TABLE public.citizens (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('CC', 'CE', 'TI', 'PP', 'NIT')),
  document_number TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('M', 'F', 'O')),
  blood_type TEXT,
  photo_url TEXT,
  phone TEXT,
  email TEXT,
  address JSONB,
  city TEXT,
  department TEXT,
  country_id TEXT NOT NULL DEFAULT 'CO',
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMPTZ,
  biometric_enrolled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Digital Documents
CREATE TABLE public.digital_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES public.citizens(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_number TEXT NOT NULL,
  issuing_authority TEXT NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'revoked')),
  front_image_url TEXT,
  back_image_url TEXT,
  qr_code_data TEXT,
  qr_code_hash TEXT,
  digital_signature TEXT,
  metadata JSONB DEFAULT '{}',
  offline_cached BOOLEAN DEFAULT FALSE,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(citizen_id, document_type, document_number)
);

-- Vehicles (RUNT integration)
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES public.citizens(id) ON DELETE CASCADE,
  plate_number TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  year INTEGER,
  color TEXT,
  vin TEXT,
  engine_number TEXT,
  registration_number TEXT,
  registration_authority TEXT DEFAULT 'RUNT',
  registration_date DATE,
  registration_expiry DATE,
  soat_number TEXT,
  soat_expiry DATE,
  technomechanical_number TEXT,
  technomechanical_expiry DATE,
  insurance_company TEXT,
  insurance_policy TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health Records
CREATE TABLE public.health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES public.citizens(id) ON DELETE CASCADE,
  regime TEXT CHECK (regime IN ('Contributivo', 'Subsidiado', 'Especial')),
  eps_name TEXT,
  eps_affiliation_number TEXT,
  ips_name TEXT,
  blood_type TEXT,
  allergies TEXT[],
  chronic_conditions TEXT[],
  disability_status TEXT,
  sisben_score NUMERIC,
  sisben_group TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vaccinations
CREATE TABLE public.vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES public.citizens(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  dose_number INTEGER DEFAULT 1,
  application_date DATE NOT NULL,
  lot_number TEXT,
  manufacturer TEXT,
  application_site TEXT,
  healthcare_provider TEXT,
  next_dose_date DATE,
  certificate_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Family Members (linked accounts)
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_citizen_id UUID NOT NULL REFERENCES public.citizens(id) ON DELETE CASCADE,
  child_citizen_id UUID REFERENCES public.citizens(id),
  relationship TEXT NOT NULL CHECK (relationship IN ('child', 'spouse', 'parent', 'guardian', 'dependent')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  document_type TEXT,
  document_number TEXT,
  date_of_birth DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social Programs / Services
CREATE TABLE public.citizen_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES public.citizens(id) ON DELETE CASCADE,
  program_id TEXT NOT NULL,
  program_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'completed')),
  enrollment_date DATE,
  next_payment_date DATE,
  last_payment_amount NUMERIC,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work / Tax records
CREATE TABLE public.work_tax_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES public.citizens(id) ON DELETE CASCADE,
  rut_number TEXT,
  nit TEXT,
  tax_regime TEXT,
  economic_activity TEXT,
  employer_name TEXT,
  employer_nit TEXT,
  employment_type TEXT CHECK (employment_type IN ('employed', 'independent', 'unemployed', 'retired', 'student')),
  pila_number TEXT,
  pension_fund TEXT,
  arl_name TEXT,
  cesantias_fund TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES public.citizens(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  agency TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  confirmation_code TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- QR Verification Log
CREATE TABLE public.verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.digital_documents(id),
  citizen_id UUID REFERENCES public.citizens(id),
  verified_by TEXT,
  verification_method TEXT NOT NULL CHECK (verification_method IN ('qr_scan', 'manual', 'api')),
  verification_result TEXT NOT NULL CHECK (verification_result IN ('valid', 'invalid', 'expired', 'revoked')),
  ip_address TEXT,
  location JSONB,
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'operator', 'viewer')),
  agency TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES public.citizens(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error', 'reminder')),
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_citizens_document ON public.citizens(document_type, document_number);
CREATE INDEX idx_citizens_country ON public.citizens(country_id);
CREATE INDEX idx_documents_citizen ON public.digital_documents(citizen_id);
CREATE INDEX idx_documents_type ON public.digital_documents(document_type);
CREATE INDEX idx_vehicles_citizen ON public.vehicles(citizen_id);
CREATE INDEX idx_vehicles_plate ON public.vehicles(plate_number);
CREATE INDEX idx_health_citizen ON public.health_records(citizen_id);
CREATE INDEX idx_vaccinations_citizen ON public.vaccinations(citizen_id);
CREATE INDEX idx_family_parent ON public.family_members(parent_citizen_id);
CREATE INDEX idx_services_citizen ON public.citizen_services(citizen_id);
CREATE INDEX idx_work_tax_citizen ON public.work_tax_records(citizen_id);
CREATE INDEX idx_appointments_citizen ON public.appointments(citizen_id);
CREATE INDEX idx_notifications_citizen ON public.notifications(citizen_id);
CREATE INDEX idx_verification_logs_document ON public.verification_logs(document_id);

-- ============================================================
-- Updated_at triggers
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER citizens_updated_at BEFORE UPDATE ON public.citizens FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER documents_updated_at BEFORE UPDATE ON public.digital_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER health_updated_at BEFORE UPDATE ON public.health_records FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.citizen_services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER work_tax_updated_at BEFORE UPDATE ON public.work_tax_records FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER admin_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
