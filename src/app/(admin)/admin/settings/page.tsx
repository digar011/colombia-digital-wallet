'use client';

import { useState, useEffect } from 'react';
import {
  Settings, Key, Mail, Bell, Globe, Users, ScrollText,
  Eye, EyeOff, Copy, RotateCcw, Save, Plus, Trash2,
  Shield, ChevronRight, CheckCircle2, AlertTriangle,
  Clock, Search, Download,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockAuditLog, formatDateTime, formatRelativeTime } from '@/lib/mock/adminData';

type SettingsTab = 'system' | 'api-keys' | 'email' | 'notifications' | 'country' | 'roles' | 'audit';

const NAV: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'system', label: 'Sistema', icon: <Settings className="w-4 h-4" /> },
  { id: 'api-keys', label: 'Claves API', icon: <Key className="w-4 h-4" /> },
  { id: 'email', label: 'Plantillas de Correo', icon: <Mail className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notificaciones', icon: <Bell className="w-4 h-4" /> },
  { id: 'country', label: 'Configuración de País', icon: <Globe className="w-4 h-4" /> },
  { id: 'roles', label: 'Roles de Usuario', icon: <Users className="w-4 h-4" /> },
  { id: 'audit', label: 'Registro de Auditoría', icon: <ScrollText className="w-4 h-4" /> },
];

const apiKeysData = [
  { id: 'k1', name: 'Clave API de Producción', key: 'sk-prod-xxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxx', masked: 'sk-prod-****-****-****-************', createdAt: '2025-11-15T10:00:00Z', lastUsed: '2026-02-22T08:45:00Z', status: 'active' as const, perms: ['lectura', 'escritura', 'verificación'] },
  { id: 'k2', name: 'Clave Puente Registraduría', key: 'sk-reg-xxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxx', masked: 'sk-reg-****-****-****-************', createdAt: '2025-12-01T14:30:00Z', lastUsed: '2026-02-22T07:12:00Z', status: 'active' as const, perms: ['lectura', 'verificación'] },
  { id: 'k3', name: 'Clave de Prueba', key: 'sk-test-xxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxx', masked: 'sk-test-****-****-****-************', createdAt: '2026-01-10T09:00:00Z', lastUsed: '2026-02-20T16:30:00Z', status: 'active' as const, perms: ['lectura'] },
  { id: 'k4', name: 'Clave Legada Obsoleta', key: 'sk-old-xxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxx', masked: 'sk-old-****-****-****-************', createdAt: '2024-06-15T11:00:00Z', lastUsed: '2025-08-10T09:00:00Z', status: 'revoked' as const, perms: ['lectura', 'escritura'] },
];

const emailTpls = [
  { id: 't1', name: 'Correo de Bienvenida', subject: 'Bienvenido a la Billetera Digital de Colombia', updated: '2026-02-10', active: true },
  { id: 't2', name: 'Verificación Exitosa', subject: 'Su identidad ha sido verificada exitosamente', updated: '2026-02-08', active: true },
  { id: 't3', name: 'Verificación Fallida', subject: 'Verificación de identidad no aprobada', updated: '2026-02-08', active: true },
  { id: 't4', name: 'Documento Emitido', subject: 'Nuevo documento emitido', updated: '2026-01-25', active: true },
  { id: 't5', name: 'Restablecimiento de Contraseña', subject: 'Restablecimiento de contraseña', updated: '2026-01-20', active: true },
  { id: 't6', name: 'Cuenta Suspendida', subject: 'Su cuenta ha sido suspendida', updated: '2026-01-15', active: false },
  { id: 't7', name: 'Documento por Expirar', subject: 'Su documento expira pronto', updated: '2026-01-10', active: true },
];

const notifRows = [
  { id: 'n1', event: 'Nuevo Registro', email: true, sms: false, push: true, webhook: true },
  { id: 'n2', event: 'Verificación Completada', email: true, sms: true, push: true, webhook: true },
  { id: 'n3', event: 'Documento Emitido', email: true, sms: false, push: true, webhook: false },
  { id: 'n4', event: 'Cuenta Suspendida', email: true, sms: true, push: true, webhook: true },
  { id: 'n5', event: 'Documento por Expirar', email: true, sms: true, push: true, webhook: false },
  { id: 'n6', event: 'Intento de Ingreso Fallido', email: false, sms: false, push: false, webhook: true },
  { id: 'n7', event: 'Clave API Rotada', email: true, sms: false, push: false, webhook: true },
];

