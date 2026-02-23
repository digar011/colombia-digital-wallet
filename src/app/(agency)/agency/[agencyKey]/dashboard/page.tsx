'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  FileText,
  Clock,
  Users,
  Timer,
  TrendingUp,
  TrendingDown,
  FilePlus,
  UserCheck,
  ClipboardList,
  BarChart3,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useCountry } from '@/lib/contexts/CountryContext';
import {
  getAgencyDataByKey,
  isValidAgencyKey,
  formatNumber,
  formatAgencyRelativeTime,
  type AgencyData,
} from '@/lib/mock/agencyData';

// ─── Stats Card ──────────────────────────────────────────────────────────────

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color: string;
}

function StatsCard({ title, value, subtitle, icon, trend, color }: StatsCardProps) {
  return (
    <Card variant="elevated" className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 ${color}`} />
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-secondary truncate">{title}</p>
            <p className="mt-1 text-2xl font-bold text-text-primary">
              {typeof value === 'number' ? formatNumber(value) : value}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs text-text-secondary truncate">{subtitle}</p>
              {trend && (
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {trend.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {trend.value}%
                </span>
              )}
            </div>
          </div>
          <div
            className={`flex-shrink-0 p-3 rounded-xl ${color} bg-opacity-10`}
            style={{
              backgroundColor:
                color === 'bg-colombia-blue'
                  ? 'rgba(0,56,147,0.1)'
                  : color === 'bg-colombia-yellow'
                  ? 'rgba(252,209,22,0.15)'
                  : color === 'bg-green-500'
                  ? 'rgba(34,197,94,0.1)'
                  : 'rgba(234,179,8,0.1)',
            }}
          >
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// ─── Main Agency Dashboard Page ──────────────────────────────────────────────

export default function AgencyDashboardPage() {
  const params = useParams();
  const agencyKey = params.agencyKey as string;
  const { country } = useCountry();

  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [agencyData, setAgencyData] = useState<AgencyData | null>(null);

  // Get agency name from country config
  const agencyConfig = country.agencies[agencyKey];
  const agencyShortName = agencyConfig?.shortName ?? agencyKey;

  useEffect(() => {
    if (isValidAgencyKey(agencyKey)) {
      setAgencyData(getAgencyDataByKey(agencyKey));
    }
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [agencyKey]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (isValidAgencyKey(agencyKey)) {
        setAgencyData(getAgencyDataByKey(agencyKey));
      }
      setIsLoading(false);
      setLastRefresh(new Date());
    }, 500);
  };

  // ── Loading skeleton ────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 space-y-3">
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-36 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md h-80 animate-pulse" />
            <div className="bg-white rounded-xl shadow-md h-80 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ── Invalid agency key ──────────────────────────────────────────
  if (!agencyData || !agencyConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card variant="elevated" className="max-w-md w-full">
          <CardBody>
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Agencia no encontrada
              </h2>
              <p className="text-sm text-text-secondary">
                La clave de agencia &ldquo;{agencyKey}&rdquo; no es valida.
                Verifique la URL e intente de nuevo.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Map AgencyData to dashboard view model
  const kpis = {
    documentosEmitidos: agencyData.stats?.totalDocumentsIssued ?? 0,
    documentosEmitidosTrend: 5.2,
    solicitudesPendientes: agencyData.stats?.pendingRequests ?? 0,
    ciudadanosAtendidos: agencyData.stats?.citizensServed ?? 0,
    tiempoPromedio: agencyData.stats?.averageProcessingTime ?? 'N/A',
  };
  const recentActivity = agencyData.activities.map((a) => ({
    id: a.id,
    action: a.description,
    user: a.user,
    timestamp: a.timestamp,
  }));
  const pendingRequests = agencyData.requests
    .filter((r) => r.status === 'pending' || r.status === 'in_review')
    .map((r) => ({
      id: r.id,
      citizenName: r.citizenName,
      priority: r.priority === 'high' ? 'alta' : r.priority === 'medium' ? 'media' : 'baja',
      documentType: r.requestType === 'document_issue' ? 'Emisión' : r.requestType === 'identity_verify' ? 'Verificación' : 'Renovación',
      citizenDoc: r.citizenDocNumber,
      requestedAt: r.requestDate,
    }));
  const monthlyIssuance = agencyData.stats?.monthlyTrend ?? [];
  const maxMonthly = Math.max(...monthlyIssuance.map((m) => m.count), 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Panel de Control &mdash; {agencyShortName}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {agencyConfig.name} &middot; Ultima actualizacion{' '}
              {lastRefresh.toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={RefreshCw}
            onClick={handleRefresh}
          >
            Actualizar
          </Button>
        </div>

        {/* ── KPI Stats Cards ────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Documentos Emitidos"
            value={kpis.documentosEmitidos}
            subtitle="Total acumulado"
            icon={<FileText className="w-6 h-6 text-colombia-blue" />}
            trend={{ value: kpis.documentosEmitidosTrend, isPositive: true }}
            color="bg-colombia-blue"
          />
          <StatsCard
            title="Solicitudes Pendientes"
            value={kpis.solicitudesPendientes}
            subtitle="Por procesar"
            icon={<Clock className="w-6 h-6 text-yellow-600" />}
            trend={{ value: 2.1, isPositive: false }}
            color="bg-yellow-500"
          />
          <StatsCard
            title="Ciudadanos Atendidos"
            value={kpis.ciudadanosAtendidos}
            subtitle="Total registrados"
            icon={<Users className="w-6 h-6 text-green-600" />}
            trend={{ value: 3.4, isPositive: true }}
            color="bg-green-500"
          />
          <StatsCard
            title="Tiempo Promedio de Procesamiento"
            value={kpis.tiempoPromedio}
            subtitle="Por solicitud"
            icon={<Timer className="w-6 h-6 text-colombia-yellow-dark" />}
            color="bg-colombia-yellow"
          />
        </div>

        {/* ── Activity Feed + Quick Actions ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card variant="elevated" className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Actividad Reciente</CardTitle>
                <Badge status="info" size="sm">
                  Ultimas 10 acciones
                </Badge>
              </div>
            </CardHeader>
            <CardBody className="!px-0 !py-0">
              <div className="divide-y divide-gray-100">
                {recentActivity.slice(0, 10).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 px-4 sm:px-6 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-gray-100 flex-shrink-0">
                      <FileText className="w-4 h-4 text-colombia-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">
                        {entry.action}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 truncate">
                        {entry.user}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-text-secondary whitespace-nowrap">
                        {formatAgencyRelativeTime(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Acciones Rapidas</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors group">
                  <div className="p-2 rounded-lg bg-colombia-blue/10 text-colombia-blue group-hover:bg-colombia-blue group-hover:text-white transition-colors">
                    <FilePlus className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-text-primary">Emitir Documento</p>
                    <p className="text-xs text-text-secondary">Crear y emitir un nuevo documento</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors group">
                  <div className="p-2 rounded-lg bg-green-100 text-green-700 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-text-primary">Verificar Ciudadano</p>
                    <p className="text-xs text-text-secondary">Validar identidad de un ciudadano</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors group">
                  <div className="p-2 rounded-lg bg-yellow-100 text-yellow-700 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-text-primary">Revisar Solicitudes</p>
                    <p className="text-xs text-text-secondary">
                      {kpis.solicitudesPendientes} solicitudes pendientes
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors group">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-text-primary">Generar Reporte</p>
                    <p className="text-xs text-text-secondary">Analitica y exportar datos</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ── Pending Requests + Monthly Chart ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Requests Preview */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Solicitudes Pendientes</CardTitle>
                <Button variant="ghost" size="sm" rightIcon={ArrowRight}>
                  Ver Todas
                </Button>
              </div>
            </CardHeader>
            <CardBody className="!px-0 !py-0">
              {pendingRequests.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-text-secondary">
                    No hay solicitudes pendientes
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {pendingRequests.slice(0, 5).map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center gap-4 px-4 sm:px-6 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-yellow-100 text-yellow-700 flex-shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {req.citizenName}
                          </p>
                          <Badge
                            status={
                              req.priority === 'alta'
                                ? 'revoked'
                                : req.priority === 'media'
                                ? 'pending'
                                : 'default'
                            }
                            size="sm"
                          >
                            {req.priority === 'alta'
                              ? 'Alta'
                              : req.priority === 'media'
                              ? 'Media'
                              : 'Baja'}
                          </Badge>
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5 truncate">
                          {req.documentType} &middot; CC {req.citizenDoc}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <p className="text-xs text-text-secondary whitespace-nowrap">
                          {formatAgencyRelativeTime(req.requestedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Monthly Issuance Chart */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Emision Mensual</CardTitle>
                <Badge status="info" size="sm">
                  Ultimos 6 meses
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex items-end gap-3 h-52">
                {monthlyIssuance.map((month, i) => {
                  const heightPct = Math.max((month.count / maxMonthly) * 100, 8);
                  return (
                    <div
                      key={month.month}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span className="text-xs font-semibold text-text-primary">
                        {month.count}
                      </span>
                      <div className="w-full relative">
                        <div
                          className="w-full rounded-t-md transition-all duration-500 ease-out"
                          style={{
                            height: `${heightPct * 1.8}px`,
                            background:
                              i === monthlyIssuance.length - 1
                                ? 'linear-gradient(to top, #003893, #1A5CC8)'
                                : 'linear-gradient(to top, #E5E7EB, #D1D5DB)',
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-text-secondary font-medium">
                        {month.month}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-text-secondary border-t border-gray-100 pt-3">
                <span>
                  Promedio: {Math.round(monthlyIssuance.reduce((s, m) => s + m.count, 0) / monthlyIssuance.length)}/mes
                </span>
                <span>
                  Pico:{' '}
                  {monthlyIssuance.reduce((best, m) =>
                    m.count > best.count ? m : best
                  ).month}
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
