'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  HeartPulse,
  Syringe,
  AlertTriangle,
  Shield,
  Activity,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  Building2,
  Loader2,
  Droplets,
  ClipboardList,
  BadgeCheck,
  Hash,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockHealth, formatShortDate } from '@/lib/mock/citizenData';
import type { VaccinationRecord } from '@/lib/mock/citizenData';

// ─── Vaccination Row ─────────────────────────────────────────────────────────

function VaccinationRow({ vax }: { vax: VaccinationRecord }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-gray-100 dark:border-gray-700 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
          <Syringe size={16} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary dark:text-text-primary-dark truncate">
            {vax.name}
          </p>
          <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
            {vax.dose} &middot; {formatShortDate(vax.date)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge status="active" size="sm">
            Aplicada
          </Badge>
          {expanded ? (
            <ChevronUp size={14} className="text-gray-400" />
          ) : (
            <ChevronDown size={14} className="text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 animate-slide-down">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 ml-12 space-y-2">
            <DetailLine icon={Hash} label="Lote" value={vax.lot} />
            <DetailLine icon={Building2} label="Administrado por" value={vax.administeredBy} />
            <DetailLine icon={MapPin} label="Lugar" value={vax.location} />
            {vax.nextDue && (
              <DetailLine
                icon={Calendar}
                label="Proxima dosis"
                value={formatShortDate(vax.nextDue)}
              />
            )}
            {!vax.nextDue && (
              <DetailLine icon={BadgeCheck} label="Esquema" value="Completo" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Detail Line ─────────────────────────────────────────────────────────────

function DetailLine({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={12} className="text-text-secondary dark:text-text-secondary-dark flex-shrink-0" />
      <span className="text-[10px] text-text-secondary dark:text-text-secondary-dark">
        {label}:
      </span>
      <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
        {value}
      </span>
    </div>
  );
}

// ─── Health Page ─────────────────────────────────────────────────────────────

export default function HealthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showAllVax, setShowAllVax] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-colombia-blue" />
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Cargando datos de salud...
          </p>
        </div>
      </div>
    );
  }

  const displayedVax = showAllVax
    ? mockHealth.vaccinations
    : mockHealth.vaccinations.slice(0, 3);

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark pb-20">
      {/* ── Header ── */}
      <div className="bg-white dark:bg-gray-800 px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} className="text-text-primary dark:text-text-primary-dark" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
              Salud
            </h1>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              Afiliacion, vacunas y SISBEN
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* ── EPS Affiliation Card ── */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-rose-700 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <HeartPulse size={22} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-[10px] font-medium uppercase tracking-wider">
                  Afiliacion EPS
                </p>
                <p className="text-white font-bold text-lg">{mockHealth.eps.name}</p>
              </div>
              <div className="ml-auto">
                <Badge status="active" size="sm" dot>
                  Activo
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-white/60 text-[9px] uppercase">Regimen</p>
                <p className="text-white text-xs font-semibold">{mockHealth.eps.regime}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-white/60 text-[9px] uppercase">Categoria</p>
                <p className="text-white text-xs font-semibold">{mockHealth.eps.category}</p>
              </div>
            </div>
          </div>

          <CardBody className="py-3 px-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                No. Afiliacion
              </span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                {mockHealth.eps.affiliationNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Afiliado desde
              </span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                {formatShortDate(mockHealth.eps.affiliationDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                IPS Asignada
              </span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark text-right max-w-[60%]">
                {mockHealth.eps.ipsAssigned}
              </span>
            </div>
          </CardBody>
        </Card>

        {/* ── SISBEN Score ── */}
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <ClipboardList size={20} className="text-violet-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
                SISBEN IV
              </h3>
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Departamento Nacional de Planeacion
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
              <p className="text-2xl font-bold text-violet-700 dark:text-violet-400">
                {mockHealth.sisben.score}
              </p>
              <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark mt-0.5">
                Puntaje
              </p>
            </div>
            <div className="text-center p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
              <p className="text-2xl font-bold text-violet-700 dark:text-violet-400">
                {mockHealth.sisben.group}
              </p>
              <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark mt-0.5">
                Grupo
              </p>
            </div>
            <div className="text-center p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
              <p className="text-2xl font-bold text-violet-700 dark:text-violet-400">
                {mockHealth.sisben.subgroup}
              </p>
              <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark mt-0.5">
                Subgrupo
              </p>
            </div>
          </div>

          <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark mt-3 text-center">
            Ultima actualizacion: {formatShortDate(mockHealth.sisben.lastUpdate)} &middot; Cert: {mockHealth.sisben.certificate}
          </p>
        </Card>

        {/* ── Blood Type & Allergies ── */}
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Droplets size={20} className="text-red-600" />
            </div>
            <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
              Datos Medicos
            </h3>
          </div>

          <div className="space-y-3">
            {/* Blood type */}
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Grupo Sanguineo
              </span>
              <span className="text-lg font-bold text-red-700 dark:text-red-400">
                {mockHealth.bloodType}{mockHealth.rh}
              </span>
            </div>

            {/* Allergies */}
            {mockHealth.allergies.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} className="text-amber-600" />
                  <span className="text-xs font-semibold text-text-primary dark:text-text-primary-dark">
                    Alergias
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockHealth.allergies.map((allergy) => (
                    <Badge key={allergy} status="expiring" size="sm">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Conditions */}
            {mockHealth.conditions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={14} className="text-blue-600" />
                  <span className="text-xs font-semibold text-text-primary dark:text-text-primary-dark">
                    Condiciones
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockHealth.conditions.map((condition) => (
                    <Badge key={condition} status="info" size="sm">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* ── Vaccination Record ── */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Syringe size={16} className="text-blue-600" />
                <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
                  Historial de Vacunacion
                </h3>
              </div>
              <Badge status="info" size="sm">
                {mockHealth.vaccinations.length} vacunas
              </Badge>
            </div>
          </CardHeader>

          <div>
            {displayedVax.map((vax) => (
              <VaccinationRow key={vax.id} vax={vax} />
            ))}
          </div>

          {mockHealth.vaccinations.length > 3 && (
            <div className="p-3 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setShowAllVax(!showAllVax)}
                className="w-full text-center text-xs font-medium text-colombia-blue dark:text-colombia-yellow hover:underline flex items-center justify-center gap-1"
              >
                {showAllVax
                  ? 'Mostrar menos'
                  : `Ver todas (${mockHealth.vaccinations.length})`}
                {showAllVax ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          )}
        </Card>

        {/* ── PAI Note ── */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Shield size={16} className="text-colombia-blue flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Vacunacion registrada bajo el Programa Ampliado de Inmunizaciones (PAI)
            del Ministerio de Salud y Proteccion Social.
          </p>
        </div>
      </div>
    </div>
  );
}
