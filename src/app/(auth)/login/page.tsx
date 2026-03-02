'use client';

import React, { useState, useCallback, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Phone,
  Fingerprint,
  ScanFace,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCountry } from '@/lib/contexts/CountryContext';
import { useAuthContext } from '@/lib/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';
import { loginSchema } from '@/lib/validations/auth';
import type { CountryId } from '@/config';

// ─── Validation helpers ─────────────────────────────────────────────────────

// Known test account usernames that bypass email/phone validation
const TEST_USERNAMES = ['admin123'];

/**
 * Validates the emailOrPhone field.
 * In email mode, delegates to the Zod loginSchema for the email field.
 * In phone mode, uses regex for Colombian phone format.
 * Always allows known test usernames.
 */
function validateEmailOrPhone(value: string, mode: 'email' | 'phone'): string | null {
  if (!value.trim()) return 'Este campo es requerido';
  // Allow test account usernames
  if (TEST_USERNAMES.includes(value.trim())) return null;

  if (mode === 'email') {
    const result = loginSchema.shape.email.safeParse(value);
    if (!result.success) {
      return result.error.issues[0]?.message ?? 'Correo no valido';
    }
    return null;
  }

  // Phone mode
  const isPhone = /^\+?\d{7,15}$/.test(value.replace(/\s/g, ''));
  if (!isPhone) return 'Ingresa un numero de telefono valido';
  return null;
}

/**
 * Validates the password field using Zod loginSchema.
 */
function validatePassword(value: string): string | null {
  const result = loginSchema.shape.password.safeParse(value);
  if (!result.success) {
    return result.error.issues[0]?.message ?? 'Contrasena no valida';
  }
  return null;
}

