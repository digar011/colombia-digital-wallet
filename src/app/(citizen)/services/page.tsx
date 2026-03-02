'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CalendarPlus,
  MapPin,
  Video,
  Clock,
  ChevronRight,
  Loader2,
  HandCoins,
  Landmark,
  CheckCircle2,
  XCircle,
  PauseCircle,
  AlertCircle,
  Banknote,
  ClipboardList,
  X,
  Send,
  ChevronDown,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  mockAppointments,
  mockSocialPrograms,
  formatColombianDate,
  formatShortDate,
  daysUntil,
  formatCOPCurrency,
  getUpcomingAppointments,
} from '@/lib/mock/citizenData';
import type { AppointmentRecord, SocialProgramRecord } from '@/lib/mock/citizenData';
import { appointmentBookingSchema, SERVICE_TYPES } from '@/lib/validations/citizen';

// ─── Status icon helper ──────────────────────────────────────────────────────

function ProgramStatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'active':
      return <CheckCircle2 size={16} className="text-green-600" />;
    case 'inactive':
      return <XCircle size={16} className="text-gray-400" />;
    case 'pending':
      return <AlertCircle size={16} className="text-amber-600" />;
    case 'suspended':
      return <PauseCircle size={16} className="text-red-600" />;
    default:
      return <AlertCircle size={16} className="text-gray-400" />;
  }
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',
    suspended: 'Suspendido',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };
  return labels[status] || status;
}

function statusBadge(status: string): 'active' | 'expiring' | 'expired' | 'pending' | 'default' {
  const map: Record<string, 'active' | 'expiring' | 'expired' | 'pending' | 'default'> = {
    active: 'active',
    confirmed: 'active',
    completed: 'active',
    pending: 'pending',
    inactive: 'default',
    cancelled: 'expired',
    suspended: 'expired',
  };
  return map[status] || 'default';
}

// ─── Appointment Card ────────────────────────────────────────────────────────

