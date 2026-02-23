'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  ShieldCheck,
  Activity,
  Users,
  Download,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  mockAnalytics,
  mockDepartmentStats,
  mockDocTypeDistribution,
  mockVerificationMethods,
  mockDashboardStats,
  formatNumber,
} from '@/lib/mock/adminData';

// ─── Date range type ─────────────────────────────────────────────────────────

type DateRange = '7d' | '14d' | '30d';

// ─── Helper: calculate trend percentage ──────────────────────────────────────

function calcTrend(data: number[]): { value: number; isPositive: boolean } {
  if (data.length < 2) return { value: 0, isPositive: true };
  const mid = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, mid).reduce((s, v) => s + v, 0) / mid;
  const secondHalf = data.slice(mid).reduce((s, v) => s + v, 0) / (data.length - mid);
  const pct = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;
  return { value: Math.abs(Math.round(pct * 10) / 10), isPositive: pct >= 0 };
}

// ─── Mini bar chart component ────────────────────────────────────────────────

function MiniBarChart({
  data,
  maxVal,
  color,
}: {
  data: { label: string; value: number }[];
  maxVal: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-end gap-1.5 h-36">
        {data.map((d, i) => {
          const pct = Math.max((d.value / maxVal) * 100, 4);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] font-semibold text-text-primary">{d.value}</span>
              <div
                className="w-full rounded-t transition-all duration-500"
                style={{
                  height: `${pct}%`,
                  backgroundColor: color,
                  opacity: i === data.length - 1 ? 1 : 0.6,
                }}
              />
              <span className="text-[9px] text-text-secondary">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [sortDeptBy, setSortDeptBy] = useState<'citizens' | 'verificationRate'>('citizens');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // ── Sliced analytics data ─────────────────────────────────────

  const rangeMap: Record<DateRange, number> = { '7d': 7, '14d': 14, '30d': 30 };
  const rangeData = useMemo(
    () => mockAnalytics.slice(-rangeMap[dateRange]),
    [dateRange]
  );

  // ── Computed metrics ──────────────────────────────────────────

  const totalRegistrations = rangeData.reduce((s, d) => s + d.registrations, 0);
  const totalVerifications = rangeData.reduce((s, d) => s + d.verifications, 0);
  const totalDocIssued = rangeData.reduce((s, d) => s + d.documentsIssued, 0);
  const avgActiveUsers = Math.round(
    rangeData.reduce((s, d) => s + d.activeUsers, 0) / rangeData.length
  );
  const totalApiCalls = rangeData.reduce((s, d) => s + d.apiCalls, 0);

  const regTrend = calcTrend(rangeData.map((d) => d.registrations));
  const verTrend = calcTrend(rangeData.map((d) => d.verifications));
  const docTrend = calcTrend(rangeData.map((d) => d.documentsIssued));
  const userTrend = calcTrend(rangeData.map((d) => d.activeUsers));

  // Chart data
  const regChartData = rangeData.map((d) => ({
    label: new Date(d.date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
    value: d.registrations,
  }));
  const userChartData = rangeData.map((d) => ({
    label: new Date(d.date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
    value: d.activeUsers,
  }));

  const maxReg = Math.max(...rangeData.map((d) => d.registrations));
  const maxUsers = Math.max(...rangeData.map((d) => d.activeUsers));

  // Sorted departments
  const sortedDepts = useMemo(() => {
    const sorted = [...mockDepartmentStats];
    sorted.sort((a, b) =>
      sortDeptBy === 'citizens'
        ? b.citizens - a.citizens
        : b.verificationRate - a.verificationRate
    );
    return sorted;
  }, [sortDeptBy]);

  const maxDeptCitizens = Math.max(...mockDepartmentStats.map((d) => d.citizens));

  // ── Loading state ─────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md h-24 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md h-80 animate-pulse" />
            <div className="bg-white rounded-xl shadow-md h-80 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Analítica</h1>
            <p className="text-sm text-text-secondary mt-1">
              Métricas de rendimiento y análisis de la plataforma de billetera digital
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5">
              {(['7d', '14d', '30d'] as DateRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-colombia-blue text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {range === '7d' ? '7 Días' : range === '14d' ? '14 Días' : '30 Días'}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" leftIcon={Download}>
              Exportar Reporte
            </Button>
          </div>
        </div>

        {/* ── Summary Cards (clickable links to sections) ────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Registros', value: totalRegistrations, trend: regTrend, icon: <Users className="w-5 h-5 text-blue-700" />, bg: 'bg-blue-100', href: '/admin/users' },
            { label: 'Verificaciones', value: totalVerifications, trend: verTrend, icon: <ShieldCheck className="w-5 h-5 text-green-700" />, bg: 'bg-green-100', href: '/admin/documents' },
            { label: 'Documentos Emitidos', value: totalDocIssued, trend: docTrend, icon: <FileText className="w-5 h-5 text-yellow-700" />, bg: 'bg-yellow-100', href: '/admin/documents' },
            { label: 'Usuarios Activos Promedio', value: avgActiveUsers, trend: userTrend, icon: <Activity className="w-5 h-5 text-purple-700" />, bg: 'bg-purple-100', href: '/admin/users' },
          ].map((card) => (
            <Card
              key={card.label}
              variant="elevated"
              padding="md"
              clickable
              onClick={() => router.push(card.href)}
              className="cursor-pointer hover:ring-2 hover:ring-colombia-blue/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-text-secondary">{card.label}</p>
                    <ExternalLink className="w-3 h-3 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xl font-bold text-text-primary mt-0.5">
                    {formatNumber(card.value)}
                  </p>
                </div>
                <div className={`p-2 ${card.bg} rounded-lg`}>{card.icon}</div>
              </div>
              <div className="mt-2 flex items-center gap-1">
                {card.trend.isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                )}
                <span className={`text-xs font-semibold ${card.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trend.value}%
                </span>
                <span className="text-[10px] text-text-secondary">vs periodo anterior</span>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Charts Row 1: Registration Trends + Active Users ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registration Trends */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tendencias de Registro</CardTitle>
                  <CardDescription>
                    Registros diarios nuevos ({dateRange === '7d' ? 'últimos 7 días' : dateRange === '14d' ? 'últimos 14 días' : 'últimos 30 días'})
                  </CardDescription>
                </div>
                <Badge status="info" size="sm">
                  {formatNumber(totalRegistrations)} total
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              {dateRange === '30d' ? (
                <div className="h-40 flex items-end gap-px">
                  {regChartData.map((d, i) => {
                    const pct = Math.max((d.value / maxReg) * 100, 3);
                    return (
                      <div key={i} className="flex-1 group relative">
                        <div
                          className="w-full rounded-t-sm bg-colombia-blue transition-all hover:bg-colombia-blue-light"
                          style={{ height: `${pct * 1.4}px`, opacity: 0.5 + (i / regChartData.length) * 0.5 }}
                        />
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {d.label}: {d.value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <MiniBarChart data={regChartData} maxVal={maxReg} color="#003893" />
              )}
              <div className="mt-3 flex items-center justify-between text-[10px] text-text-secondary border-t border-gray-100 pt-2">
                <span>Promedio: {Math.round(totalRegistrations / rangeData.length)}/día</span>
                <span>Pico: {Math.max(...rangeData.map((d) => d.registrations))} registros</span>
              </div>
            </CardBody>
          </Card>

          {/* Active Users Graph */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Usuarios Activos</CardTitle>
                  <CardDescription>Conteo de usuarios activos diarios</CardDescription>
                </div>
                <Badge status="active" size="sm">
                  {formatNumber(avgActiveUsers)} prom
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              {dateRange === '30d' ? (
                <div className="h-40 flex items-end gap-px">
                  {userChartData.map((d, i) => {
                    const pct = Math.max((d.value / maxUsers) * 100, 3);
                    return (
                      <div key={i} className="flex-1 group relative">
                        <div
                          className="w-full rounded-t-sm bg-green-500 transition-all hover:bg-green-400"
                          style={{ height: `${pct * 1.4}px`, opacity: 0.5 + (i / userChartData.length) * 0.5 }}
                        />
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {d.label}: {d.value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <MiniBarChart data={userChartData} maxVal={maxUsers} color="#22C55E" />
              )}
              <div className="mt-3 flex items-center justify-between text-[10px] text-text-secondary border-t border-gray-100 pt-2">
                <span>Mín: {formatNumber(Math.min(...rangeData.map((d) => d.activeUsers)))}</span>
                <span>Máx: {formatNumber(Math.max(...rangeData.map((d) => d.activeUsers)))}</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ── Charts Row 2: Document Types + Geographic Distribution ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Types Breakdown */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Desglose por Tipo de Documento</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="flex gap-6">
                {/* Pie chart */}
                <div className="relative w-36 h-36 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {(() => {
                      let cumulative = 0;
                      return mockDocTypeDistribution.map((item) => {
                        const startAngle = cumulative * 3.6;
                        cumulative += item.percentage;
                        const endAngle = cumulative * 3.6;
                        const startRad = (startAngle * Math.PI) / 180;
                        const endRad = (endAngle * Math.PI) / 180;
                        const largeArc = item.percentage > 50 ? 1 : 0;
                        const x1 = 50 + 40 * Math.cos(startRad);
                        const y1 = 50 + 40 * Math.sin(startRad);
                        const x2 = 50 + 40 * Math.cos(endRad);
                        const y2 = 50 + 40 * Math.sin(endRad);
                        return (
                          <path
                            key={item.type}
                            d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={item.color}
                            className="hover:opacity-80 transition-opacity"
                          />
                        );
                      });
                    })()}
                    <circle cx="50" cy="50" r="18" fill="white" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs font-bold text-text-primary">
                      {formatNumber(mockDocTypeDistribution.reduce((s, d) => s + d.count, 0))}
                    </p>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-2.5">
                  {mockDocTypeDistribution.map((item) => (
                    <div key={item.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3 h-3 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-text-secondary truncate">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-3 ml-2">
                        <span className="text-xs font-semibold text-text-primary">
                          {formatNumber(item.count)}
                        </span>
                        <span className="text-[10px] text-text-secondary w-10 text-right">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Geographic Distribution */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Distribución Geográfica</CardTitle>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSortDeptBy('citizens')}
                    className={`text-[10px] px-2 py-1 rounded ${
                      sortDeptBy === 'citizens' ? 'bg-colombia-blue text-white' : 'text-text-secondary hover:bg-gray-100'
                    }`}
                  >
                    Por Ciudadanos
                  </button>
                  <button
                    onClick={() => setSortDeptBy('verificationRate')}
                    className={`text-[10px] px-2 py-1 rounded ${
                      sortDeptBy === 'verificationRate' ? 'bg-colombia-blue text-white' : 'text-text-secondary hover:bg-gray-100'
                    }`}
                  >
                    Por Tasa
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {sortedDepts.map((dept, i) => (
                  <div key={dept.department}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] text-text-secondary w-4 text-right">{i + 1}.</span>
                        <span className="text-xs text-text-primary truncate">{dept.department}</span>
                      </div>
                      <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                        <span className="text-xs font-semibold text-text-primary">
                          {formatNumber(dept.citizens)}
                        </span>
                        <Badge
                          status={dept.verificationRate >= 90 ? 'active' : dept.verificationRate >= 85 ? 'pending' : 'expired'}
                          size="sm"
                        >
                          {dept.verificationRate}%
                        </Badge>
                      </div>
                    </div>
                    <div className="ml-6 w-auto h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 bg-colombia-blue"
                        style={{ width: `${(dept.citizens / maxDeptCitizens) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ── Charts Row 3: Verification Rates + API Usage ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Verification Success Rates */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Tasas de Éxito de Verificación</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {mockVerificationMethods.map((method) => (
                  <div key={method.method}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-text-primary font-medium">{method.method}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-text-secondary">
                          {formatNumber(method.totalAttempts)} intentos
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            method.successRate >= 95 ? 'text-green-600' : method.successRate >= 90 ? 'text-yellow-600' : 'text-red-600'
                          }`}
                        >
                          {method.successRate}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          method.successRate >= 95 ? 'bg-green-500' : method.successRate >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${method.successRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-text-secondary">Tasa de Éxito General</span>
                <span className="text-sm font-bold text-green-600">{mockDashboardStats.successRate}%</span>
              </div>
            </CardBody>
          </Card>

          {/* API Usage Stats */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Uso de API</CardTitle>
                <Badge status="info" size="sm">{formatNumber(totalApiCalls)} llamadas</Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="h-40 flex items-end gap-px">
                {rangeData.map((d, i) => {
                  const maxApi = Math.max(...rangeData.map((x) => x.apiCalls));
                  const pct = Math.max((d.apiCalls / maxApi) * 100, 3);
                  return (
                    <div key={i} className="flex-1 group relative">
                      <div
                        className="w-full rounded-t-sm transition-all hover:opacity-100"
                        style={{
                          height: `${pct * 1.4}px`,
                          backgroundColor: '#8B5CF6',
                          opacity: 0.4 + (i / rangeData.length) * 0.6,
                        }}
                      />
                      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {new Date(d.date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}: {formatNumber(d.apiCalls)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">Promedio por día</span>
                  <span className="font-semibold text-text-primary">{formatNumber(Math.round(totalApiCalls / rangeData.length))}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">Día pico</span>
                  <span className="font-semibold text-text-primary">{formatNumber(Math.max(...rangeData.map((d) => d.apiCalls)))}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">Tiempo de respuesta promedio</span>
                  <span className="font-semibold text-text-primary">124ms</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">Tasa de error</span>
                  <span className="font-semibold text-green-600">0.12%</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ── Export Section ───────────────────────────────────── */}
        <Card variant="outlined">
          <CardBody>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Exportar Reportes</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Generar reportes descargables en formato CSV o PDF
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" leftIcon={Download}>
                  Exportar CSV
                </Button>
                <Button variant="outline" size="sm" leftIcon={Download}>
                  Exportar PDF
                </Button>
                <Button variant="primary" size="sm" leftIcon={BarChart3}>
                  Reporte Completo
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
