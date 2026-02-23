'use client';

import React, { useState, useCallback, FormEvent, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronDown,
  Camera,
  CreditCard,
  Check,
  Shield,
  User,
  Phone,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCountry } from '@/lib/contexts/CountryContext';
import { useAuthContext } from '@/lib/contexts/AuthContext';
import { cn } from '@/lib/utils/cn';
import type { DocumentType, Gender, RegisterData } from '@/lib/hooks/useAuth';

// ─── Colombian departments ──────────────────────────────────────────────────

const COLOMBIAN_DEPARTMENTS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlantico', 'Bolivar',
  'Boyaca', 'Caldas', 'Caqueta', 'Casanare', 'Cauca',
  'Cesar', 'Choco', 'Cordoba', 'Cundinamarca', 'Guainia',
  'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta',
  'Narino', 'Norte de Santander', 'Putumayo', 'Quindio',
  'Risaralda', 'San Andres y Providencia', 'Santander', 'Sucre',
  'Tolima', 'Valle del Cauca', 'Vaupes', 'Vichada', 'Bogota D.C.',
];

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'CC', label: 'Cedula de Ciudadania (CC)' },
  { value: 'CE', label: 'Cedula de Extranjeria (CE)' },
  { value: 'TI', label: 'Tarjeta de Identidad (TI)' },
  { value: 'PP', label: 'Pasaporte (PP)' },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'O', label: 'Otro' },
];

// ─── Types ──────────────────────────────────────────────────────────────────

interface FormState {
  // Step 1
  documentType: DocumentType;
  documentNumber: string;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  dateOfBirth: string;
  gender: Gender;
  // Step 2
  email: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  // Step 3
  password: string;
  confirmPassword: string;
  pin: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

type FormErrors = Partial<Record<keyof FormState | 'general', string>>;

const TOTAL_STEPS = 4;

// ─── Step labels for the indicator ──────────────────────────────────────────

const STEP_LABELS = ['Datos personales', 'Contacto', 'Seguridad', 'Verificacion'];
const STEP_ICONS = [User, Phone, Shield, CreditCard];

// ─── Validation per step ────────────────────────────────────────────────────

function validateStep1(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.documentNumber.trim()) errors.documentNumber = 'Numero de documento es requerido';
  else if (!/^\d{5,20}$/.test(form.documentNumber.trim())) errors.documentNumber = 'Numero de documento no valido';
  if (!form.firstName.trim()) errors.firstName = 'Primer nombre es requerido';
  if (!form.firstLastName.trim()) errors.firstLastName = 'Primer apellido es requerido';
  if (!form.secondLastName.trim()) errors.secondLastName = 'Segundo apellido es requerido';
  if (!form.dateOfBirth) errors.dateOfBirth = 'Fecha de nacimiento es requerida';
  else {
    const dob = new Date(form.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 14) errors.dateOfBirth = 'Debes tener al menos 14 anos';
    if (age > 120) errors.dateOfBirth = 'Fecha de nacimiento no valida';
  }
  return errors;
}

function validateStep2(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.email.trim()) errors.email = 'Correo electronico es requerido';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Formato de correo no valido';
  if (!form.phone.trim()) errors.phone = 'Telefono es requerido';
  else if (!/^\+?\d{7,15}$/.test(form.phone.replace(/\s/g, ''))) errors.phone = 'Numero de telefono no valido';
  if (!form.department) errors.department = 'Selecciona un departamento';
  if (!form.city.trim()) errors.city = 'Ciudad es requerida';
  if (!form.address.trim()) errors.address = 'Direccion es requerida';
  return errors;
}

function validateStep3(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.password) {
    errors.password = 'Contrasena es requerida';
  } else {
    if (form.password.length < 8) errors.password = 'Minimo 8 caracteres';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
      errors.password = 'Debe incluir mayusculas, minusculas y numeros';
  }
  if (!form.confirmPassword) errors.confirmPassword = 'Confirma tu contrasena';
  else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Las contrasenas no coinciden';
  if (!form.pin) errors.pin = 'PIN es requerido';
  else if (!/^\d{6}$/.test(form.pin)) errors.pin = 'El PIN debe tener exactamente 6 digitos';
  if (!form.acceptTerms) errors.acceptTerms = 'Debes aceptar los terminos y condiciones';
  if (!form.acceptPrivacy) errors.acceptPrivacy = 'Debes aceptar la politica de privacidad';
  return errors;
}

