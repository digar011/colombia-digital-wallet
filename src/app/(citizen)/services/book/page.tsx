'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  Car,
  Receipt,
  HeartPulse,
  Users,
  Wifi,
  MapPin,
  Video,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  FileText,
  RefreshCw,
  ClipboardList,
  Search,
  UserPlus,
  Shield,
  CreditCard,
  Stethoscope,
  HandCoins,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useCountry } from '@/lib/contexts/CountryContext';
import type { AgencyConfig } from '@/config';

// ─── Agency metadata ────────────────────────────────────────────────────────

interface AgencyMeta {
  key: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const agencyMeta: AgencyMeta[] = [
  { key: 'identity', icon: Building2, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  { key: 'vehicles', icon: Car, color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { key: 'tax', icon: Receipt, color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
  { key: 'health', icon: HeartPulse, color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  { key: 'socialServices', icon: Users, color: 'text-violet-600', bgColor: 'bg-violet-50 dark:bg-violet-900/20' },
  { key: 'technology', icon: Wifi, color: 'text-teal-600', bgColor: 'bg-teal-50 dark:bg-teal-900/20' },
];

// ─── Service definitions per agency ─────────────────────────────────────────

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  estimatedMinutes: number;
}

const servicesByAgency: Record<string, ServiceOption[]> = {
  identity: [
    { id: 'doc_renewal', name: 'Renovacion de Documento', description: 'Renovar documento de identidad vencido o por vencer', icon: RefreshCw, estimatedMinutes: 30 },
    { id: 'first_issuance', name: 'Primera Vez', description: 'Solicitar documento de identidad por primera vez', icon: UserPlus, estimatedMinutes: 45 },
    { id: 'correction', name: 'Correccion de Datos', description: 'Corregir errores en nombre, fecha u otros datos', icon: FileText, estimatedMinutes: 30 },
    { id: 'certificate', name: 'Certificados', description: 'Solicitar certificados de nacimiento, matrimonio, etc.', icon: ClipboardList, estimatedMinutes: 20 },
  ],
  vehicles: [
    { id: 'license_renewal', name: 'Renovacion de Licencia', description: 'Renovar licencia de conduccion', icon: RefreshCw, estimatedMinutes: 45 },
    { id: 'vehicle_reg', name: 'Registro de Vehiculo', description: 'Registrar vehiculo nuevo o usado', icon: Car, estimatedMinutes: 60 },
    { id: 'transfer', name: 'Traspaso', description: 'Transferencia de propiedad de vehiculo', icon: FileText, estimatedMinutes: 45 },
    { id: 'traffic_record', name: 'Historial de Transito', description: 'Consultar comparendos y estado de multas', icon: Search, estimatedMinutes: 20 },
  ],
  tax: [
    { id: 'tax_filing', name: 'Declaracion de Impuestos', description: 'Asesoria para declaracion de renta o IVA', icon: Receipt, estimatedMinutes: 60 },
    { id: 'tax_id_update', name: 'Actualizacion de RUT/NIT', description: 'Actualizar informacion tributaria', icon: RefreshCw, estimatedMinutes: 30 },
    { id: 'tax_consult', name: 'Consulta Tributaria', description: 'Consulta general sobre obligaciones fiscales', icon: Search, estimatedMinutes: 30 },
    { id: 'tax_certificate', name: 'Certificados Tributarios', description: 'Solicitar certificados de situacion fiscal', icon: ClipboardList, estimatedMinutes: 20 },
  ],
  health: [
    { id: 'affiliation', name: 'Afiliacion', description: 'Afiliarse al sistema de salud', icon: UserPlus, estimatedMinutes: 45 },
    { id: 'coverage_check', name: 'Verificacion de Cobertura', description: 'Consultar estado de afiliacion y cobertura', icon: Shield, estimatedMinutes: 20 },
    { id: 'medical_apt', name: 'Cita Medica', description: 'Agendar cita con medico general o especialista', icon: Stethoscope, estimatedMinutes: 30 },
    { id: 'prescription', name: 'Recetas y Medicamentos', description: 'Reclamar medicamentos o renovar recetas', icon: HeartPulse, estimatedMinutes: 15 },
  ],
  socialServices: [
    { id: 'enrollment', name: 'Inscripcion a Programa', description: 'Inscribirse en un programa social disponible', icon: UserPlus, estimatedMinutes: 45 },
    { id: 'benefit_inquiry', name: 'Consulta de Beneficios', description: 'Verificar estado de subsidios o beneficios', icon: HandCoins, estimatedMinutes: 20 },
    { id: 'status_update', name: 'Actualizacion de Datos', description: 'Actualizar informacion personal en el programa', icon: RefreshCw, estimatedMinutes: 30 },
    { id: 'payment_inquiry', name: 'Consulta de Pagos', description: 'Verificar fechas y montos de pagos pendientes', icon: CreditCard, estimatedMinutes: 15 },
  ],
  technology: [
    { id: 'digital_services', name: 'Servicios Digitales', description: 'Asistencia con plataformas digitales del gobierno', icon: Wifi, estimatedMinutes: 30 },
    { id: 'connectivity', name: 'Conectividad', description: 'Programas de acceso a internet y puntos digitales', icon: Wifi, estimatedMinutes: 20 },
  ],
};

// ─── Time slots ─────────────────────────────────────────────────────────────

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30',
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'CIT-';
  for (let i = 0; i < 8; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

function getNext14Days(): { date: string; label: string; dayName: string; isToday: boolean }[] {
  const days: { date: string; label: string; dayName: string; isToday: boolean }[] = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // Skip Sundays
    if (d.getDay() === 0) continue;
    const iso = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('es', { weekday: 'short' });
    const label = d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
    days.push({ date: iso, label, dayName, isToday: false });
  }
  return days;
}

// ─── Step Components ────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex-1 flex items-center gap-2">
          <div
            className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${
              i < current
                ? 'bg-colombia-blue dark:bg-colombia-yellow'
                : i === current
                  ? 'bg-colombia-blue/40 dark:bg-colombia-yellow/40'
                  : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function BookAppointmentPage() {
  const router = useRouter();
  const { country } = useCountry();
  const agencies = country.agencies;

  // Steps: 0=agency, 1=service, 2=datetime, 3=confirmation
  const [step, setStep] = useState(0);
  const [selectedAgencyKey, setSelectedAgencyKey] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'virtual'>('in-person');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [reference, setReference] = useState('');

  const availableDays = useMemo(() => getNext14Days(), []);

  const selectedAgency: AgencyConfig | null = selectedAgencyKey
    ? (agencies[selectedAgencyKey as keyof typeof agencies] as AgencyConfig)
    : null;

  const selectedAgencyInfo = agencyMeta.find((a) => a.key === selectedAgencyKey);

  const services = selectedAgencyKey ? (servicesByAgency[selectedAgencyKey] || []) : [];

  // ── Step 0: Select agency ──

  function renderAgencyStep() {
    return (
      <div className="px-4 mt-4 space-y-3">
        <div>
          <h2 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
            Selecciona la entidad
          </h2>
          <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">
            {country.flag} {country.name} &middot; Elige donde quieres agendar tu cita
          </p>
        </div>

        <div className="space-y-2">
          {agencyMeta.map((meta) => {
            const agency = agencies[meta.key as keyof typeof agencies] as AgencyConfig | undefined;
            if (!agency) return null;
            const Icon = meta.icon;

            return (
              <Card
                key={meta.key}
                variant="elevated"
                clickable
                padding="none"
              >
                <button
                  onClick={() => {
                    setSelectedAgencyKey(meta.key);
                    setSelectedService(null);
                    setStep(1);
                  }}
                  className="w-full text-left p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl ${meta.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={22} className={meta.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
                        {agency.shortName}
                      </p>
                      <p className="text-xs text-text-secondary dark:text-text-secondary-dark truncate">
                        {agency.name}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                  </div>
                </button>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Step 1: Select service + type ──

  function renderServiceStep() {
    if (!selectedAgency || !selectedAgencyInfo) return null;
    const AgencyIcon = selectedAgencyInfo.icon;

    return (
      <div className="px-4 mt-4 space-y-4">
        {/* Agency header */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${selectedAgencyInfo.bgColor} flex items-center justify-center`}>
            <AgencyIcon size={20} className={selectedAgencyInfo.color} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
              {selectedAgency.shortName}
            </h2>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              Selecciona el servicio
            </p>
          </div>
        </div>

        {/* Appointment type toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setAppointmentType('in-person')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              appointmentType === 'in-person'
                ? 'bg-colombia-blue text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-text-secondary-dark'
            }`}
          >
            <MapPin size={15} />
            Presencial
          </button>
          <button
            onClick={() => setAppointmentType('virtual')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              appointmentType === 'virtual'
                ? 'bg-colombia-blue text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-text-secondary-dark'
            }`}
          >
            <Video size={15} />
            Virtual
          </button>
        </div>

        {/* Services list */}
        <div className="space-y-2">
          {services.map((svc) => {
            const SvcIcon = svc.icon;
            const isSelected = selectedService?.id === svc.id;

            return (
              <Card
                key={svc.id}
                variant={isSelected ? 'elevated' : 'outlined'}
                clickable
                padding="none"
              >
                <button
                  onClick={() => setSelectedService(svc)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    isSelected ? 'ring-2 ring-colombia-blue dark:ring-colombia-yellow' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <SvcIcon size={18} className={isSelected ? 'text-colombia-blue dark:text-colombia-yellow' : 'text-gray-400'} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isSelected ? 'text-colombia-blue dark:text-colombia-yellow' : 'text-text-primary dark:text-text-primary-dark'}`}>
                        {svc.name}
                      </p>
                      <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">
                        {svc.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Clock size={11} className="text-text-secondary dark:text-text-secondary-dark" />
                        <span className="text-[11px] text-text-secondary dark:text-text-secondary-dark">
                          ~{svc.estimatedMinutes} min
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 size={18} className="text-colombia-blue dark:text-colombia-yellow flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                </button>
              </Card>
            );
          })}
        </div>

        {/* Continue */}
        <Button
          variant="primary"
          fullWidth
          size="lg"
          disabled={!selectedService}
          onClick={() => setStep(2)}
        >
          Continuar
        </Button>
      </div>
    );
  }

  // ── Step 2: Select date & time ──

  function renderDateTimeStep() {
    return (
      <div className="px-4 mt-4 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
            Fecha y Hora
          </h2>
          <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">
            Selecciona cuando quieres tu cita
          </p>
        </div>

        {/* Date picker - horizontal scroll */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-text-secondary dark:text-text-secondary-dark" />
            <span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark">
              Fecha
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {availableDays.map((day) => (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all ${
                  selectedDate === day.date
                    ? 'bg-colombia-blue text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-text-primary dark:text-text-primary-dark'
                }`}
              >
                <p className={`text-[10px] uppercase font-medium ${
                  selectedDate === day.date ? 'text-white/80' : 'text-text-secondary dark:text-text-secondary-dark'
                }`}>
                  {day.dayName}
                </p>
                <p className="text-lg font-bold">
                  {new Date(day.date + 'T00:00:00').getDate()}
                </p>
                <p className={`text-[10px] ${
                  selectedDate === day.date ? 'text-white/70' : 'text-text-secondary dark:text-text-secondary-dark'
                }`}>
                  {new Date(day.date + 'T00:00:00').toLocaleDateString('es', { month: 'short' })}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Time slots */}
        {selectedDate && (
          <div className="animate-slide-down">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-text-secondary dark:text-text-secondary-dark" />
              <span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark">
                Hora disponible
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-colombia-blue text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-text-primary dark:text-text-primary-dark hover:border-colombia-blue dark:hover:border-colombia-yellow'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {selectedDate && selectedTime && (
          <div className="animate-slide-down">
            <Input
              label="Notas adicionales (opcional)"
              placeholder="Ej: Necesito interprete, traigo documentos adicionales..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              inputSize="md"
            />
          </div>
        )}

        {/* Continue */}
        <Button
          variant="primary"
          fullWidth
          size="lg"
          disabled={!selectedDate || !selectedTime}
          onClick={() => setShowConfirmModal(true)}
        >
          Revisar Cita
        </Button>
      </div>
    );
  }

  // ── Step 3: Confirmation (success state) ──

  function renderSuccessStep() {
    if (!selectedAgency || !selectedService || !selectedDate || !selectedTime) return null;

    const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('es', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <div className="px-4 mt-4 space-y-4">
        {/* Success header */}
        <div className="flex flex-col items-center text-center py-4" role="status" aria-live="polite">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3" aria-hidden="true">
            <CheckCircle2 size={36} className="text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
            Cita Agendada
          </h2>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-1">
            Tu cita ha sido registrada exitosamente
          </p>
        </div>

        {/* Appointment details */}
        <Card variant="elevated" padding="md">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">Referencia</span>
              <span className="text-sm font-mono font-bold text-colombia-blue dark:text-colombia-yellow">
                {reference}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">Entidad</span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark text-right max-w-[60%]">
                {selectedAgency.shortName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">Servicio</span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark text-right max-w-[60%]">
                {selectedService.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">Modalidad</span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                {appointmentType === 'virtual' ? 'Virtual' : 'Presencial'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">Fecha</span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark text-right max-w-[60%] capitalize">
                {formattedDate}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">Hora</span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                {selectedTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">Duracion est.</span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                ~{selectedService.estimatedMinutes} min
              </span>
            </div>
            {notes && (
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <span className="text-xs text-text-secondary dark:text-text-secondary-dark">Notas</span>
                <p className="text-xs text-text-primary dark:text-text-primary-dark mt-0.5">{notes}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => router.push('/services')}
          >
            Volver a Servicios
          </Button>
          <Button
            variant="outline"
            fullWidth
            size="lg"
            onClick={() => {
              setStep(0);
              setSelectedAgencyKey(null);
              setSelectedService(null);
              setSelectedDate(null);
              setSelectedTime(null);
              setNotes('');
              setIsBooked(false);
              setReference('');
            }}
          >
            Agendar Otra Cita
          </Button>
        </div>
      </div>
    );
  }

  // ── Confirmation Modal ──

  function renderConfirmModal() {
    if (!selectedAgency || !selectedService || !selectedDate || !selectedTime) return null;

    const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('es', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    return (
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmar Cita"
        description="Revisa los detalles antes de confirmar"
        size="sm"
        actions={
          <>
            <Button
              variant="ghost"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setReference(generateReference());
                setShowConfirmModal(false);
                setIsBooked(true);
                setStep(3);
              }}
            >
              Confirmar Cita
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            {selectedAgencyInfo && (
              <div className={`w-9 h-9 rounded-lg ${selectedAgencyInfo.bgColor} flex items-center justify-center`}>
                {React.createElement(selectedAgencyInfo.icon, { size: 18, className: selectedAgencyInfo.color })}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
                {selectedAgency.shortName}
              </p>
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                {selectedService.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={12} className="text-text-secondary dark:text-text-secondary-dark" />
                <span className="text-[10px] text-text-secondary dark:text-text-secondary-dark uppercase">Fecha</span>
              </div>
              <p className="text-xs font-medium text-text-primary dark:text-text-primary-dark capitalize">
                {formattedDate}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={12} className="text-text-secondary dark:text-text-secondary-dark" />
                <span className="text-[10px] text-text-secondary dark:text-text-secondary-dark uppercase">Hora</span>
              </div>
              <p className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                {selectedTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            {appointmentType === 'virtual' ? (
              <Video size={14} className="text-colombia-blue" />
            ) : (
              <MapPin size={14} className="text-colombia-blue" />
            )}
            <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
              {appointmentType === 'virtual' ? 'Cita Virtual' : 'Cita Presencial'}
            </span>
          </div>
        </div>
      </Modal>
    );
  }

  // ── Page title per step ──

  const stepTitles = ['Agendar Cita', 'Seleccionar Servicio', 'Fecha y Hora', 'Confirmacion'];

  const canGoBack = step > 0 && !isBooked;

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (canGoBack) {
                setStep(step - 1);
              } else {
                router.back();
              }
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} className="text-text-primary dark:text-text-primary-dark" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
              {stepTitles[step]}
            </h1>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              {country.flag} {country.name}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      {!isBooked && <StepIndicator current={step} total={3} />}

      {/* Content */}
      {step === 0 && renderAgencyStep()}
      {step === 1 && renderServiceStep()}
      {step === 2 && renderDateTimeStep()}
      {step === 3 && isBooked && renderSuccessStep()}

      {/* Confirm modal */}
      {renderConfirmModal()}
    </div>
  );
}
