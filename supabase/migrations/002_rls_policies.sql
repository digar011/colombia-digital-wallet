-- ============================================================
-- Colombia Digital Wallet - Row Level Security Policies
-- ============================================================
-- This migration enables RLS on all tables and creates policies
-- ensuring citizens can only access their own data, while admin
-- users have broader access based on their role.
-- ============================================================

-- ============================================================
-- Helper function: Check if current user is an admin
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin', 'operator', 'viewer')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Get current admin role
CREATE OR REPLACE FUNCTION public.get_admin_role()
RETURNS TEXT AS $$
DECLARE
  admin_role TEXT;
BEGIN
  SELECT role INTO admin_role
  FROM public.admin_users
  WHERE id = auth.uid();
  RETURN admin_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if current user is a super_admin or admin
CREATE OR REPLACE FUNCTION public.is_admin_or_above()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if current user is a super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Enable RLS on all tables
-- ============================================================
ALTER TABLE public.citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_tax_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CITIZENS table policies
-- ============================================================

-- Citizens can read their own profile
CREATE POLICY "citizens_select_own"
  ON public.citizens FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Citizens can update their own profile
CREATE POLICY "citizens_update_own"
  ON public.citizens FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Citizens can insert their own profile (during registration)
CREATE POLICY "citizens_insert_own"
  ON public.citizens FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Admins (admin and above) can read all citizen profiles
CREATE POLICY "citizens_admin_select"
  ON public.citizens FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Super admins and admins can update any citizen profile
CREATE POLICY "citizens_admin_update"
  ON public.citizens FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_above())
  WITH CHECK (public.is_admin_or_above());

-- ============================================================
-- DIGITAL_DOCUMENTS table policies
-- ============================================================

-- Citizens can read their own documents
CREATE POLICY "documents_select_own"
  ON public.digital_documents FOR SELECT
  TO authenticated
  USING (citizen_id = auth.uid());

-- Citizens can insert their own documents
CREATE POLICY "documents_insert_own"
  ON public.digital_documents FOR INSERT
  TO authenticated
  WITH CHECK (citizen_id = auth.uid());

-- Citizens can update their own documents
CREATE POLICY "documents_update_own"
  ON public.digital_documents FOR UPDATE
  TO authenticated
  USING (citizen_id = auth.uid())
  WITH CHECK (citizen_id = auth.uid());

-- Citizens can delete their own documents
CREATE POLICY "documents_delete_own"
  ON public.digital_documents FOR DELETE
  TO authenticated
  USING (citizen_id = auth.uid());

-- Admins can read all documents
CREATE POLICY "documents_admin_select"
  ON public.digital_documents FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admins and above can manage documents
CREATE POLICY "documents_admin_update"
  ON public.digital_documents FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_above())
  WITH CHECK (public.is_admin_or_above());

-- ============================================================
-- VEHICLES table policies
-- ============================================================

-- Citizens can read their own vehicles
CREATE POLICY "vehicles_select_own"
  ON public.vehicles FOR SELECT
  TO authenticated
  USING (citizen_id = auth.uid());

-- Citizens can insert their own vehicles
CREATE POLICY "vehicles_insert_own"
  ON public.vehicles FOR INSERT
  TO authenticated
  WITH CHECK (citizen_id = auth.uid());

-- Citizens can update their own vehicles
CREATE POLICY "vehicles_update_own"
  ON public.vehicles FOR UPDATE
  TO authenticated
  USING (citizen_id = auth.uid())
  WITH CHECK (citizen_id = auth.uid());

-- Citizens can delete their own vehicles
CREATE POLICY "vehicles_delete_own"
  ON public.vehicles FOR DELETE
  TO authenticated
  USING (citizen_id = auth.uid());

-- Admins can read all vehicles
CREATE POLICY "vehicles_admin_select"
  ON public.vehicles FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- HEALTH_RECORDS table policies
-- ============================================================

-- Citizens can read their own health records
CREATE POLICY "health_select_own"
  ON public.health_records FOR SELECT
  TO authenticated
  USING (citizen_id = auth.uid());

-- Citizens can insert their own health records
CREATE POLICY "health_insert_own"
  ON public.health_records FOR INSERT
  TO authenticated
  WITH CHECK (citizen_id = auth.uid());

-- Citizens can update their own health records
CREATE POLICY "health_update_own"
  ON public.health_records FOR UPDATE
  TO authenticated
  USING (citizen_id = auth.uid())
  WITH CHECK (citizen_id = auth.uid());

-- Admins can read all health records
CREATE POLICY "health_admin_select"
  ON public.health_records FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- VACCINATIONS table policies
-- ============================================================

-- Citizens can read their own vaccinations
CREATE POLICY "vaccinations_select_own"
  ON public.vaccinations FOR SELECT
  TO authenticated
  USING (citizen_id = auth.uid());

-- Citizens can insert their own vaccinations
CREATE POLICY "vaccinations_insert_own"
  ON public.vaccinations FOR INSERT
  TO authenticated
  WITH CHECK (citizen_id = auth.uid());

-- Admins can read all vaccinations
CREATE POLICY "vaccinations_admin_select"
  ON public.vaccinations FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admins and above can insert vaccinations for any citizen
CREATE POLICY "vaccinations_admin_insert"
  ON public.vaccinations FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_above());

-- ============================================================
-- FAMILY_MEMBERS table policies
-- ============================================================

-- Citizens can read their own family members
CREATE POLICY "family_select_own"
  ON public.family_members FOR SELECT
  TO authenticated
  USING (parent_citizen_id = auth.uid());

