'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  User,
  Shield,
  Filter,
  Archive,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  mockTickets,
  mockTicketStats,
  getTicketCategoryLabel,
  getTicketStatusLabel,
  getTicketPriorityLabel,
  getTicketStatusBadge,
  getTicketPriorityBadge,
  getTicketCategoryBadge,
  type Ticket,
  type TicketStatus,
  type TicketPriority,
  type TicketCategory,
} from '@/lib/mock/ticketData';
import { mockAdminStaff, formatRelativeTime } from '@/lib/mock/adminData';

// ─── Stats Card ─────────────────────────────────────────────────────────────

function StatsCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card variant="elevated">
      <CardBody>
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'p-3 rounded-xl flex-shrink-0',
              color
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary dark:text-gray-100">{value}</p>
            <p className="text-xs text-text-secondary dark:text-gray-400">{title}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// ─── Ticket Card ────────────────────────────────────────────────────────────

function TicketCard({
  ticket,
  isExpanded,
  onToggle,
}: {
  ticket: Ticket;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [localStatus, setLocalStatus] = useState<TicketStatus>(ticket.status);
  const [localAssignee, setLocalAssignee] = useState(ticket.assignedTo);
  const [newResponse, setNewResponse] = useState('');
  const [responses, setResponses] = useState(ticket.responses);

  const activeStaff = mockAdminStaff.filter((s) => s.status === 'active');

  const handleAddResponse = () => {
    if (!newResponse.trim()) return;
    setResponses((prev) => [
      ...prev,
      {
        id: `resp-new-${Date.now()}`,
        author: 'Administrador',
        authorRole: 'admin' as const,
        content: newResponse.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewResponse('');
  };

  return (
    <Card variant="elevated" className="overflow-hidden">
      {/* Collapsed header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          {/* Priority indicator */}
          <div
            className={cn(
              'w-1 h-12 rounded-full flex-shrink-0 mt-0.5',
              ticket.priority === 'urgent'
                ? 'bg-red-500'
                : ticket.priority === 'high'
                ? 'bg-orange-500'
                : ticket.priority === 'medium'
                ? 'bg-yellow-500'
                : 'bg-gray-300'
            )}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-text-secondary dark:text-gray-500">
                    {ticket.id}
                  </span>
                  <Badge status={getTicketStatusBadge(localStatus)} size="sm" dot>
                    {getTicketStatusLabel(localStatus)}
                  </Badge>
                  <Badge status={getTicketPriorityBadge(ticket.priority)} size="sm">
                    {getTicketPriorityLabel(ticket.priority)}
                  </Badge>
                  <Badge status={getTicketCategoryBadge(ticket.category)} size="sm">
                    {getTicketCategoryLabel(ticket.category)}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-text-primary dark:text-gray-200 mt-1.5 truncate">
                  {ticket.subject}
                </h3>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {responses.length > 0 && (
                  <span className="flex items-center gap-1 text-xs text-text-secondary dark:text-gray-500">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {responses.length}
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-1.5 text-xs text-text-secondary dark:text-gray-500">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {ticket.citizenName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(ticket.createdAt)}
              </span>
              {localAssignee && (
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {localAssignee}
                </span>
              )}
            </div>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          {/* Description */}
          <div className="px-5 py-4">
            <h4 className="text-xs font-semibold text-text-secondary dark:text-gray-400 uppercase tracking-wide mb-2">
              Descripción
            </h4>
            <p className="text-sm text-text-primary dark:text-gray-300 leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Responses */}
          {responses.length > 0 && (
            <div className="px-5 pb-4">
              <h4 className="text-xs font-semibold text-text-secondary dark:text-gray-400 uppercase tracking-wide mb-3">
                Historial de Respuestas ({responses.length})
              </h4>
              <div className="space-y-3">
                {responses.map((resp) => (
                  <div
                    key={resp.id}
                    className={cn(
                      'p-3 rounded-lg',
                      resp.authorRole === 'admin'
                        ? 'bg-colombia-blue/5 dark:bg-colombia-blue/10 border border-colombia-blue/10 dark:border-colombia-blue/20'
                        : 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold',
                          resp.authorRole === 'admin'
                            ? 'bg-colombia-blue text-white'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        )}
                      >
                        {resp.author.charAt(0)}
                      </div>
                      <span className="text-xs font-semibold text-text-primary dark:text-gray-300">
                        {resp.author}
                      </span>
                      <Badge
                        status={resp.authorRole === 'admin' ? 'info' : 'default'}
                        size="sm"
                      >
                        {resp.authorRole === 'admin' ? 'Admin' : 'Ciudadano'}
                      </Badge>
                      <span className="text-[10px] text-text-secondary dark:text-gray-500 ml-auto">
                        {formatRelativeTime(resp.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-text-primary dark:text-gray-300 pl-7">
                      {resp.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action bar */}
          <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 space-y-4">
            {/* Controls row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status change */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-text-secondary dark:text-gray-400">
                  Estado:
                </label>
                <select
                  value={localStatus}
                  onChange={(e) => setLocalStatus(e.target.value as TicketStatus)}
                  className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-colombia-blue/30"
                >
                  <option value="open">Abierto</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="resolved">Resuelto</option>
                  <option value="closed">Cerrado</option>
                </select>
              </div>

              {/* Assign admin */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-text-secondary dark:text-gray-400">
                  Asignar:
                </label>
                <select
                  value={localAssignee || ''}
                  onChange={(e) => setLocalAssignee(e.target.value || null)}
                  className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-colombia-blue/30"
                >
                  <option value="">Sin asignar</option>
                  {activeStaff.map((s) => (
                    <option key={s.id} value={`${s.firstName} ${s.lastName}`}>
                      {s.firstName} {s.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add response */}
            <div className="flex gap-2">
              <textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder="Escribir una respuesta..."
                rows={2}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-text-primary dark:text-gray-300 placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 resize-none"
              />
              <Button
                variant="primary"
                size="sm"
                leftIcon={Send}
                disabled={!newResponse.trim()}
                onClick={handleAddResponse}
                className="self-end"
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function AdminTicketsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TicketPriority | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<TicketCategory | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredTickets = useMemo(() => {
    return mockTickets.filter((t) => {
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
      if (filterCategory !== 'all' && t.category !== filterCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.subject.toLowerCase().includes(q) ||
          t.citizenName.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, filterStatus, filterPriority, filterCategory]);

  const clearFilters = () => {
    setFilterStatus('all');
    setFilterPriority('all');
    setFilterCategory('all');
    setSearchQuery('');
  };

  const hasFilters =
    filterStatus !== 'all' ||
    filterPriority !== 'all' ||
    filterCategory !== 'all' ||
    searchQuery !== '';

  // ── Loading state ─────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-white dark:bg-gray-800 rounded-xl shadow-md animate-pulse"
            />
          ))}
        </div>
        <div className="h-12 bg-white dark:bg-gray-800 rounded-xl shadow-md animate-pulse" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-white dark:bg-gray-800 rounded-xl shadow-md animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">
          Tickets de Soporte
        </h1>
        <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
          {mockTickets.length} tickets totales &middot; {mockTicketStats.open} abiertos
        </p>
      </div>

      {/* ── Stats Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Abiertos"
          value={mockTicketStats.open}
          icon={AlertCircle}
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          title="En Progreso"
          value={mockTicketStats.inProgress}
          icon={Clock}
          color="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
        />
        <StatsCard
          title="Resueltos esta semana"
          value={mockTicketStats.resolved}
          icon={CheckCircle2}
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
        <StatsCard
          title="Prioridad Alta"
          value={mockTicketStats.highPriority}
          icon={AlertTriangle}
          color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        />
      </div>

      {/* ── Search + Filters ─────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar tickets por ID, asunto o ciudadano..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-text-primary dark:text-gray-300 placeholder:text-gray-400 outline-none w-full"
            />
          </div>

          <Button
            variant={showFilters ? 'primary' : 'outline'}
            size="sm"
            leftIcon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
          </Button>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpiar
            </Button>
          )}
        </div>

        {/* Filter dropdowns */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-text-secondary dark:text-gray-400">
                Estado:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as TicketStatus | 'all')}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-primary dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-colombia-blue/30"
              >
                <option value="all">Todos</option>
                <option value="open">Abierto</option>
                <option value="in_progress">En Progreso</option>
                <option value="resolved">Resuelto</option>
                <option value="closed">Cerrado</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-text-secondary dark:text-gray-400">
                Prioridad:
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as TicketPriority | 'all')}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-primary dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-colombia-blue/30"
              >
                <option value="all">Todas</option>
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-text-secondary dark:text-gray-400">
                Categoría:
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as TicketCategory | 'all')}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-primary dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-colombia-blue/30"
              >
                <option value="all">Todas</option>
                <option value="document_issue">Problema de Documento</option>
                <option value="technical">Soporte Técnico</option>
                <option value="service_complaint">Queja de Servicio</option>
                <option value="info_request">Solicitud de Información</option>
                <option value="bug_report">Reporte de Error</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ── Ticket List ──────────────────────────────────────── */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <Card variant="elevated">
            <CardBody>
              <div className="text-center py-12">
                <Archive className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-text-primary dark:text-gray-300">
                  No se encontraron tickets
                </p>
                <p className="text-xs text-text-secondary dark:text-gray-500 mt-1">
                  Intenta ajustar los filtros de búsqueda
                </p>
                {hasFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="mt-4"
                  >
                    Limpiar Filtros
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isExpanded={expandedId === ticket.id}
              onToggle={() =>
                setExpandedId((prev) => (prev === ticket.id ? null : ticket.id))
              }
            />
          ))
        )}
      </div>

      {/* ── Results count ────────────────────────────────────── */}
      {filteredTickets.length > 0 && (
        <p className="text-xs text-text-secondary dark:text-gray-500 text-center">
          Mostrando {filteredTickets.length} de {mockTickets.length} tickets
        </p>
      )}
    </div>
  );
}