// ─── JSON-LD Structured Data ────────────────────────────────────────────────

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://micolombia.digital';

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: APP_URL },
    { '@type': 'ListItem', position: 2, name: 'Iniciar Sesion', item: `${APP_URL}/login` },
  ],
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const { country, allCountries, setCountry, countryId } = useCountry();
  const { login, isLoading } = useAuthContext();

  // Form state
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  // Error state
  const [errors, setErrors] = useState<{ emailOrPhone?: string; password?: string; general?: string }>({});

  // Language selector
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Input mode toggle
  const [inputMode, setInputMode] = useState<'email' | 'phone'>('email');

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Validate using Zod-backed helpers
      const emailOrPhoneError = validateEmailOrPhone(emailOrPhone, inputMode);
      const passwordError = validatePassword(password);

      if (emailOrPhoneError || passwordError) {
        setErrors({
          emailOrPhone: emailOrPhoneError ?? undefined,
          password: passwordError ?? undefined,
        });
        return;
      }

      setErrors({});

      const result = await login(emailOrPhone, password);
      if (!result.success) {
        setErrors({ general: result.error || 'Error al iniciar sesion' });
      } else {
        router.push('/dashboard');
      }
    },
    [emailOrPhone, password, inputMode, login, router]
  );

  const handleBiometricLogin = useCallback(async () => {
    // Demo: simulate biometric authentication
    setErrors({});
    const result = await login('biometric@demo.co', 'biometric-demo');
    if (result.success) {
      router.push('/dashboard');
    }
  }, [login, router]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* JSON-LD breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ─── Top gradient accent ─────────────────────────────────── */}
      <div
        className="h-2 w-full"
        style={{
          background: `linear-gradient(90deg, ${country.colors.primary} 0%, ${country.colors.primary} 50%, ${country.colors.secondary} 50%, ${country.colors.secondary} 75%, ${country.colors.accent} 75%, ${country.colors.accent} 100%)`,
        }}
      />

      {/* ─── Main content ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo and app name */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-3" role="img" aria-label={`Bandera de ${country.name}`}>
            {country.flag}
          </div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
            Mi {country.name} Digital
          </h1>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-1">
            Tu billetera digital ciudadana
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
            <div role="alert" aria-live="assertive" className="bg-colombia-red/10 border border-colombia-red/30 rounded-lg p-3 text-center">
              <p className="text-sm text-colombia-red font-medium">{errors.general}</p>
            </div>
          )}

          {/* Email / Phone toggle */}
          <div className="flex bg-surface dark:bg-surface-dark rounded-lg p-1 gap-1">
            <button
              type="button"
              onClick={() => {
                setInputMode('email');
                setEmailOrPhone('');
                setErrors({});
              }}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all duration-200',
                inputMode === 'email'
                  ? 'bg-white dark:bg-gray-800 text-colombia-blue dark:text-colombia-yellow shadow-sm'
                  : 'text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
              )}
            >
              <Mail size={16} />
              Correo
            </button>
            <button
              type="button"
              onClick={() => {
                setInputMode('phone');
                setEmailOrPhone('');
                setErrors({});
              }}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all duration-200',
                inputMode === 'phone'
                  ? 'bg-white dark:bg-gray-800 text-colombia-blue dark:text-colombia-yellow shadow-sm'
                  : 'text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
              )}
            >
              <Phone size={16} />
              Telefono
            </button>
          </div>

          {/* Email or Phone input */}
          <Input
            label={inputMode === 'email' ? 'Correo electronico' : 'Numero de telefono'}
            type={inputMode === 'email' ? 'email' : 'tel'}
            placeholder={inputMode === 'email' ? 'tu@correo.com' : '+57 300 123 4567'}
            value={emailOrPhone}
            onChange={(e) => {
              setEmailOrPhone(e.target.value);
              if (errors.emailOrPhone) setErrors((prev) => ({ ...prev, emailOrPhone: undefined }));
            }}
            error={errors.emailOrPhone}
            leftIcon={inputMode === 'email' ? Mail : Phone}
            inputSize="lg"
            autoComplete={inputMode === 'email' ? 'email' : 'tel'}
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

          {/* Forgot password */}
          <div className="text-right">
            <Link
              href="/login"
              className="text-sm text-colombia-blue dark:text-colombia-yellow hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-colombia-blue rounded"
            >
              Olvidaste tu contrasena?
            </Link>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Ingresar
          </Button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <span className="relative bg-white dark:bg-gray-900 px-4 text-sm text-text-secondary dark:text-text-secondary-dark">
              o
            </span>
          </div>

          {/* Biometric login */}
          <button
            type="button"
            onClick={handleBiometricLogin}
            disabled={isLoading}
            className={cn(
              'w-full flex items-center justify-center gap-3 py-3 rounded-lg border-2',
              'border-gray-200 dark:border-gray-700',
              'hover:border-colombia-blue dark:hover:border-colombia-yellow',
              'hover:bg-surface dark:hover:bg-surface-dark',
              'transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-colombia-blue focus-visible:ring-offset-2',
              'disabled:opacity-50 disabled:pointer-events-none'
            )}
          >
            <Fingerprint
              size={24}
              className="text-colombia-blue dark:text-colombia-yellow"
            />
            <ScanFace
              size={24}
              className="text-colombia-blue dark:text-colombia-yellow"
            />
            <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
              Ingreso biometrico
            </span>
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-text-secondary dark:text-text-secondary-dark mt-6">
            No tienes cuenta?{' '}
            <Link
              href="/register"
              className="font-semibold text-colombia-blue dark:text-colombia-yellow hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-colombia-blue rounded"
            >
              Registrate
            </Link>
          </p>
        </form>
      </div>

      {/* ─── Language selector at bottom ─────────────────────────── */}
      <div className="relative pb-6 flex justify-center">
        <button
          type="button"
          onClick={() => setShowLanguageSelector(!showLanguageSelector)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg',
            'text-sm text-text-secondary dark:text-text-secondary-dark',
            'hover:bg-surface dark:hover:bg-surface-dark',
            'transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-colombia-blue'
          )}
        >
          <Globe size={16} />
          <span>{country.flag} {country.name}</span>
          <ChevronDown
            size={14}
            className={cn('transition-transform duration-200', showLanguageSelector && 'rotate-180')}
          />
        </button>

        {showLanguageSelector && (
          <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-10 animate-slide-up">
            {allCountries.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCountry(c.id as CountryId);
                  setShowLanguageSelector(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                  'hover:bg-surface dark:hover:bg-surface-dark',
                  countryId === c.id
                    ? 'text-colombia-blue dark:text-colombia-yellow font-semibold bg-surface/50 dark:bg-surface-dark/50'
                    : 'text-text-primary dark:text-text-primary-dark'
                )}
              >
                <span className="text-xl">{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
