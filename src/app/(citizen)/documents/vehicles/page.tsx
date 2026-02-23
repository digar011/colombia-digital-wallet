'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Car,
  Bike,
  Shield,
  Wrench,
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Hash,
  Palette,
  Gauge,
  Building2,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  mockVehicles,
  formatShortDate,
  daysUntil,
} from '@/lib/mock/citizenData';
import type { VehicleRecord } from '@/lib/mock/citizenData';

// ─── Vehicle Card Component ──────────────────────────────────────────────────

function VehicleCard({ vehicle }: { vehicle: VehicleRecord }) {
  const [expanded, setExpanded] = useState(false);

  const isCar = vehicle.type === 'car';
  const VehicleIcon = isCar ? Car : Bike;

  const soatDays = daysUntil(vehicle.soat.expiryDate);
  const rtmDays = daysUntil(vehicle.technomechanical.expiryDate);

  const getExpiryColor = (days: number) => {
    if (days <= 0) return 'text-red-600';
    if (days <= 30) return 'text-amber-600';
    return 'text-green-600';
  };

  const getExpiryBadge = (days: number): 'active' | 'expiring' | 'expired' => {
    if (days <= 0) return 'expired';
    if (days <= 30) return 'expiring';
    return 'active';
  };

  const getExpiryLabel = (days: number): string => {
    if (days <= 0) return 'Vencido';
    if (days === 1) return '1 dia';
    return `${days} dias`;
  };

  return (
    <Card variant="elevated" className="overflow-hidden">
      {/* Vehicle Header */}
      <div
        className={`p-4 ${
          isCar
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-700'
            : 'bg-gradient-to-r from-orange-500 to-orange-700'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <VehicleIcon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">
                {vehicle.type === 'car' ? 'Automovil' : 'Motocicleta'}
              </p>
              <p className="text-white font-bold text-lg">
                {vehicle.brand} {vehicle.model}
              </p>
            </div>
          </div>
        </div>

        {/* Plate Number (large) */}
        <div className="mt-3 bg-white/10 rounded-lg px-4 py-2 inline-flex items-center gap-2">
          <div className="w-1.5 h-6 bg-colombia-yellow rounded-sm" />
          <span className="text-white font-mono font-bold text-2xl tracking-[0.15em]">
            {vehicle.plate}
          </span>
        </div>
      </div>

      {/* Quick Status */}
      <CardBody className="py-3 px-4">
        <div className="grid grid-cols-2 gap-3">
          {/* SOAT Status */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <Shield size={16} className="text-colombia-blue flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark uppercase">
                SOAT
              </p>
              <div className="flex items-center gap-1">
                <Badge status={getExpiryBadge(soatDays)} size="sm">
                  {getExpiryLabel(soatDays)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Technomechanical Status */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <Wrench size={16} className="text-amber-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark uppercase">
                RTM
              </p>
              <div className="flex items-center gap-1">
                <Badge status={getExpiryBadge(rtmDays)} size="sm">
                  {getExpiryLabel(rtmDays)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Expand/Collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 mt-3 py-2 text-xs font-medium text-colombia-blue dark:text-colombia-yellow hover:underline"
        >
          {expanded ? 'Ver menos' : 'Ver detalles'}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-2 space-y-4 animate-slide-down">
            {/* Vehicle Details */}
            <div>
              <h4 className="text-xs font-bold text-text-primary dark:text-text-primary-dark uppercase tracking-wider mb-2">
                Datos del Vehiculo
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <DetailItem icon={Hash} label="Placa" value={vehicle.plate} />
                <DetailItem icon={Calendar} label="Modelo" value={String(vehicle.year)} />
                <DetailItem icon={Palette} label="Color" value={vehicle.color} />
                <DetailItem icon={Gauge} label="Cilindraje" value={`${vehicle.engineCC} cc`} />
                <DetailItem
                  icon={FileText}
                  label="VIN"
                  value={vehicle.vin.slice(0, 10) + '...'}
                />
                <DetailItem
                  icon={Building2}
                  label="Registro RUNT"
                  value={vehicle.registrationNumber.slice(0, 15) + '...'}
                />
              </div>
            </div>

            {/* SOAT Details */}
            <div>
              <h4 className="text-xs font-bold text-text-primary dark:text-text-primary-dark uppercase tracking-wider mb-2">
                SOAT
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    Aseguradora
                  </span>
                  <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                    {vehicle.soat.insurer}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    Poliza
                  </span>
                  <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                    {vehicle.soat.policyNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    Vigencia
                  </span>
                  <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                    {formatShortDate(vehicle.soat.startDate)} - {formatShortDate(vehicle.soat.expiryDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    Vence en
                  </span>
                  <span className={`text-xs font-bold ${getExpiryColor(soatDays)}`}>
                    {soatDays <= 0 ? 'Vencido' : `${soatDays} dias`}
                  </span>
                </div>
              </div>
            </div>

            {/* Technomechanical Details */}
            <div>
              <h4 className="text-xs font-bold text-text-primary dark:text-text-primary-dark uppercase tracking-wider mb-2">
                Revision Tecnomecanica
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    Centro
                  </span>
                  <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                    {vehicle.technomechanical.center}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    Certificado
                  </span>
                  <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                    {vehicle.technomechanical.certificateNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    Resultado
                  </span>
                  <Badge
                    status={vehicle.technomechanical.result === 'approved' ? 'active' : 'expired'}
                    size="sm"
                  >
                    {vehicle.technomechanical.result === 'approved' ? 'Aprobado' : 'Rechazado'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    Vence en
                  </span>
                  <span className={`text-xs font-bold ${getExpiryColor(rtmDays)}`}>
                    {rtmDays <= 0 ? 'Vencida' : `${rtmDays} dias`}
                  </span>
                </div>
              </div>
            </div>

            {/* Insurance (if applicable) */}
            {vehicle.insurance && (
              <div>
                <h4 className="text-xs font-bold text-text-primary dark:text-text-primary-dark uppercase tracking-wider mb-2">
                  Seguro Vehicular
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                      Aseguradora
                    </span>
                    <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                      {vehicle.insurance.company}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                      Tipo
                    </span>
                    <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                      {vehicle.insurance.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                      Poliza
                    </span>
                    <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                      {vehicle.insurance.policyNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                      Vence
                    </span>
                    <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                      {formatShortDate(vehicle.insurance.expiryDate)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!vehicle.insurance && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Este vehiculo no tiene seguro vehicular adicional registrado.
                </p>
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

// ─── Detail Item ─────────────────────────────────────────────────────────────

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
      <Icon size={14} className="text-text-secondary dark:text-text-secondary-dark flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[9px] text-text-secondary dark:text-text-secondary-dark uppercase">
          {label}
        </p>
        <p className="text-xs font-medium text-text-primary dark:text-text-primary-dark truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Vehicles Page ───────────────────────────────────────────────────────────

export default function VehiclesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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
            Consultando RUNT...
          </p>
        </div>
      </div>
    );
  }

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
              Mis Vehiculos
            </h1>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              Informacion del RUNT &middot; {mockVehicles.length} vehiculo{mockVehicles.length !== 1 ? 's' : ''} registrado{mockVehicles.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* ── Vehicles List ── */}
      <div className="px-4 mt-4 space-y-4">
        {mockVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {/* ── Footer note ── */}
      <div className="px-4 mt-6">
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Building2 size={16} className="text-colombia-blue flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Informacion sincronizada con el Registro Unico Nacional de Transito (RUNT).
            Ultima actualizacion: 22 de febrero de 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
