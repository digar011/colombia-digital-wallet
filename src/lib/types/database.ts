// ============================================================
// Colombia Digital Wallet - Supabase Database Types
// ============================================================
// Auto-generated types matching the database schema.
// Includes Tables (Row), Insert, and Update types for all tables.
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// -- Enums ---------------------------------------------------

export type DocumentType = 'CC' | 'CE' | 'TI' | 'PP' | 'NIT';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type DocumentStatus = 'active' | 'expired' | 'suspended' | 'revoked';

export type Gender = 'M' | 'F' | 'O';

export type HealthRegime = 'Contributivo' | 'Subsidiado' | 'Especial';

export type FamilyRelationship = 'child' | 'spouse' | 'parent' | 'guardian' | 'dependent';

export type ServiceStatus = 'active' | 'pending' | 'suspended' | 'completed';

export type EmploymentType = 'employed' | 'independent' | 'unemployed' | 'retired' | 'student';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export type VerificationMethod = 'qr_scan' | 'manual' | 'api';

export type VerificationResult = 'valid' | 'invalid' | 'expired' | 'revoked';

export type AdminRole = 'super_admin' | 'admin' | 'operator' | 'viewer';

export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'reminder';

// -- Address type (for citizen address JSONB) -----------------

export interface CitizenAddress {
  street?: string;
  number?: string;
  apartment?: string;
  neighborhood?: string;
  city?: string;
  department?: string;
  postal_code?: string;
  country?: string;
  additional_info?: string;
}

// -- Database interface ---------------------------------------

