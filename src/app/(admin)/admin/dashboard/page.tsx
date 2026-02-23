'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  ShieldCheck,
  Clock,
  FilePlus,
  UserCheck,
  BarChart3,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  RefreshCw,
  UserPlus,
  FileCheck,
  FileX,
  LogIn,
  UserCog,
  Ban,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  mockDashboardStats,
  mockActivityLog,
  mockDocTypeDistribution,
  mockAnalytics,
  mockSystemHealth,
  formatNumber,
  formatRelativeTime,
  type ActivityLogEntry,
  type SystemHealth,
} from '@/lib/mock/adminData';

// ─── Activity Icon Resolver ──────────────────────────────────────────────────

function ActivityIcon({ type }: { type: ActivityLogEntry['type'] }) {
  const iconClass = 'w-4 h-4';
  switch (type) {
    case 'verification':
      return <ShieldCheck className={`${iconClass} text-green-600`} />;
    case 'registration':
      return <UserPlus className={`${iconClass} text-blue-600`} />;
    case 'document_issued':
      return <FileCheck className={`${iconClass} text-colombia-blue`} />;
    case 'document_revoked':
      return <FileX className={`${iconClass} text-red-600`} />;
    case 'login':
      return <LogIn className={`${iconClass} text-gray-600`} />;
    case 'profile_update':
      return <UserCog className={`${iconClass} text-purple-600`} />;
    case 'suspension':
      return <Ban className={`${iconClass} text-red-700`} />;
  }
}

// ─── Status Indicator Component ──────────────────────────────────────────────

