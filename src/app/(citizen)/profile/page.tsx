'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  BadgeCheck,
  Bell,
  Lock,
  Fingerprint,
  Globe,
  Info,
  LogOut,
  ChevronRight,
  Shield,
  Smartphone,
  Moon,
  Sun,
  Loader2,
  Camera,
  Mail,
  Phone,
  MapPin,
  IdCard,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockCitizen, mockNotifications } from '@/lib/mock/citizenData';

// ─── Settings Row ────────────────────────────────────────────────────────────

function SettingsRow({
  icon: Icon,
  label,
  description,
  onClick,
  rightElement,
  danger = false,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left rounded-lg"
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
          danger ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-700'
        }`}
      >
        <Icon
          size={18}
          className={danger ? 'text-colombia-red' : 'text-text-secondary dark:text-text-secondary-dark'}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            danger
              ? 'text-colombia-red'
              : 'text-text-primary dark:text-text-primary-dark'
          }`}
        >
          {label}
        </p>
        {description && (
          <p className="text-[11px] text-text-secondary dark:text-text-secondary-dark mt-0.5">
            {description}
          </p>
        )}
      </div>
      {rightElement || (
        <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
      )}
    </button>
  );
}

// ─── Toggle Switch ───────────────────────────────────────────────────────────

function ToggleSwitch({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      data-testid="biometric-toggle"
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
        enabled ? 'bg-colombia-blue' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ─── Profile Page ────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    const confirmed = confirm('Estas seguro de que deseas cerrar sesion?');
    if (confirmed) {
      alert('Sesion cerrada.\n\n(En produccion, esto eliminaria la sesion y redigiria al login.)');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-colombia-blue" />
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark pb-20">
      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-colombia-blue to-colombia-blue-dark px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Mi Perfil</h1>
        </div>

        {/* Avatar and name */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-colombia-yellow flex items-center justify-center text-colombia-blue font-bold text-3xl shadow-lg">
              {mockCitizen.firstName[0]}
              {mockCitizen.firstLastName[0]}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Camera size={14} className="text-colombia-blue" />
            </button>
            {/* Verification check */}
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center border-2 border-white">
              <BadgeCheck size={14} className="text-white" />
            </div>
          </div>
          <h2 className="text-white text-lg font-bold mt-3">
            {mockCitizen.fullName}
          </h2>
          <p className="text-white/70 text-sm">
            CC {mockCitizen.documentNumber}
          </p>
        </div>
      </div>

      <div className="px-4 -mt-3 space-y-4">
        {/* ── Verification Status ── */}
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <BadgeCheck size={20} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">
                Identidad Verificada
              </p>
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Verificado con la Registraduria Nacional
              </p>
            </div>
            <Badge status="active" size="sm" dot>
              Verificado
            </Badge>
          </div>
        </Card>

        {/* ── Personal Info ── */}
        <Card variant="elevated">
          <CardBody>
            <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark mb-3">
              Informacion Personal
            </h3>
            <div className="space-y-3">
              <ProfileInfoRow
                icon={User}
                label="Nombre Completo"
                value={mockCitizen.fullName}
              />
              <ProfileInfoRow
                icon={IdCard}
                label="Documento"
                value={`CC ${mockCitizen.documentNumber}`}
              />
              <ProfileInfoRow
                icon={Mail}
                label="Correo Electronico"
                value={mockCitizen.email}
              />
              <ProfileInfoRow
                icon={Phone}
                label="Telefono"
                value={mockCitizen.phone}
              />
              <ProfileInfoRow
                icon={MapPin}
                label="Direccion"
                value={`${mockCitizen.address}, ${mockCitizen.city}`}
              />
            </div>
          </CardBody>
        </Card>

        {/* ── Settings ── */}
        <Card variant="elevated">
          <CardBody className="py-1 px-1">
            <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark px-3 pt-3 mb-1">
              Configuracion
            </h3>

            <SettingsRow
              icon={Bell}
              label="Notificaciones"
              description={`${unreadCount} sin leer`}
              rightElement={
                <ToggleSwitch
                  enabled={notificationsEnabled}
                  onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
                />
              }
            />

            <SettingsRow
              icon={Lock}
              label="Seguridad"
              description="Contrasena, PIN y opciones de acceso"
              onClick={() =>
                alert('Opciones de seguridad.\n\n(En produccion se abre la configuracion de seguridad.)')
              }
            />

            <SettingsRow
              icon={Fingerprint}
              label="Autenticacion Biometrica"
              description="Desbloquear con huella digital o rostro"
              rightElement={
                <ToggleSwitch
                  enabled={biometricEnabled}
                  onToggle={() => setBiometricEnabled(!biometricEnabled)}
                />
              }
            />

            <SettingsRow
              icon={darkMode ? Sun : Moon}
              label="Modo Oscuro"
              description={darkMode ? 'Activado' : 'Desactivado'}
              rightElement={
                <ToggleSwitch
                  enabled={darkMode}
                  onToggle={() => setDarkMode(!darkMode)}
                />
              }
            />

            <SettingsRow
              icon={Globe}
              label="Idioma"
              description="Espanol (Colombia)"
              onClick={() =>
                alert('Cambio de idioma.\n\n(En produccion se abre el selector de idioma.)')
              }
            />

            <SettingsRow
              icon={Smartphone}
              label="Dispositivos Vinculados"
              description="1 dispositivo activo"
              onClick={() =>
                alert('Gestion de dispositivos.\n\n(En produccion se muestran los dispositivos vinculados.)')
              }
            />
          </CardBody>
        </Card>

        {/* ── About & Help ── */}
        <Card variant="elevated">
          <CardBody className="py-1 px-1">
            <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark px-3 pt-3 mb-1">
              Acerca de
            </h3>

            <SettingsRow
              icon={HelpCircle}
              label="Centro de Ayuda"
              description="Preguntas frecuentes y soporte"
              onClick={() =>
                alert('Centro de ayuda.\n\n(En produccion se abre la pagina de soporte.)')
              }
            />

            <SettingsRow
              icon={FileText}
              label="Terminos y Condiciones"
              onClick={() =>
                alert('Terminos y condiciones.\n\n(En produccion se abre el documento legal.)')
              }
            />

            <SettingsRow
              icon={Shield}
              label="Politica de Privacidad"
              onClick={() =>
                alert('Politica de privacidad.\n\n(En produccion se abre el documento legal.)')
              }
            />

            <SettingsRow
              icon={Info}
              label="Version de la App"
              rightElement={
                <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                  v0.1.0-beta
                </span>
              }
            />
          </CardBody>
        </Card>

        {/* ── Logout ── */}
        <Card variant="elevated">
          <CardBody className="py-1 px-1">
            <SettingsRow
              icon={LogOut}
              label="Cerrar Sesion"
              description="Salir de tu cuenta"
              danger
              onClick={handleLogout}
            />
          </CardBody>
        </Card>

        {/* ── Government info ── */}
        <div className="text-center py-4">
          <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark">
            Billetera Digital de Colombia
          </p>
          <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark mt-0.5">
            MinTIC &middot; Gobierno de Colombia
          </p>
          <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark mt-0.5">
            Version 0.1.0-beta
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Info Row ────────────────────────────────────────────────────────

function ProfileInfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-1">
      <Icon size={16} className="text-text-secondary dark:text-text-secondary-dark flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