export interface Database {
  public: {
    Tables: {
      citizens: {
        Row: {
          id: string;
          document_type: DocumentType;
          document_number: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: Gender | null;
          blood_type: string | null;
          photo_url: string | null;
          phone: string | null;
          email: string | null;
          address: CitizenAddress | null;
          city: string | null;
          department: string | null;
          country_id: string;
          verification_status: VerificationStatus;
          verified_at: string | null;
          biometric_enrolled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          document_type: DocumentType;
          document_number: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender?: Gender | null;
          blood_type?: string | null;
          photo_url?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: CitizenAddress | null;
          city?: string | null;
          department?: string | null;
          country_id?: string;
          verification_status?: VerificationStatus;
          verified_at?: string | null;
          biometric_enrolled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          document_type?: DocumentType;
          document_number?: string;
          first_name?: string;
          last_name?: string;
          date_of_birth?: string;
          gender?: Gender | null;
          blood_type?: string | null;
          photo_url?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: CitizenAddress | null;
          city?: string | null;
          department?: string | null;
          country_id?: string;
          verification_status?: VerificationStatus;
          verified_at?: string | null;
          biometric_enrolled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'citizens_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };

      digital_documents: {
        Row: {
          id: string;
          citizen_id: string;
          document_type: string;
          document_number: string;
          issuing_authority: string;
          issue_date: string | null;
          expiry_date: string | null;
          status: DocumentStatus;
          front_image_url: string | null;
          back_image_url: string | null;
          qr_code_data: string | null;
          qr_code_hash: string | null;
          digital_signature: string | null;
          metadata: Json;
          offline_cached: boolean;
          last_synced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          citizen_id: string;
          document_type: string;
          document_number: string;
          issuing_authority: string;
          issue_date?: string | null;
          expiry_date?: string | null;
          status?: DocumentStatus;
          front_image_url?: string | null;
          back_image_url?: string | null;
          qr_code_data?: string | null;
          qr_code_hash?: string | null;
          digital_signature?: string | null;
          metadata?: Json;
          offline_cached?: boolean;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          citizen_id?: string;
          document_type?: string;
          document_number?: string;
          issuing_authority?: string;
          issue_date?: string | null;
          expiry_date?: string | null;
          status?: DocumentStatus;
          front_image_url?: string | null;
          back_image_url?: string | null;
          qr_code_data?: string | null;
          qr_code_hash?: string | null;
          digital_signature?: string | null;
          metadata?: Json;
          offline_cached?: boolean;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'digital_documents_citizen_id_fkey';
            columns: ['citizen_id'];
            isOneToOne: false;
            referencedRelation: 'citizens';
            referencedColumns: ['id'];
          },
        ];
      };

      vehicles: {
        Row: {
          id: string;
          citizen_id: string;
          plate_number: string;
          vehicle_type: string;
          brand: string | null;
          model: string | null;
          year: number | null;
          color: string | null;
          vin: string | null;
          engine_number: string | null;
          registration_number: string | null;
          registration_authority: string;
          registration_date: string | null;
          registration_expiry: string | null;
          soat_number: string | null;
          soat_expiry: string | null;
          technomechanical_number: string | null;
          technomechanical_expiry: string | null;
          insurance_company: string | null;
          insurance_policy: string | null;
          status: string;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          citizen_id: string;
          plate_number: string;
          vehicle_type: string;
          brand?: string | null;
          model?: string | null;
          year?: number | null;
          color?: string | null;
          vin?: string | null;
          engine_number?: string | null;
          registration_number?: string | null;
          registration_authority?: string;
          registration_date?: string | null;
          registration_expiry?: string | null;
          soat_number?: string | null;
          soat_expiry?: string | null;
          technomechanical_number?: string | null;
          technomechanical_expiry?: string | null;
          insurance_company?: string | null;
          insurance_policy?: string | null;
          status?: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          citizen_id?: string;
          plate_number?: string;
          vehicle_type?: string;
          brand?: string | null;
          model?: string | null;
          year?: number | null;
          color?: string | null;
          vin?: string | null;
          engine_number?: string | null;
          registration_number?: string | null;
          registration_authority?: string;
          registration_date?: string | null;
          registration_expiry?: string | null;
          soat_number?: string | null;
          soat_expiry?: string | null;
          technomechanical_number?: string | null;
          technomechanical_expiry?: string | null;
          insurance_company?: string | null;
          insurance_policy?: string | null;
          status?: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'vehicles_citizen_id_fkey';
            columns: ['citizen_id'];
            isOneToOne: false;
            referencedRelation: 'citizens';
            referencedColumns: ['id'];
          },
        ];
      };

      health_records: {
        Row: {
          id: string;
          citizen_id: string;
          regime: HealthRegime | null;
          eps_name: string | null;
          eps_affiliation_number: string | null;
          ips_name: string | null;
          blood_type: string | null;
          allergies: string[] | null;
          chronic_conditions: string[] | null;
          disability_status: string | null;
          sisben_score: number | null;
          sisben_group: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          citizen_id: string;
          regime?: HealthRegime | null;
          eps_name?: string | null;
          eps_affiliation_number?: string | null;
          ips_name?: string | null;
          blood_type?: string | null;
          allergies?: string[] | null;
          chronic_conditions?: string[] | null;
          disability_status?: string | null;
          sisben_score?: number | null;
          sisben_group?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          citizen_id?: string;
          regime?: HealthRegime | null;
          eps_name?: string | null;
          eps_affiliation_number?: string | null;
          ips_name?: string | null;
          blood_type?: string | null;
          allergies?: string[] | null;
          chronic_conditions?: string[] | null;
          disability_status?: string | null;
          sisben_score?: number | null;
          sisben_group?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'health_records_citizen_id_fkey';
            columns: ['citizen_id'];
            isOneToOne: false;
            referencedRelation: 'citizens';
            referencedColumns: ['id'];
          },
        ];
      };

      vaccinations: {
        Row: {
          id: string;
          citizen_id: string;
          vaccine_name: string;
          dose_number: number;
          application_date: string;
          lot_number: string | null;
          manufacturer: string | null;
          application_site: string | null;
          healthcare_provider: string | null;
          next_dose_date: string | null;
          certificate_url: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          citizen_id: string;
          vaccine_name: string;
          dose_number?: number;
          application_date: string;
          lot_number?: string | null;
          manufacturer?: string | null;
          application_site?: string | null;
          healthcare_provider?: string | null;
          next_dose_date?: string | null;
          certificate_url?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          citizen_id?: string;
          vaccine_name?: string;
          dose_number?: number;
          application_date?: string;
          lot_number?: string | null;
          manufacturer?: string | null;
          application_site?: string | null;
          healthcare_provider?: string | null;
          next_dose_date?: string | null;
          certificate_url?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'vaccinations_citizen_id_fkey';
            columns: ['citizen_id'];
            isOneToOne: false;
            referencedRelation: 'citizens';
            referencedColumns: ['id'];
          },
        ];
      };

