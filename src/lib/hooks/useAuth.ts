'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

export type DocumentType = 'CC' | 'CE' | 'TI' | 'PP';
export type Gender = 'M' | 'F' | 'O';

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName: string;
  documentType: DocumentType;
  documentNumber: string;
  dateOfBirth: string;
  gender: Gender;
  department: string;
  city: string;
  address: string;
  verified: boolean;
  createdAt: string;
}

export interface RegisterData {
  // Step 1 - Personal Info
  documentType: DocumentType;
  documentNumber: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName: string;
  dateOfBirth: string;
  gender: Gender;
  // Step 2 - Contact
  email: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  // Step 3 - Security
  password: string;
  pin: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
}

// ─── Storage keys ───────────────────────────────────────────────────────────

const AUTH_STORAGE_KEY = 'digital-wallet-auth';
const USER_STORAGE_KEY = 'digital-wallet-user';

// ─── Demo mock user ─────────────────────────────────────────────────────────

const DEMO_USER: UserProfile = {
  id: 'demo-user-001',
  email: 'juan.perez@correo.co',
  phone: '+573001234567',
  firstName: 'Juan',
  secondName: 'Carlos',
  firstLastName: 'Perez',
  secondLastName: 'Garcia',
  documentType: 'CC',
  documentNumber: '1234567890',
  dateOfBirth: '1990-05-15',
  gender: 'M',
  department: 'Cundinamarca',
  city: 'Bogota',
  address: 'Calle 123 # 45-67',
  verified: true,
  createdAt: new Date().toISOString(),
};

// ─── Test accounts ──────────────────────────────────────────────────────────

const TEST_ACCOUNTS: Record<string, { password: string; profile: UserProfile }> = {
  admin123: {
    password: 'Test123!',
    profile: {
      id: 'admin-test-001',
      email: 'admin123@test.gov.co',
      phone: '+573009876543',
      firstName: 'Admin',
      secondName: undefined,
      firstLastName: 'Test',
      secondLastName: 'User',
      documentType: 'CC',
      documentNumber: '9876543210',
      dateOfBirth: '1985-01-15',
      gender: 'M',
      department: 'Cundinamarca',
      city: 'Bogota',
      address: 'Carrera 7 # 32-16, Edificio Gobierno',
      verified: true,
      createdAt: new Date().toISOString(),
    },
  },
};

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const authToken = localStorage.getItem(AUTH_STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (authToken && storedUser) {
        const user = JSON.parse(storedUser) as UserProfile;
        setState({
          isAuthenticated: true,
          isLoading: false,
          user,
        });
        // Set cookie for middleware
        document.cookie = `auth-token=${authToken}; path=/; max-age=86400; SameSite=Lax`;
      } else {
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
      }
    } catch {
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  }, []);

  const login = useCallback(
    async (emailOrPhone: string, password: string): Promise<{ success: boolean; error?: string }> => {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Demo validation: accept any non-empty credentials
      if (!emailOrPhone.trim() || !password.trim()) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: 'Credenciales requeridas' };
      }

      // Check test accounts first
      const testAccount = TEST_ACCOUNTS[emailOrPhone.trim()];
      if (testAccount) {
        if (password !== testAccount.password) {
          setState((prev) => ({ ...prev, isLoading: false }));
          return { success: false, error: 'Contrasena incorrecta' };
        }
        const user = testAccount.profile;
        const token = `test-token-${Date.now()}`;
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, token);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=Lax`;
        } catch {
          // Storage unavailable
        }
        setState({ isAuthenticated: true, isLoading: false, user });
        return { success: true };
      }

      if (password.length < 6) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: 'La contrasena debe tener al menos 6 caracteres' };
      }

      // Build user from input for demo
      const user: UserProfile = {
        ...DEMO_USER,
        email: emailOrPhone.includes('@') ? emailOrPhone : DEMO_USER.email,
        phone: !emailOrPhone.includes('@') ? emailOrPhone : DEMO_USER.phone,
      };

      const token = `demo-token-${Date.now()}`;

      try {
        localStorage.setItem(AUTH_STORAGE_KEY, token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=Lax`;
      } catch {
        // Storage unavailable
      }

      setState({
        isAuthenticated: true,
        isLoading: false,
        user,
      });

      return { success: true };
    },
    []
  );

  const register = useCallback(
    async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const user: UserProfile = {
        id: `user-${Date.now()}`,
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        secondName: data.secondName,
        firstLastName: data.firstLastName,
        secondLastName: data.secondLastName,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        department: data.department,
        city: data.city,
        address: data.address,
        verified: false,
        createdAt: new Date().toISOString(),
      };

      const token = `demo-token-${Date.now()}`;

      try {
        localStorage.setItem(AUTH_STORAGE_KEY, token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=Lax`;
      } catch {
        // Storage unavailable
      }

      setState({
        isAuthenticated: true,
        isLoading: false,
        user,
      });

      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax';
    } catch {
      // Storage unavailable
    }

    setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
  }, []);

  const verifyOtp = useCallback(
    async (code: string): Promise<{ success: boolean; error?: string }> => {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Demo: any 6-digit code works
      if (code.length !== 6 || !/^\d{6}$/.test(code)) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: 'El codigo debe tener 6 digitos' };
      }

      // Mark user as verified
      if (state.user) {
        const verifiedUser = { ...state.user, verified: true };
        try {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(verifiedUser));
        } catch {
          // Storage unavailable
        }
        setState((prev) => ({
          ...prev,
          isLoading: false,
          user: verifiedUser,
        }));
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }

      return { success: true };
    },
    [state.user]
  );

  return {
    ...state,
    login,
    register,
    logout,
    verifyOtp,
  };
}