const rolesData = [
  { id: 'r1', name: 'Super Administrador', slug: 'super_admin', users: 2, perms: 42, color: 'bg-purple-100 text-purple-700' },
  { id: 'r2', name: 'Administrador', slug: 'admin', users: 5, perms: 35, color: 'bg-blue-100 text-blue-700' },
  { id: 'r3', name: 'Supervisor', slug: 'supervisor', users: 12, perms: 25, color: 'bg-green-100 text-green-700' },
  { id: 'r4', name: 'Operador', slug: 'operador', users: 28, perms: 15, color: 'bg-yellow-100 text-yellow-700' },
  { id: 'r5', name: 'Visor', slug: 'visor', users: 45, perms: 8, color: 'bg-gray-100 text-gray-700' },
];

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<SettingsTab>('system');
  const [showKeys, setShowKeys] = useState<Set<string>>(new Set());
  const [auditQ, setAuditQ] = useState('');
  const [saved, setSaved] = useState(false);
  const [sys, setSys] = useState({ platformName: 'Billetera Digital de Colombia', supportEmail: 'soporte@wallet.gov.co', maxLogin: '5', timeout: '30', maintenance: false, twoFactor: true, autoVerify: false, maxDocs: '20' });
  const [cty, setCty] = useState({ lang: 'es', tz: 'America/Bogota', dateFmt: 'DD/MM/YYYY', phone: '+57', docFmt: 'X.XXX.XXX.XXX', currency: 'COP', multi: false });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const toggleKey = (id: string) => {
    setShowKeys(prev => { const n = new Set(prev); if (n.has(id)) { n.delete(id); } else { n.add(id); } return n; });
  };

  const doSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const auditFiltered = auditQ.trim()
    ? mockAuditLog.filter(l => l.action.toLowerCase().includes(auditQ.toLowerCase()) || l.performedBy.toLowerCase().includes(auditQ.toLowerCase()) || l.details.toLowerCase().includes(auditQ.toLowerCase()))
    : mockAuditLog;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-4 gap-6">
            <div className="space-y-2">{Array.from({ length: 7 }).map((_, i) => (<div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />))}</div>
            <div className="col-span-3 bg-white rounded-xl shadow-md h-96 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-text-primary">Configuración</h1><p className="text-sm text-text-secondary mt-1">Gestionar configuración del sistema y preferencias</p></div>
          {saved && <div role="status" aria-live="polite" className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 animate-fade-in"><CheckCircle2 className="w-4 h-4" aria-hidden="true" /><span className="text-sm font-medium">Configuración guardada exitosamente</span></div>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1"><Card variant="elevated"><CardBody className="!p-2"><nav className="space-y-0.5">{NAV.map(item => (<button key={item.id} onClick={() => setTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${tab === item.id ? 'bg-colombia-blue/10 text-colombia-blue' : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'}`}><span className={tab === item.id ? 'text-colombia-blue' : 'text-gray-400'}>{item.icon}</span><p className="text-sm font-medium truncate flex-1">{item.label}</p>{tab === item.id && <ChevronRight className="w-3 h-3 flex-shrink-0" />}</button>))}</nav></CardBody></Card></div>

          <div className="lg:col-span-3 space-y-6">
            {tab === 'system' && (
              <Card variant="elevated">
                <CardHeader><CardTitle>Configuración del Sistema</CardTitle><CardDescription>Configuración principal de la plataforma y opciones de seguridad</CardDescription></CardHeader>
                <CardBody>
                  <div className="space-y-6">
                    <div><h4 className="text-sm font-semibold text-text-primary mb-3">General</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-xs font-medium text-text-secondary mb-1.5">Nombre de la Plataforma</label><input type="text" value={sys.platformName} onChange={e => setSys({ ...sys, platformName: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue" /></div><div><label className="block text-xs font-medium text-text-secondary mb-1.5">Correo de Soporte</label><input type="email" value={sys.supportEmail} onChange={e => setSys({ ...sys, supportEmail: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue" /></div></div></div>
                    <div><h4 className="text-sm font-semibold text-text-primary mb-3">Seguridad</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-xs font-medium text-text-secondary mb-1.5">Intentos Máximos de Ingreso</label><input type="number" value={sys.maxLogin} onChange={e => setSys({ ...sys, maxLogin: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue" /></div><div><label className="block text-xs font-medium text-text-secondary mb-1.5">Tiempo de Sesión (min)</label><input type="number" value={sys.timeout} onChange={e => setSys({ ...sys, timeout: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue" /></div></div></div>
                    <div><h4 className="text-sm font-semibold text-text-primary mb-3">Funcionalidades</h4><div className="space-y-3">{([{ key: 'maintenance' as const, label: 'Modo de Mantenimiento', desc: 'Deshabilitar la plataforma temporalmente' }, { key: 'twoFactor' as const, label: 'Requerir Autenticación de Dos Factores', desc: 'Aplicar 2FA para todas las cuentas de administrador' }, { key: 'autoVerify' as const, label: 'Auto-Verificación', desc: 'Verificar ciudadanos automáticamente con datos biométricos coincidentes' }]).map(tog => (<div key={tog.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><p className="text-sm font-medium text-text-primary">{tog.label}</p><p className="text-xs text-text-secondary">{tog.desc}</p></div><button onClick={() => setSys({ ...sys, [tog.key]: !sys[tog.key] })} className={`relative w-11 h-6 rounded-full transition-colors ${sys[tog.key] ? 'bg-colombia-blue' : 'bg-gray-300'}`}><span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${sys[tog.key] ? 'translate-x-5' : 'translate-x-0'}`} /></button></div>))}</div></div>
                    <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Máximo de Documentos por Ciudadano</label><input type="number" value={sys.maxDocs} onChange={e => setSys({ ...sys, maxDocs: e.target.value })} className="w-full max-w-xs h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue" /></div>
                  </div>
                </CardBody>
                <CardFooter><div className="flex items-center gap-2 ml-auto"><Button variant="ghost" size="sm">Cancelar</Button><Button variant="primary" size="sm" leftIcon={Save} onClick={doSave}>Guardar Cambios</Button></div></CardFooter>
              </Card>
            )}

            {tab === 'api-keys' && (
              <Card variant="elevated">
                <CardHeader><div className="flex items-center justify-between"><div><CardTitle>Claves API</CardTitle><CardDescription>Gestionar claves API para integraciones externas</CardDescription></div><Button variant="primary" size="sm" leftIcon={Plus}>Generar Nueva Clave</Button></div></CardHeader>
                <CardBody className="!p-0"><div className="divide-y divide-gray-100">{apiKeysData.map(ak => (<div key={ak.id} className="px-6 py-4"><div className="flex items-start justify-between gap-4"><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><p className="text-sm font-semibold text-text-primary">{ak.name}</p><Badge status={ak.status === 'active' ? 'active' : 'revoked'} size="sm" dot>{ak.status === 'active' ? 'activo' : 'revocado'}</Badge></div><div className="mt-2 flex items-center gap-2"><code className="text-xs bg-gray-100 px-3 py-1.5 rounded-md font-mono text-text-secondary">{showKeys.has(ak.id) ? ak.key : ak.masked}</code><button onClick={() => toggleKey(ak.id)} className="p-1 rounded hover:bg-gray-100 transition-colors">{showKeys.has(ak.id) ? <EyeOff className="w-3.5 h-3.5 text-gray-500" /> : <Eye className="w-3.5 h-3.5 text-gray-500" />}</button><button className="p-1 rounded hover:bg-gray-100 transition-colors"><Copy className="w-3.5 h-3.5 text-gray-500" /></button></div><div className="mt-2 flex items-center gap-4 text-[10px] text-text-secondary"><span>Creado: {formatDateTime(ak.createdAt)}</span><span>Último uso: {formatRelativeTime(ak.lastUsed)}</span><span>Permisos: {ak.perms.join(', ')}</span></div></div><div className="flex items-center gap-1 flex-shrink-0">{ak.status === 'active' && <Button variant="ghost" size="sm" leftIcon={RotateCcw}>Rotar</Button>}<Button variant="ghost" size="sm" className={ak.status === 'active' ? '!text-red-600 hover:!bg-red-50' : '!text-gray-400'} leftIcon={Trash2} disabled={ak.status === 'revoked'}>Revocar</Button></div></div></div>))}</div></CardBody>
              </Card>
            )}

            {tab === 'email' && (
              <Card variant="elevated">
                <CardHeader><div className="flex items-center justify-between"><div><CardTitle>Plantillas de Correo</CardTitle><CardDescription>Gestionar plantillas de correo transaccional</CardDescription></div><Button variant="primary" size="sm" leftIcon={Plus}>Nueva Plantilla</Button></div></CardHeader>
                <CardBody className="!p-0"><div className="divide-y divide-gray-100">{emailTpls.map(tpl => (<div key={tpl.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"><div className="flex items-center gap-3 min-w-0"><div className={`p-2 rounded-lg ${tpl.active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}><Mail className="w-4 h-4" /></div><div className="min-w-0"><div className="flex items-center gap-2"><p className="text-sm font-semibold text-text-primary">{tpl.name}</p>{!tpl.active && <Badge status="default" size="sm">Deshabilitado</Badge>}</div><p className="text-xs text-text-secondary truncate mt-0.5">{tpl.subject}</p></div></div><div className="flex items-center gap-3 flex-shrink-0 ml-4"><span className="text-[10px] text-text-secondary">Actualizado {tpl.updated}</span><ChevronRight className="w-4 h-4 text-gray-400" /></div></div>))}</div></CardBody>
              </Card>
            )}

            {tab === 'notifications' && (
              <Card variant="elevated">
                <CardHeader><CardTitle>Configuración de Notificaciones</CardTitle><CardDescription>Configurar cómo y cuándo se envían las notificaciones</CardDescription></CardHeader>
                <CardBody><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-200"><th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider py-3 pr-4">Evento</th>{['Correo', 'SMS', 'Push', 'Webhook'].map(h => (<th key={h} className="text-center text-xs font-semibold text-text-secondary uppercase tracking-wider py-3 px-4 w-20">{h}</th>))}</tr></thead><tbody className="divide-y divide-gray-100">{notifRows.map(n => (<tr key={n.id}><td className="py-3 pr-4"><p className="text-sm font-medium text-text-primary">{n.event}</p></td>{(['email', 'sms', 'push', 'webhook'] as const).map(ch => (<td key={ch} className="py-3 px-4 text-center"><button className={`w-5 h-5 rounded border-2 inline-flex items-center justify-center transition-colors ${n[ch] ? 'bg-colombia-blue border-colombia-blue text-white' : 'border-gray-300 hover:border-gray-400'}`}>{n[ch] && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}</button></td>))}</tr>))}</tbody></table></div></CardBody>
                <CardFooter><div className="flex items-center gap-2 ml-auto"><Button variant="ghost" size="sm">Restablecer Valores</Button><Button variant="primary" size="sm" leftIcon={Save} onClick={doSave}>Guardar Cambios</Button></div></CardFooter>
              </Card>
            )}

            {tab === 'country' && (
              <Card variant="elevated">
                <CardHeader><CardTitle>Configuración de País</CardTitle><CardDescription>Configuración específica de la plataforma para Colombia</CardDescription></CardHeader>
                <CardBody><div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-xs font-medium text-text-secondary mb-1.5">País por Defecto</label><div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm"><span className="text-lg">&#127464;&#127476;</span><span className="font-medium text-text-primary">Colombia (CO)</span></div></div><div><label className="block text-xs font-medium text-text-secondary mb-1.5">Idioma por Defecto</label><select value={cty.lang} onChange={e => setCty({ ...cty, lang: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-colombia-blue/30"><option value="es">Español (es)</option><option value="en">English (en)</option></select></div><div><label className="block text-xs font-medium text-text-secondary mb-1.5">Zona Horaria</label><input type="text" value={cty.tz} readOnly className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-text-secondary" /></div><div><label className="block text-xs font-medium text-text-secondary mb-1.5">Formato de Fecha</label><select value={cty.dateFmt} onChange={e => setCty({ ...cty, dateFmt: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-colombia-blue/30"><option value="DD/MM/YYYY">DD/MM/YYYY</option><option value="MM/DD/YYYY">MM/DD/YYYY</option><option value="YYYY-MM-DD">YYYY-MM-DD</option></select></div><div><label className="block text-xs font-medium text-text-secondary mb-1.5">Prefijo Telefónico</label><input type="text" value={cty.phone} readOnly className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-text-secondary" /></div><div><label className="block text-xs font-medium text-text-secondary mb-1.5">Formato de Documento</label><input type="text" value={cty.docFmt} readOnly className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-text-secondary" /></div><div><label className="block text-xs font-medium text-text-secondary mb-1.5">Moneda</label><input type="text" value={cty.currency} readOnly className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-text-secondary" /></div></div><div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><p className="text-sm font-medium text-text-primary">Habilitar Soporte Multi-País</p><p className="text-xs text-text-secondary">Permitir cambio entre Colombia, Ecuador y Guatemala</p></div><button onClick={() => setCty({ ...cty, multi: !cty.multi })} className={`relative w-11 h-6 rounded-full transition-colors ${cty.multi ? 'bg-colombia-blue' : 'bg-gray-300'}`}><span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${cty.multi ? 'translate-x-5' : 'translate-x-0'}`} /></button></div></div></CardBody>
                <CardFooter><div className="flex items-center gap-2 ml-auto"><Button variant="ghost" size="sm">Restablecer</Button><Button variant="primary" size="sm" leftIcon={Save} onClick={doSave}>Guardar Cambios</Button></div></CardFooter>
              </Card>
            )}

            {tab === 'roles' && (
              <div className="space-y-6">
                <Card variant="elevated">
                  <CardHeader><div className="flex items-center justify-between"><div><CardTitle>Roles de Usuario</CardTitle><CardDescription>Gestionar roles y sus permisos</CardDescription></div><Button variant="primary" size="sm" leftIcon={Plus}>Crear Rol</Button></div></CardHeader>
                  <CardBody className="!p-0"><div className="divide-y divide-gray-100">{rolesData.map(r => (<div key={r.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"><div className="flex items-center gap-4"><div className={`p-2 rounded-lg ${r.color}`}><Shield className="w-5 h-5" /></div><div><div className="flex items-center gap-2"><p className="text-sm font-semibold text-text-primary">{r.name}</p><code className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-text-secondary">{r.slug}</code></div><p className="text-xs text-text-secondary mt-0.5">{r.users} usuarios &middot; {r.perms} permisos</p></div></div><ChevronRight className="w-4 h-4 text-gray-400" /></div>))}</div></CardBody>
                </Card>
                <Card variant="outlined"><CardBody><div className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" /><div><p className="text-sm font-medium text-text-primary">Cambios de Permisos</p><p className="text-xs text-text-secondary">Cambiar los permisos del rol afecta a todos los usuarios asignados a ese rol. Los cambios se aplican inmediatamente.</p></div></div></CardBody></Card>
              </div>
            )}

            {tab === 'audit' && (
              <Card variant="elevated">
                <CardHeader><div className="flex items-center justify-between"><div><CardTitle>Registro de Auditoría</CardTitle><CardDescription>Rastrear todas las acciones de administrador y eventos del sistema</CardDescription></div><Button variant="outline" size="sm" leftIcon={Download}>Exportar Registro</Button></div></CardHeader>
                <CardBody>
                  <div className="mb-4"><Input placeholder="Buscar en registro de auditoría..." leftIcon={Search} value={auditQ} onChange={e => setAuditQ(e.target.value)} inputSize="sm" /></div>
                  <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
                    {auditFiltered.length === 0 ? (<div className="px-4 py-8 text-center"><ScrollText className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-sm text-text-secondary">No se encontraron entradas de auditoría</p></div>) : auditFiltered.map((entry, i) => (
                      <div key={entry.id} className={`flex items-start gap-3 px-4 py-3 ${i !== auditFiltered.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                        <div className="mt-1"><Clock className="w-3.5 h-3.5 text-gray-400" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap"><Badge status={entry.action.includes('SUSPEND') || entry.action.includes('REVOKE') ? 'revoked' : entry.action.includes('VERIFIED') || entry.action.includes('ISSUED') ? 'active' : 'info'} size="sm">{entry.action.replace(/_/g, ' ')}</Badge><span className="text-xs text-text-secondary">por {entry.performedBy}</span></div>
                          <p className="text-xs text-text-primary mt-1">{entry.details}</p>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-text-secondary"><span>{formatDateTime(entry.timestamp)}</span><span>IP: {entry.ipAddress}</span><span>Objetivo: {entry.target}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
