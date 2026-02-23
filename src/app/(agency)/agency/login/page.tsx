'use client';

import React, { useState, useCallback, FormEvent, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  IdCard,
  Car,
  FileText,
  HeartPulse,
  Users,
  Monitor,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCountry } from '@/lib/contexts/CountryContext';
import { cn } from '@/lib/utils/cn';

// ─── Agency icon mapping ─────────────────────────────────────────────────────

const agencyIcons: Record<string, LucideIcon> = {
  identity: IdCard,
  vehicles: Car,
  tax: FileText,
  health: HeartPulse,
  socialServices: Users,
  technology: Monitor,
};

const agencyIconBg: Record<string, string> = {
  identity: 'from-blue-500 to-blue-600',
  vehicles: 'from-emerald-500 to-emerald-600',
  tax: 'from-amber-500 to-amber-600',
  health: 'from-rose-500 to-rose-600',
  socialServices: 'from-purple-500 to-purple-600',
  technology: 'from-cyan-500 to-cyan-600',
};

// ─── Validation helpers ──────────────────────────────────────────────────────

function validateEmail(value: string): string | null {
  if (!value.trim()) return 'El correo institucional es requerido';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'El formato del correo no es valido';
  return null;
}

function validatePassword(value: string): string | null {
  if (!value) return 'La contrasena es requerida';
  if (value.length < 6) return 'La contrasena debe tener al menos 6 caracteres';
  return null;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AgencyLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>}>
      <AgencyLoginContent />
    </Suspense>
  );
}

function AgencyLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { country } = useCountry();

  // Get agency from query param, default to 'identity'
  const agencyKey = searchParams.get('agency') || 'identity';
  const agency = country.agencies[agencyKey] || country.agencies['identity'];
  const AgencyIcon = agencyIcons[agencyKey] || agencyIcons['identity'] || Monitor;
  const iconGradient = agencyIconBg[agencyKey] || agencyIconBg['identity'] || 'from-gray-500 to-gray-600';

  // Memoize resolved agency key for redirect
  const resolvedAgencyKey = useMemo(() => {
    return country.agencies[agencyKey] ? agencyKey : 'identity';
  }, [agencyKey, country.agencies]);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberSession, setRememberSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error state
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Validate fields
      const emailError = validateEmail(email);
      const passwordError = validatePassword(password);

      if (emailError || passwordError) {
        setErrors({
          email: emailError ?? undefined,
          password: passwordError ?? undefined,
        });
        return;
      }

      // Mock auth: require .gov.co domain and password >= 6
      if (!email.endsWith('.gov.co')) {
        setErrors({
          general: 'Solo se permite acceso con correos institucionales (.gov.co)',
        });
        return;
      }

      setErrors({});
      setIsLoading(true);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      try {
        // Store auth data in localStorage
        const authData = {
          email,
          agencyKey: resolvedAgencyKey,
          agencyName: agency?.shortName || 'Agencia',
          loginTime: new Date().toISOString(),
          rememberSession,
        };
        localStorage.setItem('agency-auth', JSON.stringify(authData));

        // Set cookie for middleware auth checks
        document.cookie = `agency-token=${btoa(email + ':' + resolvedAgencyKey)}; path=/; max-age=${rememberSession ? 86400 * 30 : 86400}; SameSite=Lax`;

        // Redirect to agency dashboard
        router.push(`/agency/${resolvedAgencyKey}/dashboard`);
      } catch {
        setErrors({ general: 'Error al iniciar sesion. Intente nuevamente.' });
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, rememberSession, resolvedAgencyKey, agency, router]
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* ─── Top gradient accent with country colors ──────────── */}
      <div
        className="h-2 w-full"
        style={{
          background: `linear-gradient(90deg, ${country.colors.primary} 0%, ${country.colors.primary} 50%, ${country.colors.secondary} 50%, ${country.colors.secondary} 75%, ${country.colors.accent} 75%, ${country.colors.accent} 100%)`,
        }}
      />

      {/* ─── Main content ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Agency logo/icon area */}
        <div className="text-center mb-8 animate-fade-in">
          <div
            className={cn(
              'w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center',
              'bg-gradient-to-br shadow-lg',
              iconGradient
            )}
          >
            <AgencyIcon size={40} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
            Acceso Funcionarios
          </h1>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-1">
            Portal de {agency?.shortName || 'Agencia'}
          </p>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4 animate-slide-up"
          noValidate
        >
          {/* General error */}
          {errors.general && (
            <div className="bg-colombia-red/10 border border-colombia-red/30 rounded-lg p-3 text-center">
              <p className="text-sm text-colombia-red font-medium">{errors.general}</p>
            </div>
          )}

          {/* Email input */}
          <Input
            label="Correo institucional"
            type="email"
            placeholder="usuario@entidad.gov.co"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
            }}
            error={errors.email}
            leftIcon={Mail}
            inputSize="lg"
            autoComplete="email"
            autoFocus
          />

          {/* Password input */}
          <Input
            label="Contrasena"
            type="password"
            placeholder="Tu contrasena"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            inputSize="lg"
            autoComplete="current-password"
          />

          {/* Remember session checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember-session"
              checked={rememberSession}
              onChange={(e) => setRememberSession(e.target.checked)}
              className={cn(
                'w-4 h-4 rounded border-gray-300 dark:border-gray-600',
                'text-colombia-blue dark:text-colombia-yellow',
                'focus:ring-colombia-blue dark:focus:ring-colombia-yellow',
                'focus:ring-2 focus:ring-offset-0',
                'cursor-pointer'
              )}
            />
            <label
              htmlFor="remember-session"
              className="text-sm text-text-secondary dark:text-text-secondary-dark cursor-pointer select-none"
            >
              Recordar sesion
            </label>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            leftIcon={Lock}
          >
            Ingresar
          </Button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
          </div>

          {/* Back to portal link */}
          <Link
            href="/agency"
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2',
              'border-gray-200 dark:border-gray-700',
              'hover:border-colombia-blue dark:hover:border-colombia-yellow',
              'hover:bg-surface dark:hover:bg-surface-dark',
              'transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-colombia-blue focus-visible:ring-offset-2',
              'text-sm font-medium text-text-primary dark:text-text-primary-dark'
            )}
          >
            <ArrowLeft size={16} />
            Volver al portal
          </Link>
        </form>
      </div>
    </div>
  );
}
