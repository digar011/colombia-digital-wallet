'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  BarChart3,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useCountry } from '@/lib/contexts/CountryContext';
import {
  agencyAnalytics,
  formatNumber,
  isValidAgencyKey,
  type AgencyKey,
  type AgencyAnalyticsData,
} from '@/lib/mock/agencyData';

// ─── Date range type ─────────────────────────────────────────────────────────

type DateRange = '7d' | '14d' | '30d';

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AgencyAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const { country } = useCountry();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  const agencyKey = (params?.agencyKey as string) || 'identity';
  const validKey: AgencyKey = isValidAgencyKey(agencyKey) ? agencyKey : 'identity';

  const agency = country.agencies[validKey];
  const data: AgencyAnalyticsData = agencyAnalytics[validKey];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Scale mock data by date range (simple multiplier for display purposes)
  const rangeMultiplier = useMemo(() => {
    switch (dateRange) {
      case '7d': return 0.25;
      case '14d': return 0.5;
      case '30d': return 1;
    }
  }, [dateRange]);

  const scaledDocs = Math.round(data.documentsIssued * rangeMultiplier);
  const scaledVerif = Math.round(data.verificationsCompleted * rangeMultiplier);

  // Chart data
  const maxMonthly = Math.max(...data.monthlyEmissions.map((m) => m.count));
  const maxDeptCount = Math.max(...data.departmentDistribution.map((d) => d.count));
  const totalDocTypes = data.documentTypes.reduce((s, d) => s + d.count, 0);

  // ── Loading state ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md h-28 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md h-80 animate-pulse" />
            <div className="bg-white rounded-xl shadow-md h-80 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md h-64 animate-pulse" />
            <div className="bg-white rounded-xl shadow-md h-64 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Analitica - {agency?.shortName || validKey}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Metricas de rendimiento y analisis de la agencia
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
                {range === '7d' ? '7 Dias' : range === '14d' ? '14 Dias' : '30 Dias'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Documentos Emitidos',
            value: scaledDocs,
            trend: data.documentsTrend,
            icon: <FileText className="w-5 h-5 text-blue-700" />,
            bg: 'bg-blue-100',
            href: `/agency/${validKey}/documents`,
          },
          {
            label: 'Verificaciones Realizadas',
            value: scaledVerif,
            trend: data.verificationsTrend,
            icon: <ShieldCheck className="w-5 h-5 text-green-700" />,
            bg: 'bg-green-100',
            href: `/agency/${validKey}/citizens`,
          },
          {
            label: 'Tasa de Aprobacion',
            value: `${data.approvalRate}%`,
            trend: data.approvalTrend,
            icon: <CheckCircle2 className="w-5 h-5 text-yellow-700" />,
            bg: 'bg-yellow-100',
            href: `/agency/${validKey}/requests`,
          },
          {
            label: 'Tiempo Promedio',
            value: data.averageTime,
            trend: data.averageTimeTrend,
            icon: <Clock className="w-5 h-5 text-purple-700" />,
            bg: 'bg-purple-100',
            href: `/agency/${validKey}/dashboard`,
          },
        ].map((card) => (
          <Card
            key={card.label}
            variant="elevated"
            padding="md"
            clickable
            onClick={() => router.push(card.href)}
            className="cursor-pointer hover:ring-2 hover:ring-colombia-blue/30 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-text-secondary truncate">{card.label}</p>
                  <ExternalLink className="w-3 h-3 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xl font-bold text-text-primary mt-0.5">
                  {typeof card.value === 'number' ? formatNumber(card.value) : card.value}
                </p>
              </div>
              <div className={`p-2 ${card.bg} rounded-lg`}>{card.icon}</div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {card.trend >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
              )}
              <span
                className={`text-xs font-semibold ${
                  card.label === 'Tiempo Promedio'
                    ? card.trend < 0
                      ? 'text-green-600'
                      : 'text-red-600'
                    : card.trend >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                }`}
              >
                {Math.abs(card.trend)}%
              </span>
              <span className="text-[10px] text-text-secondary">vs periodo anterior</span>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Charts Row 1: Monthly Emissions + Document Types ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emissions by Month - Bar Chart */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Emisiones por Mes</CardTitle>
                <CardDescription>
                  Documentos emitidos en los ultimos 6 meses
                </CardDescription>
              </div>
              <Badge status="info" size="sm">
                {formatNumber(data.monthlyEmissions.reduce((s, m) => s + m.count, 0))} total
              </Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex items-end gap-3 h-48">
              {data.monthlyEmissions.map((m, i) => {
                const pct = Math.max((m.count / maxMonthly) * 100, 5);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-text-primary">
                      {formatNumber(m.count)}
                    </span>
                    <div
                      className="w-full rounded-t-md transition-all duration-500 hover:opacity-80"
                      style={{
                        height: `${pct}%`,
                        backgroundColor: '#003893',
                        opacity: i === data.monthlyEmissions.length - 1 ? 1 : 0.5 + (i / data.monthlyEmissions.length) * 0.5,
                      }}
                    />
                    <span className="text-[10px] text-text-secondary font-medium">
                      {m.month}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-text-secondary border-t border-gray-100 pt-2">
              <span>
                Promedio:{' '}
                {formatNumber(
                  Math.round(
                    data.monthlyEmissions.reduce((s, m) => s + m.count, 0) /
                      data.monthlyEmissions.length
                  )
                )}
                /mes
              </span>
              <span>
                Pico: {formatNumber(maxMonthly)} documentos
              </span>
            </div>
          </CardBody>
        </Card>

        {/* Documents by Type - Horizontal Bars */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Documentos por Tipo</CardTitle>
                <CardDescription>
                  Distribucion de documentos emitidos por categoria
                </CardDescription>
              </div>
              <Badge status="info" size="sm">
                {formatNumber(totalDocTypes)} total
              </Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {data.documentTypes.map((dt) => (
                <div key={dt.type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: dt.color }}
                      />
                      <span className="text-xs text-text-primary font-medium truncate">
                        {dt.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                      <span className="text-xs font-semibold text-text-primary">
                        {formatNumber(dt.count)}
                      </span>
                      <span className="text-[10px] text-text-secondary w-10 text-right">
                        {dt.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${dt.percentage}%`,
                        backgroundColor: dt.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ── Charts Row 2: Success Rates + Geographic Distribution ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Success Rate Gauge / Progress Bars */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Tasas de Exito por Tipo de Solicitud</CardTitle>
            <CardDescription>
              Porcentaje de aprobacion por categoria de tramite
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {data.successRates.map((sr) => (
                <div key={sr.type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-text-primary font-medium">
                      {sr.type}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-text-secondary">
                        {formatNumber(sr.total)} solicitudes
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          sr.rate >= 95
                            ? 'text-green-600'
                            : sr.rate >= 90
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                      >
                        {sr.rate}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        sr.rate >= 95
                          ? 'bg-green-500'
                          : sr.rate >= 90
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${sr.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-text-secondary">Tasa de Aprobacion General</span>
              <span className="text-sm font-bold text-green-600">{data.approvalRate}%</span>
            </div>
          </CardBody>
        </Card>

        {/* Geographic Distribution */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-text-secondary" />
              <div>
                <CardTitle>Distribucion por Departamento</CardTitle>
                <CardDescription>
                  Top 8 departamentos por volumen de tramites
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {data.departmentDistribution.map((dept, i) => (
                <div key={dept.department}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] text-text-secondary w-4 text-right">
                        {i + 1}.
                      </span>
                      <span className="text-xs text-text-primary truncate">
                        {dept.department}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                      <span className="text-xs font-semibold text-text-primary">
                        {formatNumber(dept.count)}
                      </span>
                      <Badge
                        status={
                          dept.count / maxDeptCount >= 0.5
                            ? 'active'
                            : dept.count / maxDeptCount >= 0.25
                              ? 'pending'
                              : 'default'
                        }
                        size="sm"
                      >
                        {Math.round((dept.count / data.departmentDistribution.reduce((s, d) => s + d.count, 0)) * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-6 w-auto h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 bg-colombia-blue"
                      style={{ width: `${(dept.count / maxDeptCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ── Export Section ──────────────────────────────────── */}
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
  );
}
