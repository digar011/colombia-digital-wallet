'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Settings,
  User,
  Bell,
  FileText,
  Shield,
  ScrollText,
  ChevronRight,
  Save,
  CheckCircle2,
  Clock,
  Search,
  Download,
  Eye,
  EyeOff,
  Copy,
  Edit3,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCountry } from '@/lib/contexts/CountryContext';
import {
  agencyAuditLogs,
  agencyTemplates,
  formatAgencyDateTime,
  formatAgencyDate,
  isValidAgencyKey,
  type AgencyKey,
} from '@/lib/mock/agencyData';

// ─── Settings Tab Type ──────────────────────────────────────────────────────

type SettingsTab = 'general' | 'personal' | 'notificaciones' | 'plantillas' | 'seguridad' | 'auditoria';

const NAV: { id: SettingsTab; label: string; icon: LucideIcon }[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { id: 'plantillas', label: 'Plantillas', icon: FileText },
  { id: 'seguridad', label: 'Seguridad', icon: Shield },
  { id: 'auditoria', label: 'Auditoria', icon: ScrollText },
];

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AgencySettingsPage() {
  const params = useParams();
  const { country } = useCountry();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<SettingsTab>('general');
  const [saved, setSaved] = useState(false);
  const [auditQ, setAuditQ] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const agencyKey = (params?.agencyKey as string) || 'identity';
  const validKey: AgencyKey = isValidAgencyKey(agencyKey) ? agencyKey : 'identity';

  const agency = country.agencies[validKey];
  const auditLog = agencyAuditLogs[validKey] || [];
  const templates = agencyTemplates[validKey] || [];

  // ── Form states ────────────────────────────────────────────
  const [generalForm, setGeneralForm] = useState({
    agencyName: agency?.name || '',
    contactEmail: `contacto@${agency?.shortName?.toLowerCase() || 'agencia'}.gov.co`,
    phone: '+57 601 328 2000',
    address: 'Avenida El Dorado CAN, Bogota D.C.',
    website: agency?.website || '',
  });

  const [personalForm, setPersonalForm] = useState({
    nombre: 'Carlos Alberto Gomez',
    cargo: 'Funcionario de Atencion',
    correo: `carlos.gomez@${agency?.shortName?.toLowerCase() || 'agencia'}.gov.co`,
    telefono: '+57 310 234 5678',
  });

  const [notifications, setNotifications] = useState({
    emailNuevasSolicitudes: true,
    smsNuevasSolicitudes: false,
    pushNuevasSolicitudes: true,
    emailDocumentosExpirados: true,
    smsDocumentosExpirados: true,
    pushDocumentosExpirados: true,
    emailAlertasSistema: true,
    smsAlertasSistema: false,
    pushAlertasSistema: true,
    emailReportesSemanales: true,
    smsReportesSemanales: false,
    pushReportesSemanales: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: '30',
  });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const doSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const auditFiltered = auditQ.trim()
    ? auditLog.filter(
        (l) =>
          l.action.toLowerCase().includes(auditQ.toLowerCase()) ||
          l.performedBy.toLowerCase().includes(auditQ.toLowerCase()) ||
          l.details.toLowerCase().includes(auditQ.toLowerCase())
      )
    : auditLog;

  const maskedApiKey = 'sk-ag-****-****-****-************';
  const realApiKey = 'sk-ag-7f3a92bc-d4e5-6789-abcd-ef0123456789';

  // ── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-4 gap-6">
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="col-span-3 bg-white rounded-xl shadow-md h-96 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Configuracion - {agency?.shortName || validKey}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Gestionar configuracion de la agencia y preferencias
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Configuracion guardada exitosamente</span>
          </div>
        )}
      </div>

      {/* ── Layout: Sidebar + Content ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card variant="elevated">
            <CardBody className="!p-2">
              <nav className="space-y-0.5">
                {NAV.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        tab === item.id
                          ? 'bg-colombia-blue/10 text-colombia-blue'
                          : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          tab === item.id ? 'text-colombia-blue' : 'text-gray-400'
                        }`}
                      />
                      <p className="text-sm font-medium truncate flex-1">{item.label}</p>
                      {tab === item.id && <ChevronRight className="w-3 h-3 flex-shrink-0" />}
                    </button>
                  );
                })}
              </nav>
            </CardBody>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* ─── General Tab ─────────────────────────────── */}
          {tab === 'general' && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Informacion General</CardTitle>
                <CardDescription>
                  Datos de contacto y configuracion basica de la agencia
                </CardDescription>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Nombre de la Agencia
                      </label>
                      <input
                        type="text"
                        value={generalForm.agencyName}
                        onChange={(e) =>
                          setGeneralForm({ ...generalForm, agencyName: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Correo de Contacto
                      </label>
                      <input
                        type="email"
                        value={generalForm.contactEmail}
                        onChange={(e) =>
                          setGeneralForm({ ...generalForm, contactEmail: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Telefono
                      </label>
                      <input
                        type="tel"
                        value={generalForm.phone}
                        onChange={(e) =>
                          setGeneralForm({ ...generalForm, phone: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Direccion
                      </label>
                      <input
                        type="text"
                        value={generalForm.address}
                        onChange={(e) =>
                          setGeneralForm({ ...generalForm, address: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Sitio Web
                      </label>
                      <input
                        type="url"
                        value={generalForm.website}
                        onChange={(e) =>
                          setGeneralForm({ ...generalForm, website: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <div className="flex items-center gap-2 ml-auto">
                  <Button variant="ghost" size="sm">
                    Cancelar
                  </Button>
                  <Button variant="primary" size="sm" leftIcon={Save} onClick={doSave}>
                    Guardar Cambios
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {/* ─── Personal Tab ────────────────────────────── */}
          {tab === 'personal' && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Perfil del Funcionario</CardTitle>
                <CardDescription>
                  Informacion personal del funcionario actual
                </CardDescription>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={personalForm.nombre}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, nombre: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Cargo
                      </label>
                      <input
                        type="text"
                        value={personalForm.cargo}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, cargo: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Correo Electronico
                      </label>
                      <input
                        type="email"
                        value={personalForm.correo}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, correo: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Telefono
                      </label>
                      <input
                        type="tel"
                        value={personalForm.telefono}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, telefono: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <div className="flex items-center gap-2 ml-auto">
                  <Button variant="ghost" size="sm">
                    Cancelar
                  </Button>
                  <Button variant="primary" size="sm" leftIcon={Save} onClick={doSave}>
                    Guardar Cambios
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {/* ─── Notificaciones Tab ──────────────────────── */}
          {tab === 'notificaciones' && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Configuracion de Notificaciones</CardTitle>
                <CardDescription>
                  Configurar como y cuando se envian las notificaciones
                </CardDescription>
              </CardHeader>
              <CardBody>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider py-3 pr-4">
                          Evento
                        </th>
                        {['Correo', 'SMS', 'Push'].map((h) => (
                          <th
                            key={h}
                            className="text-center text-xs font-semibold text-text-secondary uppercase tracking-wider py-3 px-4 w-20"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {([
                        { event: 'Nuevas solicitudes', keyPrefix: 'NuevasSolicitudes' },
                        { event: 'Documentos expirados', keyPrefix: 'DocumentosExpirados' },
                        { event: 'Alertas del sistema', keyPrefix: 'AlertasSistema' },
                        { event: 'Reportes semanales', keyPrefix: 'ReportesSemanales' },
                      ] as const).map((row) => (
                        <tr key={row.keyPrefix}>
                          <td className="py-3 pr-4">
                            <p className="text-sm font-medium text-text-primary">{row.event}</p>
                          </td>
                          {(['email', 'sms', 'push'] as const).map((ch) => {
                            const key = `${ch}${row.keyPrefix}` as keyof typeof notifications;
                            return (
                              <td key={ch} className="py-3 px-4 text-center">
                                <button
                                  onClick={() =>
                                    setNotifications({
                                      ...notifications,
                                      [key]: !notifications[key],
                                    })
                                  }
                                  className={`relative w-11 h-6 rounded-full transition-colors ${
                                    notifications[key] ? 'bg-colombia-blue' : 'bg-gray-300'
                                  }`}
                                >
                                  <span
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                      notifications[key] ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
              <CardFooter>
                <div className="flex items-center gap-2 ml-auto">
                  <Button variant="ghost" size="sm">
                    Restablecer Valores
                  </Button>
                  <Button variant="primary" size="sm" leftIcon={Save} onClick={doSave}>
                    Guardar Cambios
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {/* ─── Plantillas Tab ──────────────────────────── */}
          {tab === 'plantillas' && (
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Plantillas de Documentos</CardTitle>
                    <CardDescription>
                      Gestionar plantillas de documentos de la agencia
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="!p-0">
                <div className="divide-y divide-gray-100">
                  {templates.map((tpl) => (
                    <div
                      key={tpl.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-lg ${
                            tpl.active
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-text-primary">{tpl.name}</p>
                            <Badge status={tpl.active ? 'active' : 'default'} size="sm">
                              {tpl.active ? 'Activo' : 'Inactivo'}
                            </Badge>
                            <code className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-text-secondary">
                              v{tpl.version}
                            </code>
                          </div>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {tpl.fieldsCount} campos &middot; Actualizado{' '}
                            {formatAgencyDate(tpl.lastUpdated)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <Button variant="ghost" size="sm" leftIcon={Eye}>
                          Vista previa
                        </Button>
                        <Button variant="ghost" size="sm" leftIcon={Edit3}>
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* ─── Seguridad Tab ───────────────────────────── */}
          {tab === 'seguridad' && (
            <div className="space-y-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Configuracion de Seguridad</CardTitle>
                  <CardDescription>
                    Opciones de seguridad y autenticacion de la cuenta
                  </CardDescription>
                </CardHeader>
                <CardBody>
                  <div className="space-y-6">
                    {/* 2FA Toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          Autenticacion de Dos Factores (2FA)
                        </p>
                        <p className="text-xs text-text-secondary">
                          Agregar una capa adicional de seguridad a su cuenta
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setSecurity({ ...security, twoFactor: !security.twoFactor })
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          security.twoFactor ? 'bg-colombia-blue' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            security.twoFactor ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Session Timeout */}
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Tiempo de Sesion (minutos)
                      </label>
                      <input
                        type="number"
                        value={security.sessionTimeout}
                        onChange={(e) =>
                          setSecurity({ ...security, sessionTimeout: e.target.value })
                        }
                        className="w-full max-w-xs h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                      />
                      <p className="text-[10px] text-text-secondary mt-1">
                        La sesion se cerrara automaticamente despues de este periodo de inactividad
                      </p>
                    </div>

                    {/* Change Password */}
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-3">
                        Cambiar Contrasena
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1.5">
                            Contrasena Actual
                          </label>
                          <input
                            type="password"
                            placeholder="Ingrese contrasena actual"
                            className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                          />
                        </div>
                        <div />
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1.5">
                            Nueva Contrasena
                          </label>
                          <input
                            type="password"
                            placeholder="Ingrese nueva contrasena"
                            className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1.5">
                            Confirmar Nueva Contrasena
                          </label>
                          <input
                            type="password"
                            placeholder="Confirme nueva contrasena"
                            className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                          />
                        </div>
                      </div>
                    </div>

                    {/* API Key */}
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-3">
                        Clave API de la Agencia
                      </h4>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-3 py-1.5 rounded-md font-mono text-text-secondary flex-1">
                          {showApiKey ? realApiKey : maskedApiKey}
                        </code>
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                        >
                          {showApiKey ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <button className="p-1.5 rounded hover:bg-gray-100 transition-colors">
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                      <p className="text-[10px] text-text-secondary mt-1">
                        Use esta clave para integrar sistemas externos con la agencia
                      </p>
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <div className="flex items-center gap-2 ml-auto">
                    <Button variant="ghost" size="sm">
                      Cancelar
                    </Button>
                    <Button variant="primary" size="sm" leftIcon={Save} onClick={doSave}>
                      Guardar Cambios
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* ─── Auditoria Tab ───────────────────────────── */}
          {tab === 'auditoria' && (
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Registro de Auditoria</CardTitle>
                    <CardDescription>
                      Rastrear todas las acciones de la agencia y eventos del sistema
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" leftIcon={Download}>
                    Exportar Registro
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <div className="mb-4">
                  <Input
                    placeholder="Buscar en registro de auditoria..."
                    leftIcon={Search}
                    value={auditQ}
                    onChange={(e) => setAuditQ(e.target.value)}
                    inputSize="sm"
                  />
                </div>
                <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
                  {auditFiltered.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <ScrollText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-text-secondary">
                        No se encontraron entradas de auditoria
                      </p>
                    </div>
                  ) : (
                    auditFiltered.map((entry, i) => (
                      <div
                        key={entry.id}
                        className={`flex items-start gap-3 px-4 py-3 ${
                          i !== auditFiltered.length - 1 ? 'border-b border-gray-100' : ''
                        } hover:bg-gray-50 transition-colors`}
                      >
                        <div className="mt-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              status={
                                entry.action.includes('RECHAZ') || entry.action.includes('REVOC')
                                  ? 'revoked'
                                  : entry.action.includes('APROBAD') ||
                                      entry.action.includes('EMITID') ||
                                      entry.action.includes('COMPLET')
                                    ? 'active'
                                    : 'info'
                              }
                              size="sm"
                            >
                              {entry.action.replace(/_/g, ' ')}
                            </Badge>
                            <span className="text-xs text-text-secondary">
                              por {entry.performedBy}
                            </span>
                          </div>
                          <p className="text-xs text-text-primary mt-1">{entry.details}</p>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-text-secondary">
                            <span>{formatAgencyDateTime(entry.timestamp)}</span>
                            <span>IP: {entry.ipAddress}</span>
                            <span>Objetivo: {entry.target}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