function AppointmentCard({ appointment }: { appointment: AppointmentRecord }) {
  const [expanded, setExpanded] = useState(false);
  const days = daysUntil(appointment.date);
  const isVirtual = appointment.type === 'virtual';
  const isPast = days < 0;

  return (
    <Card variant="elevated" className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        <div className="flex items-start gap-3">
          {/* Date badge */}
          <div className="w-14 flex-shrink-0 text-center">
            <div
              className={`rounded-xl p-2 ${
                isPast
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : days === 0
                    ? 'bg-colombia-red/10'
                    : 'bg-colombia-blue/10'
              }`}
            >
              <p
                className={`text-lg font-bold ${
                  isPast
                    ? 'text-gray-400'
                    : days === 0
                      ? 'text-colombia-red'
                      : 'text-colombia-blue'
                }`}
              >
                {new Date(appointment.date + 'T00:00:00').getDate()}
              </p>
              <p className="text-[9px] text-text-secondary dark:text-text-secondary-dark uppercase">
                {new Date(appointment.date + 'T00:00:00').toLocaleString('es-CO', {
                  month: 'short',
                })}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge status={statusBadge(appointment.status)} size="sm">
                {statusLabel(appointment.status)}
              </Badge>
              {isVirtual && (
                <Badge status="info" size="sm">
                  Virtual
                </Badge>
              )}
            </div>
            <p className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
              {appointment.title}
            </p>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">
              {appointment.entity}
            </p>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1">
                <Clock size={11} className="text-text-secondary dark:text-text-secondary-dark" />
                <span className="text-[11px] text-text-secondary dark:text-text-secondary-dark">
                  {appointment.time}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {isVirtual ? (
                  <Video size={11} className="text-text-secondary dark:text-text-secondary-dark" />
                ) : (
                  <MapPin size={11} className="text-text-secondary dark:text-text-secondary-dark" />
                )}
                <span className="text-[11px] text-text-secondary dark:text-text-secondary-dark truncate max-w-[180px]">
                  {appointment.location}
                </span>
              </div>
            </div>
          </div>

          <ChevronRight
            size={16}
            className={`text-gray-300 transition-transform flex-shrink-0 mt-2 ${expanded ? 'rotate-90' : ''}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 animate-slide-down">
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3 ml-[68px] space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Referencia
              </span>
              <span className="text-xs font-mono font-medium text-text-primary dark:text-text-primary-dark">
                {appointment.reference}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Fecha
              </span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                {formatColombianDate(appointment.date)}
              </span>
            </div>
            {appointment.notes && (
              <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  <span className="font-semibold">Nota:</span> {appointment.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Social Program Card ─────────────────────────────────────────────────────

function SocialProgramCard({ program }: { program: SocialProgramRecord }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card variant="elevated" className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        <div className="flex items-center gap-3">
          <ProgramStatusIcon status={program.status} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
              {program.name}
            </p>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark truncate">
              {program.authority}
            </p>
          </div>
          <Badge status={statusBadge(program.status)} size="sm" dot>
            {statusLabel(program.status)}
          </Badge>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 animate-slide-down">
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Detalle
              </span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark text-right max-w-[65%]">
                {program.details}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Inscripcion
              </span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                {formatShortDate(program.enrollmentDate)}
              </span>
            </div>

            {program.nextPaymentDate && (
              <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Banknote size={14} className="text-green-600" />
                  <span className="text-xs text-green-700 dark:text-green-400">
                    Proximo pago
                  </span>
                </div>
                <span className="text-xs font-bold text-green-700 dark:text-green-400">
                  {formatShortDate(program.nextPaymentDate)}
                </span>
              </div>
            )}

            {program.lastPaymentAmount && program.lastPaymentDate && (
              <div className="flex justify-between">
                <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                  Ultimo pago
                </span>
                <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                  {formatCOPCurrency(program.lastPaymentAmount)} ({formatShortDate(program.lastPaymentDate)})
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Services Page ───────────────────────────────────────────────────────────

// ─── Service type labels ─────────────────────────────────────────────────────

const SERVICE_TYPE_LABELS: Record<string, string> = {
  cedula: 'Cedula de Ciudadania',
  pasaporte: 'Pasaporte',
  licencia_conduccion: 'Licencia de Conduccion',
  registro_civil: 'Registro Civil',
  antecedentes: 'Antecedentes',
  certificado_electoral: 'Certificado Electoral',
  afiliacion_salud: 'Afiliacion Salud',
  pension: 'Pension',
  subsidio: 'Subsidio',
  otro: 'Otro',
};

export default function ServicesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'programs'>('appointments');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    service_type: '',
    preferred_date: '',
    preferred_time: '',
    notes: '',
  });
  const [bookingErrors, setBookingErrors] = useState<{
    service_type?: string;
    preferred_date?: string;
    preferred_time?: string;
    notes?: string;
  }>({});

  const validateAndSubmitBooking = () => {
    const errors: typeof bookingErrors = {};

    const typeResult = appointmentBookingSchema.shape.service_type.safeParse(bookingForm.service_type);
    if (!typeResult.success) {
      errors.service_type = typeResult.error.issues[0]?.message ?? 'Tipo de servicio requerido';
    }

    const dateResult = appointmentBookingSchema.shape.preferred_date.safeParse(bookingForm.preferred_date);
    if (!dateResult.success) {
      errors.preferred_date = dateResult.error.issues[0]?.message ?? 'La fecha es requerida';
    }

    const timeResult = appointmentBookingSchema.shape.preferred_time.safeParse(bookingForm.preferred_time);
    if (!timeResult.success) {
      errors.preferred_time = timeResult.error.issues[0]?.message ?? 'La hora es requerida';
    }

    if (bookingForm.notes) {
      const notesResult = appointmentBookingSchema.shape.notes.safeParse(bookingForm.notes);
      if (!notesResult.success) {
        errors.notes = notesResult.error.issues[0]?.message ?? 'Notas no validas';
      }
    }

    setBookingErrors(errors);

    if (Object.keys(errors).length > 0) return;

    alert('Cita agendada exitosamente.\n\n(En produccion, esto crearia la cita en el sistema de agendamiento.)');
    setShowBookingForm(false);
    setBookingForm({ service_type: '', preferred_date: '', preferred_time: '', notes: '' });
    setBookingErrors({});
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-colombia-blue" />
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Cargando servicios...
          </p>
        </div>
      </div>
    );
  }

  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = mockAppointments.filter(
    (a) => daysUntil(a.date) < 0 || a.status === 'cancelled'
  );

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark pb-20">
      {/* ── Header ── */}
      <div className="bg-white dark:bg-gray-800 px-4 pt-12 pb-0 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} className="text-text-primary dark:text-text-primary-dark" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
              Servicios
            </h1>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              Citas, programas y tramites
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'appointments'
                ? 'border-colombia-blue text-colombia-blue dark:border-colombia-yellow dark:text-colombia-yellow'
                : 'border-transparent text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Calendar size={15} />
              Citas
              {upcomingAppointments.length > 0 && (
                <span className="w-5 h-5 text-[10px] font-bold rounded-full bg-colombia-blue text-white flex items-center justify-center">
                  {upcomingAppointments.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'programs'
                ? 'border-colombia-blue text-colombia-blue dark:border-colombia-yellow dark:text-colombia-yellow'
                : 'border-transparent text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <HandCoins size={15} />
              Programas
            </div>
          </button>
        </div>
      </div>

      {/* ── Appointments Tab ── */}
      {activeTab === 'appointments' && (
        <div className="px-4 mt-4 space-y-4">
          {/* Book appointment CTA */}
          {!showBookingForm && (
            <Button
              variant="primary"
              fullWidth
              size="lg"
              leftIcon={CalendarPlus}
              onClick={() => setShowBookingForm(true)}
            >
              Agendar Nueva Cita
            </Button>
          )}

          {/* Booking form */}
          {showBookingForm && (
            <Card variant="elevated" className="border-2 border-colombia-blue/20">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
                    Agendar Nueva Cita
                  </h3>
                  <button
                    onClick={() => {
                      setShowBookingForm(false);
                      setBookingErrors({});
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X size={16} className="text-text-secondary dark:text-text-secondary-dark" />
                  </button>
                </div>

                {/* Service type */}
                <div>
                  <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1.5">
                    Tipo de Servicio <span className="text-colombia-red">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={bookingForm.service_type}
                      onChange={(e) => {
                        setBookingForm({ ...bookingForm, service_type: e.target.value });
                        if (bookingErrors.service_type) setBookingErrors((prev) => ({ ...prev, service_type: undefined }));
                      }}
                      aria-invalid={bookingErrors.service_type ? true : undefined}
                      className={`w-full h-10 px-3 pr-8 rounded-lg border bg-white dark:bg-gray-800 text-sm text-text-primary dark:text-text-primary-dark appearance-none focus:outline-none focus:ring-2 ${
                        bookingErrors.service_type
                          ? 'border-colombia-red focus:ring-colombia-red/30'
                          : 'border-gray-200 dark:border-gray-600 focus:ring-colombia-blue/30'
                      }`}
                    >
                      <option value="">Seleccionar servicio...</option>
                      {SERVICE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {SERVICE_TYPE_LABELS[type] || type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  {bookingErrors.service_type && (
                    <p className="text-xs text-colombia-red font-medium mt-1" role="alert">{bookingErrors.service_type}</p>
                  )}
                </div>

                {/* Preferred date */}
                <Input
                  label="Fecha Preferida"
                  type="date"
                  value={bookingForm.preferred_date}
                  onChange={(e) => {
                    setBookingForm({ ...bookingForm, preferred_date: e.target.value });
                    if (bookingErrors.preferred_date) setBookingErrors((prev) => ({ ...prev, preferred_date: undefined }));
                  }}
                  error={bookingErrors.preferred_date}
                  inputSize="md"
                />

                {/* Preferred time */}
                <Input
                  label="Hora Preferida"
                  type="time"
                  value={bookingForm.preferred_time}
                  onChange={(e) => {
                    setBookingForm({ ...bookingForm, preferred_time: e.target.value });
                    if (bookingErrors.preferred_time) setBookingErrors((prev) => ({ ...prev, preferred_time: undefined }));
                  }}
                  error={bookingErrors.preferred_time}
                  inputSize="md"
                />

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1.5">
                    Notas (opcional)
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => {
                      setBookingForm({ ...bookingForm, notes: e.target.value });
                      if (bookingErrors.notes) setBookingErrors((prev) => ({ ...prev, notes: undefined }));
                    }}
                    placeholder="Informacion adicional sobre tu cita..."
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-sm text-text-primary dark:text-text-primary-dark placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 resize-none ${
                      bookingErrors.notes
                        ? 'border-colombia-red focus:ring-colombia-red/30'
                        : 'border-gray-200 dark:border-gray-600 focus:ring-colombia-blue/30'
                    }`}
                  />
                  {bookingErrors.notes && (
                    <p className="text-xs text-colombia-red font-medium mt-1" role="alert">{bookingErrors.notes}</p>
                  )}
                </div>

                <Button variant="primary" fullWidth leftIcon={Send} onClick={validateAndSubmitBooking}>
                  Confirmar Cita
                </Button>
              </div>
            </Card>
          )}

          {/* Upcoming */}
          {upcomingAppointments.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-text-primary dark:text-text-primary-dark mb-3">
                Proximas Citas
              </h2>
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          {pastAppointments.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-text-secondary dark:text-text-secondary-dark mb-3">
                Historial
              </h2>
              <div className="space-y-3">
                {pastAppointments.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            </div>
          )}

          {upcomingAppointments.length === 0 && pastAppointments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Calendar size={48} className="text-gray-300 mb-3" />
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                No tienes citas registradas
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Programs Tab ── */}
      {activeTab === 'programs' && (
        <div className="px-4 mt-4 space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card variant="elevated" padding="md">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {mockSocialPrograms.filter((p) => p.status === 'active').length}
                </p>
                <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">
                  Programas Activos
                </p>
              </div>
            </Card>
            <Card variant="elevated" padding="md">
              <div className="text-center">
                <p className="text-2xl font-bold text-colombia-blue">
                  {mockSocialPrograms.length}
                </p>
                <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">
                  Total Inscritos
                </p>
              </div>
            </Card>
          </div>

          {/* Programs list */}
          <div>
            <h2 className="text-sm font-bold text-text-primary dark:text-text-primary-dark mb-3">
              Mis Programas Sociales
            </h2>
            <div className="space-y-3">
              {mockSocialPrograms.map((program) => (
                <SocialProgramCard key={program.id} program={program} />
              ))}
            </div>
          </div>

          {/* Procedure tracking placeholder */}
          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <ClipboardList size={20} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                  Seguimiento de Tramites
                </p>
                <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                  Consulta el estado de tus tramites en curso
                </p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </Card>

          {/* Info note */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Landmark size={16} className="text-colombia-blue flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Informacion de programas sociales sincronizada con el Departamento para la
              Prosperidad Social (DPS) y el DNP (SISBEN).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