      family_members: {
        Row: {
          id: string;
          parent_citizen_id: string;
          child_citizen_id: string | null;
          relationship: FamilyRelationship;
          first_name: string;
          last_name: string;
          document_type: string | null;
          document_number: string | null;
          date_of_birth: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          parent_citizen_id: string;
          child_citizen_id?: string | null;
          relationship: FamilyRelationship;
          first_name: string;
          last_name: string;
          document_type?: string | null;
          document_number?: string | null;
          date_of_birth?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          parent_citizen_id?: string;
          child_citizen_id?: string | null;
          relationship?: FamilyRelationship;
          first_name?: string;
          last_name?: string;
          document_type?: string | null;
          document_number?: string | null;
          date_of_birth?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'family_members_parent_citizen_id_fkey';
            columns: ['parent_citizen_id'];
            isOneToOne: false;
            referencedRelation: 'citizens';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'family_members_child_citizen_id_fkey';
            columns: ['child_citizen_id'];
            isOneToOne: false;
            referencedRelation: 'citizens';
            referencedColumns: ['id'];
          },
        ];
      };

      citizen_services: {
        Row: {
          id: string;
          citizen_id: string;
          program_id: string;
          program_name: string;
          status: ServiceStatus;
          enrollment_date: string | null;
          next_payment_date: string | null;
          last_payment_amount: number | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          citizen_id: string;
          program_id: string;
          program_name: string;
          status?: ServiceStatus;
          enrollment_date?: string | null;
          next_payment_date?: string | null;
          last_payment_amount?: number | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          citizen_id?: string;
          program_id?: string;
          program_name?: string;
          status?: ServiceStatus;
          enrollment_date?: string | null;
          next_payment_date?: string | null;
          last_payment_amount?: number | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'citizen_services_citizen_id_fkey';
            columns: ['citizen_id'];
            isOneToOne: false;
            referencedRelation: 'citizens';
            referencedColumns: ['id'];
          },
        ];
      };

      work_tax_records: {
        Row: {
          id: string;
          citizen_id: string;
          rut_number: string | null;
          nit: string | null;
          tax_regime: string | null;
          economic_activity: string | null;
          employer_name: string | null;
          employer_nit: string | null;
          employment_type: EmploymentType | null;
          pila_number: string | null;
          pension_fund: string | null;
          arl_name: string | null;
          cesantias_fund: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          citizen_id: string;
          rut_number?: string | null;
          nit?: string | null;
          tax_regime?: string | null;
          economic_activity?: string | null;
          employer_name?: string | null;
          employer_nit?: string | null;
          employment_type?: EmploymentType | null;
          pila_number?: string | null;
          pension_fund?: string | null;
          arl_name?: string | null;
          cesantias_fund?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          citizen_id?: string;
          rut_number?: string | null;
          nit?: string | null;
          tax_regime?: string | null;
          economic_activity?: string | null;
          employer_name?: string | null;
          employer_nit?: string | null;
          employment_type?: EmploymentType | null;
          pila_number?: string | null;
          pension_fund?: string | null;
          arl_name?: string | null;
          cesantias_fund?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'work_tax_records_citizen_id_fkey';
            columns: ['citizen_id'];
            isOneToOne: false;
            referencedRelation: 'citizens';
            referencedColumns: ['id'];
          },
        ];
      };

      appointments: {
        Row: {
          id: string;
          citizen_id: string;
          service_type: string;
          agency: string;
          title: string;
          description: string | null;
          scheduled_at: string;
          location: string | null;
          status: AppointmentStatus;
          confirmation_code: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          citizen_id: string;
          service_type: string;
          agency: string;
          title: string;
          description?: string | null;
          scheduled_at: string;
          location?: string | null;
          status?: AppointmentStatus;
          confirmation_code?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          citizen_id?: string;
          service_type?: string;
          agency?: string;
          title?: string;
          description?: string | null;
          scheduled_at?: string;
          location?: string | null;
          status?: AppointmentStatus;
          confirmation_code?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'appointments_citizen_id_fkey';
            columns: ['citizen_id'];
            isOneToOne: false;
            referencedRelation: 'citizens';
            referencedColumns: ['id'];
          },
        ];
      };

      verification_logs: {
        Row: {
          id: string;
          document_id: string | null;
          citizen_id: string | null;
          verified_by: string | null;
          verification_method: VerificationMethod;
          verification_result: VerificationResult;
          ip_address: string | null;
          location: Json | null;
          verified_at: string;
        };
        Insert: {
          id?: string;
          document_id?: string | null;
          citizen_id?: string | null;
          verified_by?: string | null;
          verification_method: VerificationMethod;
          verification_result: VerificationResult;
          ip_address?: string | null;
          location?: Json | null;
          verified_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string | null;
          citizen_id?: string | null;
          verified_by?: string | null;
          verification_method?: VerificationMethod;
          verification_result?: VerificationResult;
          ip_address?: string | null;
          location?: Json | null;
          verified_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'verification_logs_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'digital_documents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'verification_logs_citizen_id_fkey';
            columns: ['citizen_id'];
            isOneToOne: false;
            referencedRelation: 'citizens';
            referencedColumns: ['id'];
          },
        ];
      };

      admin_users: {
        Row: {
          id: string;
          role: AdminRole;
          agency: string | null;
          permissions: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: AdminRole;
          agency?: string | null;
          permissions?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: AdminRole;
          agency?: string | null;
          permissions?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'admin_users_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };

      notifications: {
        Row: {
          id: string;
          citizen_id: string;
          title: string;
          message: string;
          type: NotificationType;
          read: boolean;
          action_url: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          citizen_id: string;
          title: string;
          message: string;
          type?: NotificationType;
          read?: boolean;
          action_url?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          citizen_id?: string;
          title?: string;
          message?: string;
          type?: NotificationType;
          read?: boolean;
          action_url?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_citizen_id_fkey';
            columns: ['citizen_id'];
            isOneToOne: false;
            referencedRelation: 'citizens';
            referencedColumns: ['id'];
          },
        ];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      get_admin_role: {
        Args: Record<string, never>;
        Returns: string;
      };
      is_admin_or_above: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_super_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };

    Enums: {
      [_ in never]: never;
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// -- Convenience type aliases --------------------------------

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// -- Row type shortcuts --------------------------------------

export type Citizen = Tables<'citizens'>;
export type CitizenInsert = InsertTables<'citizens'>;
export type CitizenUpdate = UpdateTables<'citizens'>;

export type DigitalDocument = Tables<'digital_documents'>;
export type DigitalDocumentInsert = InsertTables<'digital_documents'>;
export type DigitalDocumentUpdate = UpdateTables<'digital_documents'>;

export type Vehicle = Tables<'vehicles'>;
export type VehicleInsert = InsertTables<'vehicles'>;
export type VehicleUpdate = UpdateTables<'vehicles'>;

export type HealthRecord = Tables<'health_records'>;
export type HealthRecordInsert = InsertTables<'health_records'>;
export type HealthRecordUpdate = UpdateTables<'health_records'>;

export type Vaccination = Tables<'vaccinations'>;
export type VaccinationInsert = InsertTables<'vaccinations'>;
export type VaccinationUpdate = UpdateTables<'vaccinations'>;

export type FamilyMember = Tables<'family_members'>;
export type FamilyMemberInsert = InsertTables<'family_members'>;
export type FamilyMemberUpdate = UpdateTables<'family_members'>;

export type CitizenService = Tables<'citizen_services'>;
export type CitizenServiceInsert = InsertTables<'citizen_services'>;
export type CitizenServiceUpdate = UpdateTables<'citizen_services'>;

export type WorkTaxRecord = Tables<'work_tax_records'>;
export type WorkTaxRecordInsert = InsertTables<'work_tax_records'>;
export type WorkTaxRecordUpdate = UpdateTables<'work_tax_records'>;

export type Appointment = Tables<'appointments'>;
export type AppointmentInsert = InsertTables<'appointments'>;
export type AppointmentUpdate = UpdateTables<'appointments'>;

export type VerificationLog = Tables<'verification_logs'>;
export type VerificationLogInsert = InsertTables<'verification_logs'>;
export type VerificationLogUpdate = UpdateTables<'verification_logs'>;

export type AdminUser = Tables<'admin_users'>;
export type AdminUserInsert = InsertTables<'admin_users'>;
export type AdminUserUpdate = UpdateTables<'admin_users'>;

export type Notification = Tables<'notifications'>;
export type NotificationInsert = InsertTables<'notifications'>;
export type NotificationUpdate = UpdateTables<'notifications'>;