function StatusDot({ status }: { status: SystemHealth['status'] }) {
  const colors: Record<SystemHealth['status'], string> = {
    operational: 'bg-green-500',
    degraded: 'bg-yellow-500 animate-pulse',
    down: 'bg-red-500 animate-pulse',
  };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status]}`} />;
}

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
            style={{ backgroundColor: `${color === 'bg-colombia-blue' ? 'rgba(0,56,147,0.1)' : color === 'bg-colombia-yellow' ? 'rgba(252,209,22,0.15)' : color === 'bg-green-500' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)'}` }}
          >
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// ─── Main Dashboard Page ─────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastRefresh(new Date());
    }, 500);
  };

  // Compute chart data
  const last7Days = mockAnalytics.slice(-7);
  const maxRegistrations = Math.max(...last7Days.map((d) => d.registrations));

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
            <p className="text-sm text-text-secondary mt-1">
              Colombia Digital Wallet — Overview &middot; Last updated{' '}
              {lastRefresh.toLocaleTimeString('en-US', {
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
            Refresh
          </Button>
        </div>

        {/* ── Stats Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Citizens"
            value={mockDashboardStats.totalCitizens}
            subtitle={`${formatNumber(mockDashboardStats.newRegistrationsToday)} new today`}
            icon={<Users className="w-6 h-6 text-colombia-blue" />}
            trend={{ value: 5.2, isPositive: true }}
            color="bg-colombia-blue"
          />
          <StatsCard
            title="Active Documents"
            value={mockDashboardStats.activeDocuments}
            subtitle={`${formatNumber(mockDashboardStats.documentsIssuedToday)} issued today`}
            icon={<FileText className="w-6 h-6 text-colombia-yellow-dark" />}
            trend={{ value: 3.8, isPositive: true }}
            color="bg-colombia-yellow"
          />
          <StatsCard
            title="Verifications Today"
            value={mockDashboardStats.verificationsToday}
            subtitle={`${mockDashboardStats.successRate}% success rate`}
            icon={<ShieldCheck className="w-6 h-6 text-green-600" />}
            trend={{ value: 1.4, isPositive: true }}
            color="bg-green-500"
          />
          <StatsCard
            title="Pending Requests"
            value={mockDashboardStats.pendingRequests}
            subtitle={`${mockDashboardStats.pendingVerifications} verifications pending`}
            icon={<Clock className="w-6 h-6 text-yellow-600" />}
            trend={{ value: 2.1, isPositive: false }}
            color="bg-yellow-500"
          />
        </div>

        {/* ── Charts Row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Registration Trend (Bar Chart) */}
          <Card variant="elevated" className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Registration Trend (Last 7 Days)</CardTitle>
                <Badge status="info" size="sm">
                  {formatNumber(mockDashboardStats.newRegistrationsThisWeek)} this week
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex items-end gap-2 h-48">
                {last7Days.map((day, i) => {
                  const heightPct = Math.max(
                    (day.registrations / maxRegistrations) * 100,
                    8
                  );
                  const dateLabel = new Date(day.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                  });
                  return (
                    <div
                      key={day.date}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span className="text-xs font-semibold text-text-primary">
                        {day.registrations}
                      </span>
                      <div className="w-full relative">
                        <div
                          className="w-full rounded-t-md transition-all duration-500 ease-out"
                          style={{
                            height: `${heightPct * 1.6}px`,
                            background:
                              i === last7Days.length - 1
                                ? 'linear-gradient(to top, #003893, #1A5CC8)'
                                : 'linear-gradient(to top, #E5E7EB, #D1D5DB)',
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-text-secondary font-medium">
                        {dateLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-text-secondary border-t border-gray-100 pt-3">
                <span>
                  Avg: {Math.round(last7Days.reduce((s, d) => s + d.registrations, 0) / 7)}/day
                </span>
                <span>
                  Peak:{' '}
                  {new Date(
                    last7Days.reduce((best, d) =>
                      d.registrations > best.registrations ? d : best
                    ).date
                  ).toLocaleDateString('en-US', { weekday: 'long' })}
                </span>
              </div>
            </CardBody>
          </Card>

          {/* Document Type Distribution (Pie Chart) */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Document Types</CardTitle>
            </CardHeader>
            <CardBody>
              {/* CSS pie chart */}
              <div className="relative w-40 h-40 mx-auto mb-4">
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
                          className="transition-opacity hover:opacity-80"
                        />
                      );
                    });
                  })()}
                  <circle cx="50" cy="50" r="20" fill="white" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-bold text-text-primary">
                      {formatNumber(mockDashboardStats.totalDocuments)}
                    </p>
                    <p className="text-[9px] text-text-secondary leading-tight">Total</p>
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="space-y-2">
                {mockDocTypeDistribution.map((item) => (
                  <div key={item.type} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-text-secondary truncate">{item.type}</span>
                    </div>
                    <span className="font-semibold text-text-primary ml-2">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ── Activity Feed + Quick Actions + System Status ─────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card variant="elevated" className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" rightIcon={ArrowRight}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardBody className="!px-0 !py-0">
              <div className="divide-y divide-gray-100">
                {mockActivityLog.slice(0, 8).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 px-4 sm:px-6 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-gray-100">
                      <ActivityIcon type={entry.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">
                        <span className="font-semibold">{entry.citizenName}</span>
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 truncate">
                        {entry.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-text-secondary whitespace-nowrap">
                        {formatRelativeTime(entry.timestamp)}
                      </p>
                      <Badge
                        status={
                          entry.type === 'verification' || entry.type === 'document_issued'
                            ? 'active'
                            : entry.type === 'registration'
                            ? 'info'
                            : entry.type === 'suspension' || entry.type === 'document_revoked'
                            ? 'revoked'
                            : 'default'
                        }
                        size="sm"
                        className="mt-1"
                      >
                        {entry.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Right Column: Quick Actions + System Status */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors group">
                    <div className="p-2 rounded-lg bg-colombia-blue/10 text-colombia-blue group-hover:bg-colombia-blue group-hover:text-white transition-colors">
                      <FilePlus className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-semibold text-text-primary">Issue Document</p>
                      <p className="text-xs text-text-secondary">Create and issue a new document</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors group">
                    <div className="p-2 rounded-lg bg-green-100 text-green-700 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-semibold text-text-primary">Verify Citizen</p>
                      <p className="text-xs text-text-secondary">
                        {mockDashboardStats.pendingVerifications} pending verifications
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors group">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-semibold text-text-primary">View Reports</p>
                      <p className="text-xs text-text-secondary">Analytics & export data</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </CardBody>
            </Card>

            {/* System Status */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>System Status</CardTitle>
                  <div className="flex items-center gap-1.5">
                    {mockSystemHealth.every((s) => s.status === 'operational') ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : mockSystemHealth.some((s) => s.status === 'down') ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className="text-xs font-medium text-text-secondary">
                      {mockSystemHealth.filter((s) => s.status === 'operational').length}/
                      {mockSystemHealth.length} Operational
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {mockSystemHealth.map((service) => (
                    <div key={service.service} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <StatusDot status={service.status} />
                        <span className="text-xs text-text-primary truncate">
                          {service.service}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                        <span className="text-[10px] text-text-secondary">
                          {service.responseTime}ms
                        </span>
                        <span className="text-[10px] font-medium text-text-secondary">
                          {service.uptime}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* ── Bottom Stats Row ────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-colombia-blue" />
              <div>
                <p className="text-xs text-text-secondary">Avg Verification Time</p>
                <p className="text-lg font-bold text-text-primary">
                  {mockDashboardStats.averageVerificationTime}
                </p>
              </div>
            </div>
          </Card>
          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-text-secondary">This Week</p>
                <p className="text-lg font-bold text-text-primary">
                  {formatNumber(mockDashboardStats.verificationsThisWeek)}
                  <span className="text-xs font-normal text-text-secondary ml-1">verifications</span>
                </p>
              </div>
            </div>
          </Card>
          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-colombia-yellow-dark" />
              <div>
                <p className="text-xs text-text-secondary">Documents This Week</p>
                <p className="text-lg font-bold text-text-primary">
                  {formatNumber(mockDashboardStats.documentsIssuedThisWeek)}
                </p>
              </div>
            </div>
          </Card>
          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-colombia-red" />
              <div>
                <p className="text-xs text-text-secondary">Rejected Today</p>
                <p className="text-lg font-bold text-text-primary">
                  {mockDashboardStats.rejectedToday}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