-- Citizens can insert their own family members
CREATE POLICY "family_insert_own"
  ON public.family_members FOR INSERT
  TO authenticated
  WITH CHECK (parent_citizen_id = auth.uid());

-- Citizens can update their own family members
CREATE POLICY "family_update_own"
  ON public.family_members FOR UPDATE
  TO authenticated
  USING (parent_citizen_id = auth.uid())
  WITH CHECK (parent_citizen_id = auth.uid());

-- Citizens can delete their own family members
CREATE POLICY "family_delete_own"
  ON public.family_members FOR DELETE
  TO authenticated
  USING (parent_citizen_id = auth.uid());

-- Admins can read all family members
CREATE POLICY "family_admin_select"
  ON public.family_members FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- CITIZEN_SERVICES table policies
-- ============================================================

-- Citizens can read their own services
CREATE POLICY "services_select_own"
  ON public.citizen_services FOR SELECT
  TO authenticated
  USING (citizen_id = auth.uid());

-- Citizens can insert their own service enrollments
CREATE POLICY "services_insert_own"
  ON public.citizen_services FOR INSERT
  TO authenticated
  WITH CHECK (citizen_id = auth.uid());

-- Citizens can update their own services
CREATE POLICY "services_update_own"
  ON public.citizen_services FOR UPDATE
  TO authenticated
  USING (citizen_id = auth.uid())
  WITH CHECK (citizen_id = auth.uid());

-- Admins can read all services
CREATE POLICY "services_admin_select"
  ON public.citizen_services FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admins and above can manage services for any citizen
CREATE POLICY "services_admin_all"
  ON public.citizen_services FOR ALL
  TO authenticated
  USING (public.is_admin_or_above())
  WITH CHECK (public.is_admin_or_above());

-- ============================================================
-- WORK_TAX_RECORDS table policies
-- ============================================================

-- Citizens can read their own work/tax records
CREATE POLICY "work_tax_select_own"
  ON public.work_tax_records FOR SELECT
  TO authenticated
  USING (citizen_id = auth.uid());

-- Citizens can insert their own work/tax records
CREATE POLICY "work_tax_insert_own"
  ON public.work_tax_records FOR INSERT
  TO authenticated
  WITH CHECK (citizen_id = auth.uid());

-- Citizens can update their own work/tax records
CREATE POLICY "work_tax_update_own"
  ON public.work_tax_records FOR UPDATE
  TO authenticated
  USING (citizen_id = auth.uid())
  WITH CHECK (citizen_id = auth.uid());

-- Admins can read all work/tax records
CREATE POLICY "work_tax_admin_select"
  ON public.work_tax_records FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- APPOINTMENTS table policies
-- ============================================================

-- Citizens can read their own appointments
CREATE POLICY "appointments_select_own"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (citizen_id = auth.uid());

-- Citizens can insert their own appointments
CREATE POLICY "appointments_insert_own"
  ON public.appointments FOR INSERT
  TO authenticated
  WITH CHECK (citizen_id = auth.uid());

-- Citizens can update their own appointments (e.g. cancel)
CREATE POLICY "appointments_update_own"
  ON public.appointments FOR UPDATE
  TO authenticated
  USING (citizen_id = auth.uid())
  WITH CHECK (citizen_id = auth.uid());

-- Admins can read all appointments
CREATE POLICY "appointments_admin_select"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admins and above can manage appointments for any citizen
CREATE POLICY "appointments_admin_all"
  ON public.appointments FOR ALL
  TO authenticated
  USING (public.is_admin_or_above())
  WITH CHECK (public.is_admin_or_above());

-- ============================================================
-- VERIFICATION_LOGS table policies
-- ============================================================

-- Any authenticated user can insert a verification log (when scanning QR)
CREATE POLICY "verification_logs_insert_authenticated"
  ON public.verification_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Citizens can read verification logs for their own documents
CREATE POLICY "verification_logs_select_own"
  ON public.verification_logs FOR SELECT
  TO authenticated
  USING (citizen_id = auth.uid());

-- Admins can read all verification logs
CREATE POLICY "verification_logs_admin_select"
  ON public.verification_logs FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- ADMIN_USERS table policies
-- ============================================================

-- Admins can read their own admin record
CREATE POLICY "admin_users_select_own"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Super admins can read all admin records
CREATE POLICY "admin_users_super_select"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (public.is_super_admin());

-- Super admins can insert new admin records
CREATE POLICY "admin_users_super_insert"
  ON public.admin_users FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin());

-- Super admins can update admin records
CREATE POLICY "admin_users_super_update"
  ON public.admin_users FOR UPDATE
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Super admins can delete admin records
CREATE POLICY "admin_users_super_delete"
  ON public.admin_users FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ============================================================
-- NOTIFICATIONS table policies
-- ============================================================

-- Citizens can read their own notifications
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (citizen_id = auth.uid());

-- Citizens can update their own notifications (mark as read)
CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (citizen_id = auth.uid())
  WITH CHECK (citizen_id = auth.uid());

-- Citizens can delete their own notifications
CREATE POLICY "notifications_delete_own"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (citizen_id = auth.uid());

-- Admins can read all notifications
CREATE POLICY "notifications_admin_select"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admins and above can insert notifications for any citizen
CREATE POLICY "notifications_admin_insert"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_above());

-- Service role (server-side) can insert notifications for system events
CREATE POLICY "notifications_service_insert"
  ON public.notifications FOR INSERT
  TO service_role
  WITH CHECK (true);
