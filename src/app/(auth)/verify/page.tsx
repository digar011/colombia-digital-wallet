'use client';

import React, { useState, useCallback, useRef, useEffect, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCountry } from '@/lib/contexts/CountryContext';
import { useAuthContext } from '@/lib/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';

// ─── Constants ──────────────────────────────────────────────────────────────

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

// ─── Component ──────────────────────────────────────────────────────────────

export default function VerifyPage() {
  const router = useRouter();
  const { country } = useCountry();
  const { verifyOtp, isLoading, user } = useAuthContext();

  // OTP digit state
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // Resend timer
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN_SECONDS);
  const [canResend, setCanResend] = useState(false);

  // Refs for each input
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  // Auto-submit when all digits are filled
  useEffect(() => {
    const code = digits.join('');
    if (code.length === OTP_LENGTH && digits.every((d) => d !== '')) {
      handleVerify(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  const handleVerify = useCallback(
    async (codeOverride?: string) => {
      const code = codeOverride || digits.join('');

      if (code.length !== OTP_LENGTH) {
        setError('Ingresa los 6 digitos del codigo');
        return;
      }

      setError('');
      const result = await verifyOtp(code);

      if (result.success) {
        setIsVerified(true);
        // Brief delay to show success, then redirect
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setError(result.error || 'Codigo incorrecto. Intenta de nuevo.');
        // Clear digits on error
        setDigits(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    },
    [digits, verifyOtp, router]
  );

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      // Only allow single digit
      const digit = value.replace(/\D/g, '').slice(-1);

      setDigits((prev) => {
        const next = [...prev];
        next[index] = digit;
        return next;
      });

      // Clear error on typing
      if (error) setError('');

      // Auto-focus next input
      if (digit && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [error]
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (!digits[index] && index > 0) {
          // If current is empty, go back to previous
          inputRefs.current[index - 1]?.focus();
          setDigits((prev) => {
            const next = [...prev];
            next[index - 1] = '';
            return next;
          });
        } else {
          setDigits((prev) => {
            const next = [...prev];
            next[index] = '';
            return next;
          });
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      } else if (e.key === 'Enter') {
        handleVerify();
      }
    },
    [digits, handleVerify]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
      if (!pasted) return;

      const newDigits = Array(OTP_LENGTH).fill('');
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setDigits(newDigits);

      // Focus the next empty or the last input
      const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
    },
    []
  );

  const handleResend = useCallback(() => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(RESEND_COOLDOWN_SECONDS);
    setDigits(Array(OTP_LENGTH).fill(''));
    setError('');
    inputRefs.current[0]?.focus();
    // In a real app, this would trigger a new OTP send
  }, [canResend]);

  // Determine masked email/phone for display
  const maskedContact = user?.email
    ? user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : user?.phone
    ? user.phone.replace(/(.{4})(.*)(.{2})/, '$1****$3')
    : 'tu correo/telefono';

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* ─── Top gradient accent ─────────────────────────────────── */}
      <div
        className="h-2 w-full"
        style={{
          background: `linear-gradient(90deg, ${country.colors.primary} 0%, ${country.colors.primary} 50%, ${country.colors.secondary} 50%, ${country.colors.secondary} 75%, ${country.colors.accent} 75%, ${country.colors.accent} 100%)`,
        }}
      />

      {/* ─── Header with back button ─────────────────────────────── */}
      <div className="flex items-center px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-surface dark:hover:bg-surface-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-colombia-blue"
          aria-label="Volver"
        >
          <ArrowLeft size={20} className="text-text-primary dark:text-text-primary-dark" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-text-primary dark:text-text-primary-dark pr-10">
          Verificacion
        </h1>
      </div>

      {/* ─── Main content ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {isVerified ? (
          /* ─── Success state ─────────────────────────────────────── */
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-2">
              Cuenta verificada
            </h2>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
              Redirigiendo al panel principal...
            </p>
          </div>
        ) : (
          /* ─── OTP input state ───────────────────────────────────── */
          <div className="w-full max-w-sm animate-slide-up">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${country.colors.secondary}15` }}
              >
                <Mail
                  size={28}
                  className="text-colombia-blue dark:text-colombia-yellow"
                />
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark text-center mb-2">
              Verifica tu cuenta
            </h2>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark text-center mb-8">
              Ingresa el codigo de 6 digitos enviado a{' '}
              <span className="font-medium text-text-primary dark:text-text-primary-dark">
                {maskedContact}
              </span>
            </p>

            {/* Error */}
            {error && (
              <div className="bg-colombia-red/10 border border-colombia-red/30 rounded-lg p-3 mb-4 text-center">
                <p className="text-sm text-colombia-red font-medium">{error}</p>
              </div>
            )}

            {/* OTP Inputs */}
            <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                  aria-label={`Digito ${index + 1}`}
                  className={cn(
                    'w-12 h-14 text-center text-xl font-bold rounded-lg border-2',
                    'bg-white dark:bg-gray-800',
                    'text-text-primary dark:text-text-primary-dark',
                    'transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-offset-0',
                    'disabled:opacity-50',
                    digit
                      ? 'border-colombia-blue dark:border-colombia-yellow'
                      : error
                      ? 'border-colombia-red focus:ring-colombia-red/30'
                      : 'border-gray-200 dark:border-gray-600 focus:ring-colombia-blue/30 focus:border-colombia-blue dark:focus:ring-colombia-yellow/30 dark:focus:border-colombia-yellow'
                  )}
                  disabled={isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Verify button */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              onClick={() => handleVerify()}
              disabled={digits.some((d) => !d)}
            >
              Verificar
            </Button>

            {/* Resend code */}
            <div className="text-center mt-6">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className={cn(
                    'inline-flex items-center gap-2 text-sm font-medium',
                    'text-colombia-blue dark:text-colombia-yellow',
                    'hover:underline',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-colombia-blue rounded'
                  )}
                >
                  <RefreshCw size={14} />
                  Reenviar codigo
                </button>
              ) : (
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                  Reenviar codigo en{' '}
                  <span className="font-semibold text-text-primary dark:text-text-primary-dark">
                    {formatTime(resendTimer)}
                  </span>
                </p>
              )}
            </div>

            {/* Demo hint */}
            <div className="mt-8 p-3 rounded-lg bg-surface dark:bg-surface-dark border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark text-center">
                <span className="font-semibold">Demo:</span> Ingresa cualquier combinacion de 6 digitos para continuar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
