'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  IdCard,
  Car,
  HeartPulse,
  FileText,
  Search,
  Filter,
  ChevronRight,
  Loader2,
  BookOpen,
  CreditCard,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { mockDocuments, formatShortDate } from '@/lib/mock/citizenData';
import type { DocumentRecord } from '@/lib/mock/citizenData';

// ─── Filter categories ───────────────────────────────────────────────────────

type FilterCategory = 'all' | 'identity' | 'vehicle' | 'tax' | 'health';

interface FilterOption {
  key: FilterCategory;
  label: string;
  icon: React.ElementType;
}

const filterOptions: FilterOption[] = [
  { key: 'all', label: 'Todos', icon: Filter },
  { key: 'identity', label: 'Identidad', icon: IdCard },
  { key: 'vehicle', label: 'Vehiculos', icon: Car },
  { key: 'tax', label: 'Impuestos', icon: FileText },
  { key: 'health', label: 'Salud', icon: HeartPulse },
];

// ─── Category config for card styling ────────────────────────────────────────

const categoryConfig: Record<string, { gradient: string; route: string; icon: React.ElementType }> = {
  identity: {
    gradient: 'from-colombia-blue to-colombia-blue-dark',
    route: '/documents/identity',
    icon: IdCard,
  },
  vehicle: {
    gradient: 'from-emerald-500 to-emerald-700',
    route: '/documents/vehicles',
    icon: Car,
  },
  tax: {
    gradient: 'from-amber-500 to-amber-700',
    route: '/documents/work',
    icon: FileText,
  },
  health: {
    gradient: 'from-rose-500 to-rose-700',
    route: '/documents/health',
    icon: HeartPulse,
  },
};

// ─── Status label map ────────────────────────────────────────────────────────

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Vigente',
    valid: 'Valido',
    expiring: 'Por vencer',
    expired: 'Vencido',
    pending: 'Pendiente',
  };
  return labels[status] || status;
}

function getStatusBadge(status: string): 'active' | 'expiring' | 'expired' | 'pending' | 'default' {
  const map: Record<string, 'active' | 'expiring' | 'expired' | 'pending' | 'default'> = {
    active: 'active',
    valid: 'active',
    expiring: 'expiring',
    expired: 'expired',
    pending: 'pending',
  };
  return map[status] || 'default';
}

// ─── Document Card ───────────────────────────────────────────────────────────

function DocumentCard({ doc }: { doc: DocumentRecord }) {
  const router = useRouter();
  const config = categoryConfig[doc.category];
  const Icon = config?.icon || CreditCard;

  return (
    <Card
      variant="elevated"
      clickable
      onClick={() => router.push(config?.route || '/documents')}
      className="overflow-hidden"
    >
      {/* Top gradient bar with icon */}
      <div
        className={`h-28 bg-gradient-to-br ${config?.gradient || 'from-gray-500 to-gray-700'} p-4 flex flex-col justify-between relative overflow-hidden`}
      >
        {/* Background watermark icon */}
        <Icon
          size={80}
          className="absolute -right-3 -bottom-3 text-white/10"
        />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-white/80" />
            <span className="text-white/80 text-[10px] font-medium uppercase tracking-widest">
              {doc.shortName}
            </span>
          </div>
          <Badge status={getStatusBadge(doc.status)} size="sm">
            {getStatusLabel(doc.status)}
          </Badge>
        </div>

        <div className="relative z-10">
          <p className="text-white font-bold text-sm leading-tight">
            {doc.name}
          </p>
          <p className="text-white/70 text-xs mt-0.5">
            No. {doc.documentNumber}
          </p>
        </div>
      </div>

      {/* Bottom info */}
      <CardBody className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark uppercase tracking-wide">
              {doc.authority}
            </p>
            {doc.expiryDate && (
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1">
                Vence: {formatShortDate(doc.expiryDate)}
              </p>
            )}
            {!doc.expiryDate && (
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1">
                Sin vencimiento
              </p>
            )}
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </div>
      </CardBody>
    </Card>
  );
}

// ─── Documents Hub Page ──────────────────────────────────────────────────────

export default function DocumentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesFilter =
      activeFilter === 'all' || doc.category === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentNumber.includes(searchQuery) ||
      doc.shortName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-colombia-blue" />
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Cargando documentos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark pb-20">
      {/* ── Header ── */}
      <div className="bg-white dark:bg-gray-800 px-4 pt-12 pb-4 shadow-sm">
        <h1 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-4">
          Mis Documentos
        </h1>

        {/* Search */}
        <Input
          placeholder="Buscar documento..."
          leftIcon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          inputSize="md"
        />

        {/* Filter chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setActiveFilter(opt.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === opt.key
                  ? 'bg-colombia-blue text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <opt.icon size={13} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Document Grid ── */}
      <div className="px-4 mt-4">
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <BookOpen size={48} className="text-gray-300 mb-3" />
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
              No se encontraron documentos
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="text-xs text-colombia-blue dark:text-colombia-yellow mt-2 hover:underline"
              >
                Limpiar busqueda
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Document count ── */}
      {filteredDocuments.length > 0 && (
        <div className="px-4 mt-4">
          <p className="text-xs text-text-secondary dark:text-text-secondary-dark text-center">
            {filteredDocuments.length} documento{filteredDocuments.length !== 1 ? 's' : ''}{' '}
            {activeFilter !== 'all' ? `en ${filterOptions.find((f) => f.key === activeFilter)?.label}` : 'total'}
          </p>
        </div>
      )}
    </div>
  );
}