// ─── Password strength calculator ───────────────────────────────────────────

function getPasswordStrength(password: string): { level: number; label: string; color: string } {
  if (!password) return { level: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Debil', color: 'bg-colombia-red' };
  if (score <= 2) return { level: 2, label: 'Regular', color: 'bg-orange-500' };
  if (score <= 3) return { level: 3, label: 'Buena', color: 'bg-colombia-yellow' };
  if (score <= 4) return { level: 4, label: 'Fuerte', color: 'bg-green-500' };
  return { level: 5, label: 'Muy fuerte', color: 'bg-green-600' };
}

// ─── Select component ───────────────────────────────────────────────────────

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
}

function Select({ label, value, onChange, options, error, placeholder }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full h-12 px-4 pr-10 text-base rounded-lg border bg-white dark:bg-gray-800 appearance-none',
            'text-text-primary dark:text-text-primary-dark',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-colombia-red focus:ring-colombia-red/30 focus:border-colombia-red'
              : 'border-gray-200 dark:border-gray-600 focus:ring-colombia-blue/30 focus:border-colombia-blue dark:focus:ring-colombia-yellow/30 dark:focus:border-colombia-yellow'
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark pointer-events-none"
        />
      </div>
      {error && <p className="text-xs text-colombia-red font-medium">{error}</p>}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const { country } = useCountry();
  const { register, isLoading } = useAuthContext();

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState<FormState>({
    documentType: 'CC',
    documentNumber: '',
    firstName: '',
    secondName: '',
    firstLastName: '',
    secondLastName: '',
    dateOfBirth: '',
    gender: 'M',
    email: '',
    phone: '',
    department: '',
    city: '',
    address: '',
    password: '',
    confirmPassword: '',
    pin: '',
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const updateField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
    },
    [errors]
  );

  const goNext = useCallback(() => {
    let stepErrors: FormErrors = {};

    if (currentStep === 1) stepErrors = validateStep1(form);
    else if (currentStep === 2) stepErrors = validateStep2(form);
    else if (currentStep === 3) stepErrors = validateStep3(form);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      // Scroll to top of form to show errors
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  }, [currentStep, form]);

  const goBack = useCallback(() => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (currentStep < TOTAL_STEPS) {
        goNext();
        return;
      }

      // Step 4: Submit registration
      const data: RegisterData = {
        documentType: form.documentType,
        documentNumber: form.documentNumber,
        firstName: form.firstName,
        secondName: form.secondName || undefined,
        firstLastName: form.firstLastName,
        secondLastName: form.secondLastName,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        email: form.email,
        phone: form.phone,
        department: form.department,
        city: form.city,
        address: form.address,
        password: form.password,
        pin: form.pin,
      };

      const result = await register(data);
      if (result.success) {
        router.push('/verify');
      } else {
        setErrors({ general: result.error || 'Error al crear la cuenta' });
      }
    },
    [currentStep, form, goNext, register, router]
  );

  const handleSkipVerification = useCallback(async () => {
    const data: RegisterData = {
      documentType: form.documentType,
      documentNumber: form.documentNumber,
      firstName: form.firstName,
      secondName: form.secondName || undefined,
      firstLastName: form.firstLastName,
      secondLastName: form.secondLastName,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      email: form.email,
      phone: form.phone,
      department: form.department,
      city: form.city,
      address: form.address,
      password: form.password,
      pin: form.pin,
    };

    const result = await register(data);
    if (result.success) {
      router.push('/dashboard');
    }
  }, [form, register, router]);

  const passwordStrength = getPasswordStrength(form.password);

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
          onClick={currentStep > 1 ? goBack : () => router.push('/login')}
          className="p-2 rounded-lg hover:bg-surface dark:hover:bg-surface-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-colombia-blue"
          aria-label="Volver"
        >
          <ArrowLeft size={20} className="text-text-primary dark:text-text-primary-dark" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-text-primary dark:text-text-primary-dark pr-10">
          Crear cuenta
        </h1>
      </div>

      {/* ─── Step indicator ──────────────────────────────────────── */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => {
            const stepNum = i + 1;
            const Icon = STEP_ICONS[i];
            const isComplete = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <React.Fragment key={stepNum}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                      isComplete
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-colombia-blue dark:bg-colombia-yellow text-white dark:text-colombia-blue'
                        : 'bg-gray-200 dark:bg-gray-700 text-text-secondary dark:text-text-secondary-dark'
                    )}
                  >
                    {isComplete ? <Check size={18} /> : <Icon size={18} />}
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-medium text-center leading-tight max-w-[60px]',
                      isCurrent
                        ? 'text-colombia-blue dark:text-colombia-yellow'
                        : isComplete
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-text-secondary dark:text-text-secondary-dark'
                    )}
                  >
                    {STEP_LABELS[i]}
                  </span>
                </div>
                {i < TOTAL_STEPS - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-2 mb-5 transition-colors duration-300',
                      stepNum < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ─── Form content ────────────────────────────────────────── */}
      <div className="flex-1 px-6 pb-8">
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          {/* General error */}
          {errors.general && (
            <div className="bg-colombia-red/10 border border-colombia-red/30 rounded-lg p-3 mb-4 text-center">
              <p className="text-sm text-colombia-red font-medium">{errors.general}</p>
            </div>
          )}

          {/* ─── Step 1: Personal Info ───────────────────────────── */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-slide-up">
              <h2 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4">
                Informacion personal
              </h2>

              <Select
                label="Tipo de documento"
                value={form.documentType}
                onChange={(v) => updateField('documentType', v as DocumentType)}
                options={DOCUMENT_TYPES}
                error={errors.documentType}
              />

              <Input
                label="Numero de documento"
                type="text"
                inputMode="numeric"
                placeholder="1234567890"
                value={form.documentNumber}
                onChange={(e) => updateField('documentNumber', e.target.value.replace(/\D/g, ''))}
                error={errors.documentNumber}
                inputSize="lg"
                leftIcon={CreditCard}
                autoComplete="off"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Primer nombre"
                  type="text"
                  placeholder="Juan"
                  value={form.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  error={errors.firstName}
                  inputSize="lg"
                  autoComplete="given-name"
                />
                <Input
                  label="Segundo nombre"
                  type="text"
                  placeholder="Carlos (opcional)"
                  value={form.secondName}
                  onChange={(e) => updateField('secondName', e.target.value)}
                  helperText="Opcional"
                  inputSize="lg"
                  autoComplete="additional-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Primer apellido"
                  type="text"
                  placeholder="Perez"
                  value={form.firstLastName}
                  onChange={(e) => updateField('firstLastName', e.target.value)}
                  error={errors.firstLastName}
                  inputSize="lg"
                  autoComplete="family-name"
                />
                <Input
                  label="Segundo apellido"
                  type="text"
                  placeholder="Garcia"
                  value={form.secondLastName}
                  onChange={(e) => updateField('secondLastName', e.target.value)}
                  error={errors.secondLastName}
                  inputSize="lg"
                  autoComplete="off"
                />
              </div>

              <Input
                label="Fecha de nacimiento"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                error={errors.dateOfBirth}
                inputSize="lg"
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                  Genero
                </label>
                <div className="flex gap-2">
                  {GENDER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateField('gender', opt.value)}
                      className={cn(
                        'flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-200',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-colombia-blue focus-visible:ring-offset-2',
                        form.gender === opt.value
                          ? 'border-colombia-blue dark:border-colombia-yellow bg-colombia-blue/5 dark:bg-colombia-yellow/5 text-colombia-blue dark:text-colombia-yellow'
                          : 'border-gray-200 dark:border-gray-700 text-text-secondary dark:text-text-secondary-dark hover:border-gray-300 dark:hover:border-gray-600'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button type="button" variant="primary" size="lg" fullWidth onClick={goNext}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {/* ─── Step 2: Contact Info ────────────────────────────── */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-slide-up">
              <h2 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4">
                Informacion de contacto
              </h2>

              <Input
                label="Correo electronico"
                type="email"
                placeholder="tu@correo.com"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                error={errors.email}
                inputSize="lg"
                autoComplete="email"
              />

              <Input
                label="Telefono celular"
                type="tel"
                placeholder="+57 300 123 4567"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                error={errors.phone}
                inputSize="lg"
                leftIcon={Phone}
                autoComplete="tel"
              />

              <Select
                label="Departamento"
                value={form.department}
                onChange={(v) => updateField('department', v)}
                options={COLOMBIAN_DEPARTMENTS.map((d) => ({ value: d, label: d }))}
                error={errors.department}
                placeholder="Selecciona un departamento"
              />

              <Input
                label="Ciudad"
                type="text"
                placeholder="Bogota"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                error={errors.city}
                inputSize="lg"
                autoComplete="address-level2"
              />

              <Input
                label="Direccion"
                type="text"
                placeholder="Calle 123 # 45-67"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                error={errors.address}
                inputSize="lg"
                leftIcon={MapPin}
                autoComplete="street-address"
              />

              <div className="pt-4">
                <Button type="button" variant="primary" size="lg" fullWidth onClick={goNext}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {/* ─── Step 3: Security ────────────────────────────────── */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-slide-up">
              <h2 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4">
                Seguridad
              </h2>

              <div className="space-y-1.5">
                <Input
                  label="Contrasena"
                  type="password"
                  placeholder="Minimo 8 caracteres"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  error={errors.password}
                  inputSize="lg"
                  autoComplete="new-password"
                />
                {/* Password strength indicator */}
                {form.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={cn(
                            'h-1.5 flex-1 rounded-full transition-colors duration-300',
                            level <= passwordStrength.level
                              ? passwordStrength.color
                              : 'bg-gray-200 dark:bg-gray-700'
                          )}
                        />
                      ))}
                    </div>
                    <p
                      className={cn(
                        'text-xs font-medium',
                        passwordStrength.level <= 1
                          ? 'text-colombia-red'
                          : passwordStrength.level <= 2
                          ? 'text-orange-500'
                          : passwordStrength.level <= 3
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      )}
                    >
                      {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              <Input
                label="Confirmar contrasena"
                type="password"
                placeholder="Repite tu contrasena"
                value={form.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                inputSize="lg"
                autoComplete="new-password"
              />

              <div className="space-y-1.5">
                <Input
                  label="PIN de acceso rapido (6 digitos)"
                  type="password"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  value={form.pin}
                  onChange={(e) => updateField('pin', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  error={errors.pin}
                  inputSize="lg"
                  leftIcon={Shield}
                  autoComplete="off"
                />
                <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                  Este PIN te permitira acceder rapidamente a tu billetera
                </p>
              </div>

              {/* Terms and conditions */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={form.acceptTerms}
                      onChange={(e) => updateField('acceptTerms', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
                        form.acceptTerms
                          ? 'bg-colombia-blue border-colombia-blue dark:bg-colombia-yellow dark:border-colombia-yellow'
                          : errors.acceptTerms
                          ? 'border-colombia-red'
                          : 'border-gray-300 dark:border-gray-600 group-hover:border-colombia-blue dark:group-hover:border-colombia-yellow'
                      )}
                    >
                      {form.acceptTerms && <Check size={14} className="text-white dark:text-colombia-blue" />}
                    </div>
                  </div>
                  <span className="text-sm text-text-primary dark:text-text-primary-dark">
                    Acepto los{' '}
                    <span className="text-colombia-blue dark:text-colombia-yellow font-medium underline">
                      terminos y condiciones
                    </span>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-xs text-colombia-red font-medium ml-8">{errors.acceptTerms}</p>
                )}

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={form.acceptPrivacy}
                      onChange={(e) => updateField('acceptPrivacy', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
                        form.acceptPrivacy
                          ? 'bg-colombia-blue border-colombia-blue dark:bg-colombia-yellow dark:border-colombia-yellow'
                          : errors.acceptPrivacy
                          ? 'border-colombia-red'
                          : 'border-gray-300 dark:border-gray-600 group-hover:border-colombia-blue dark:group-hover:border-colombia-yellow'
                      )}
                    >
                      {form.acceptPrivacy && <Check size={14} className="text-white dark:text-colombia-blue" />}
                    </div>
                  </div>
                  <span className="text-sm text-text-primary dark:text-text-primary-dark">
                    Acepto la{' '}
                    <span className="text-colombia-blue dark:text-colombia-yellow font-medium underline">
                      politica de privacidad
                    </span>{' '}
                    y el tratamiento de datos personales
                  </span>
                </label>
                {errors.acceptPrivacy && (
                  <p className="text-xs text-colombia-red font-medium ml-8">{errors.acceptPrivacy}</p>
                )}
              </div>

              <div className="pt-4">
                <Button type="button" variant="primary" size="lg" fullWidth onClick={goNext}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {/* ─── Step 4: Identity Verification ───────────────────── */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-slide-up">
              <h2 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-2">
                Verificacion de identidad
              </h2>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-4">
                Toma una foto de tu rostro y de tu documento de identidad para verificar tu cuenta.
              </p>

              {/* Selfie capture */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                  Selfie
                </label>
                <div
                  className={cn(
                    'border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl',
                    'flex flex-col items-center justify-center py-10',
                    'hover:border-colombia-blue dark:hover:border-colombia-yellow transition-colors cursor-pointer'
                  )}
                >
                  <div className="w-16 h-16 rounded-full bg-surface dark:bg-surface-dark flex items-center justify-center mb-3">
                    <Camera size={28} className="text-text-secondary dark:text-text-secondary-dark" />
                  </div>
                  <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                    Tomar selfie
                  </p>
                  <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1">
                    Mira directamente a la camara
                  </p>
                </div>
              </div>

              {/* Front of document */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                  Frente del documento
                </label>
                <div
                  className={cn(
                    'border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl',
                    'flex flex-col items-center justify-center py-8',
                    'hover:border-colombia-blue dark:hover:border-colombia-yellow transition-colors cursor-pointer'
                  )}
                >
                  <div className="w-14 h-14 rounded-lg bg-surface dark:bg-surface-dark flex items-center justify-center mb-3">
                    <CreditCard size={24} className="text-text-secondary dark:text-text-secondary-dark" />
                  </div>
                  <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                    Fotografiar frente
                  </p>
                  <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1">
                    Asegurate de que el documento sea legible
                  </p>
                </div>
              </div>

              {/* Back of document */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                  Reverso del documento
                </label>
                <div
                  className={cn(
                    'border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl',
                    'flex flex-col items-center justify-center py-8',
                    'hover:border-colombia-blue dark:hover:border-colombia-yellow transition-colors cursor-pointer'
                  )}
                >
                  <div className="w-14 h-14 rounded-lg bg-surface dark:bg-surface-dark flex items-center justify-center mb-3">
                    <CreditCard size={24} className="text-text-secondary dark:text-text-secondary-dark" />
                  </div>
                  <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                    Fotografiar reverso
                  </p>
                  <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1">
                    Incluye el codigo de barras del documento
                  </p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                >
                  Verificar identidad
                </Button>

                <button
                  type="button"
                  onClick={handleSkipVerification}
                  disabled={isLoading}
                  className={cn(
                    'w-full py-3 text-sm text-text-secondary dark:text-text-secondary-dark',
                    'hover:text-text-primary dark:hover:text-text-primary-dark',
                    'transition-colors underline',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-colombia-blue rounded-lg',
                    'disabled:opacity-50'
                  )}
                >
                  Omitir por ahora (demo)
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Already have account link (visible on step 1) */}
        {currentStep === 1 && (
          <p className="text-center text-sm text-text-secondary dark:text-text-secondary-dark mt-6">
            Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="font-semibold text-colombia-blue dark:text-colombia-yellow hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-colombia-blue rounded"
            >
              Inicia sesion
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
