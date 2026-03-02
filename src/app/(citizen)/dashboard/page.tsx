'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  IdCard,
  Car,
  HeartPulse,
  FileText,
  Users,
  Bell,
  Calendar,
  ChevronRight,
  Shield,
  Landmark,
  Phone,
  MapPin,
  Video,
  Loader2,
  BadgeCheck,
  HandCoins,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  mockCitizen,
  mockDocuments,
  getGreeting,
  getUpcomingAppointments,
  getUnreadNotificationCount,
  getActivePrograms,
  formatShortDate,
  daysUntil,
} from '@/lib/mock/citizenData';
import type { DocumentRecord, AppointmentRecord, SocialProgramRecord } from '@/lib/mock/citizenData';

// ─── Quick Action Item ────────────────────────────────────────────────────────

interface QuickAction {
  label: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bgColor: string;
}

const quickActions: QuickAction[] = [
  {
    label: 'Mi Cedula',
    icon: IdCard,
    href: '/documents/identity',
    color: 'text-colombia-blue',
    bgColor: 'bg-colombia-blue/10',
  },
  {
    label: 'Vehiculos',
    icon: Car,
    href: '/documents/vehicles',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    label: 'Salud',
    icon: HeartPulse,
    href: '/documents/health',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
  {
    label: 'Impuestos',
    icon: FileText,
    href: '/documents/work',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    label: 'Familia',
    icon: Users,
    href: '/documents/family',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
  },
  {
    label: 'Servicios',
    icon: Landmark,
    href: '/services',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  {
    label: 'Emergencia',
    icon: Phone,
    href: '/emergency',
    color: 'text-colombia-red',
    bgColor: 'bg-red-50',
  },
  {
    label: 'Perfil',
    icon: Shield,
    href: '/profile',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
];

// ─── Document Card for Carousel ──────────────────────────────────────────────

function DocumentCarouselCard({ doc }: { doc: DocumentRecord }) {
  const router = useRouter();

  const categoryRoutes: Record<string, string> = {
    identity: '/documents/identity',
    vehicle: '/documents/vehicles',
    tax: '/documents/work',
    health: '/documents/health',
  };

  const categoryColors: Record<string, string> = {
    identity: 'from-colombia-blue to-colombia-blue-dark',
    vehicle: 'from-emerald-500 to-emerald-700',
    tax: 'from-amber-500 to-amber-700',
    health: 'from-rose-500 to-rose-700',
  };

  return (
    <button
      onClick={() => router.push(categoryRoutes[doc.category] || '/documents')}
      className="flex-shrink-0 w-56 group focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 rounded-xl"
    >
      <Card variant="elevated" className="h-full">
        <div
          className={`h-24 bg-gradient-to-br ${categoryColors[doc.category]} rounded-t-xl p-4 flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/90 text-xs font-medium uppercase tracking-wider">
              {doc.shortName}
            </span>
            <Badge
              status={doc.status === 'active' || doc.status === 'valid' ? 'active' : doc.status === 'expiring' ? 'expiring' : 'expired'}
              size="sm"
            >
              {doc.status === 'active' ? 'Vigente' : doc.status === 'expiring' ? 'Por vencer' : 'Vencido'}
            </Badge>
          </div>
          <p className="text-white font-bold text-sm truncate">{doc.name}</p>
        </div>
        <CardBody className="py-3 px-4">
          <p className="text-xs text-text-secondary dark:text-text-secondary-dark truncate">
            No. {doc.documentNumber}
          </p>
          {doc.expiryDate && (
            <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark mt-1">
              Vence: {formatShortDate(doc.expiryDate)}
            </p>
          )}
        </CardBody>
      </Card>
    </button>
  );
}

// ─── Appointment Row ─────────────────────────────────────────────────────────

function AppointmentRow({ appointment }: { appointment: AppointmentRecord }) {
  const router = useRouter();
  const days = daysUntil(appointment.date);
  const isVirtual = appointment.type === 'virtual';

  return (
    <button
      onClick={() => router.push('/services')}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-colombia-blue/30"
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isVirtual ? 'bg-violet-50 text-violet-600' : 'bg-colombia-blue/10 text-colombia-blue'
        }`}
      >
        {isVirtual ? <Video size={18} /> : <MapPin size={18} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark truncate">
          {appointment.title}
        </p>
        <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
          {appointment.entity} &middot; {appointment.time}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs font-semibold text-colombia-blue dark:text-colombia-yellow">
          {days === 0 ? 'Hoy' : days === 1 ? 'Manana' : `${days} dias`}
        </p>
        <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark">
          {formatShortDate(appointment.date)}
        </p>
      </div>
    </button>
  );
}

// ─── Social Program Summary ──────────────────────────────────────────────────

function ProgramSummaryRow({ program }: { program: SocialProgramRecord }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/services')}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-colombia-blue/30"
    >
      <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
        <HandCoins size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark truncate">
          {program.name}
        </p>
        <p className="text-xs text-text-secondary dark:text-text-secondary-dark truncate">
          {program.details}
        </p>
      </div>
      <Badge status={program.status === 'active' ? 'active' : 'default'} size="sm" dot>
        {program.status === 'active' ? 'Activo' : 'Inactivo'}
      </Badge>
    </button>
  );
}

// ─── Main Dashboard Page ─────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  const unreadCount = getUnreadNotificationCount();
  const upcomingAppointments = getUpcomingAppointments();
  const activePrograms = getActivePrograms();

  useEffect(() => {
    setGreeting(getGreeting());
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark" role="status" aria-label="Cargando panel principal">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-colombia-blue" aria-hidden="true" />
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Cargando tu informacion...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark pb-20">
      {/* ── Header / Greeting ── */}
      <div className="bg-gradient-to-br from-colombia-blue to-colombia-blue-dark px-4 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-colombia-yellow flex items-center justify-center text-colombia-blue font-bold text-lg">
              {mockCitizen.firstName[0]}
              {mockCitizen.firstLastName[0]}
            </div>
            <div>
              <p className="text-colombia-yellow text-sm font-medium">
                {greeting},
              </p>
              <h1 className="text-white text-lg font-bold">
                {mockCitizen.firstName} {mockCitizen.firstLastName}
              </h1>
            </div>
          </div>
          <button
            onClick={() => router.push('/profile')}
            className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`}
          >
            <Bell size={20} className="text-white" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-colombia-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Verification badge */}
        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 mt-2">
          <BadgeCheck size={16} className="text-colombia-yellow" />
          <span className="text-white/90 text-xs">
            Identidad verificada &middot; CC {mockCitizen.documentNumber}
          </span>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="px-4 -mt-4">
        <Card variant="elevated" padding="md">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/documents')}
              className="flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 rounded-lg"
              aria-label={`${mockDocuments.length} Documentos`}
            >
              <div className="w-10 h-10 rounded-full bg-colombia-blue/10 flex items-center justify-center">
                <FileText size={18} className="text-colombia-blue" />
              </div>
              <span className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
                {mockDocuments.length}
              </span>
              <span className="text-[10px] text-text-secondary dark:text-text-secondary-dark">
                Documentos
              </span>
            </button>
            <button
              onClick={() => router.push('/services')}
              className="flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 rounded-lg"
              aria-label={`${upcomingAppointments.length} Citas`}
            >
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <Calendar size={18} className="text-amber-600" />
              </div>
              <span className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
                {upcomingAppointments.length}
              </span>
              <span className="text-[10px] text-text-secondary dark:text-text-secondary-dark">
                Citas
              </span>
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 rounded-lg"
              aria-label={`${unreadCount} Alertas`}
            >
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <Bell size={18} className="text-rose-600" />
              </div>
              <span className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
                {unreadCount}
              </span>
              <span className="text-[10px] text-text-secondary dark:text-text-secondary-dark">
                Alertas
              </span>
            </button>
          </div>
        </Card>
      </div>

      {/* ── Recent Documents Carousel ── */}
      <div className="mt-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-base font-bold text-text-primary dark:text-text-primary-dark">
            Mis Documentos
          </h2>
          <button
            onClick={() => router.push('/documents')}
            className="text-xs text-colombia-blue dark:text-colombia-yellow font-medium flex items-center gap-1 hover:underline"
          >
            Ver todos <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {mockDocuments.map((doc) => (
            <DocumentCarouselCard key={doc.id} doc={doc} />
          ))}
        </div>
      </div>

      {/* ── Quick Actions Grid ── */}
      <div className="mt-6 px-4">
        <h2 className="text-base font-bold text-text-primary dark:text-text-primary-dark mb-3">
          Acciones Rapidas
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => router.push(action.href)}
              className="flex flex-col items-center gap-2 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-colombia-blue/30"
            >
              <div
                className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center`}
              >
                <action.icon size={22} className={action.color} />
              </div>
              <span className="text-[11px] font-medium text-text-primary dark:text-text-primary-dark text-center leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Upcoming Appointments ── */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-text-primary dark:text-text-primary-dark">
            Proximas Citas
          </h2>
          <button
            onClick={() => router.push('/services')}
            className="text-xs text-colombia-blue dark:text-colombia-yellow font-medium flex items-center gap-1 hover:underline"
          >
            Ver todas <ChevronRight size={14} />
          </button>
        </div>
        <Card variant="elevated" padding="sm">
          {upcomingAppointments.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {upcomingAppointments.slice(0, 3).map((apt) => (
                <AppointmentRow key={apt.id} appointment={apt} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Calendar size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                No tienes citas programadas
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* ── Social Programs ── */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-text-primary dark:text-text-primary-dark">
            Programas Sociales
          </h2>
          <button
            onClick={() => router.push('/services')}
            className="text-xs text-colombia-blue dark:text-colombia-yellow font-medium flex items-center gap-1 hover:underline"
          >
            Ver todos <ChevronRight size={14} />
          </button>
        </div>
        <Card variant="elevated" padding="sm">
          {activePrograms.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {activePrograms.map((prog) => (
                <ProgramSummaryRow key={prog.id} program={prog} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Landmark size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                No tienes programas activos
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* ── Emergency Quick Access ── */}
      <div className="mt-6 px-4 mb-6">
        <Button
          variant="danger"
          fullWidth
          size="lg"
          leftIcon={Phone}
          onClick={() => router.push('/emergency')}
        >
          Numeros de Emergencia
        </Button>
      </div>
    </div>
  );
}
