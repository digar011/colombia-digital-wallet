'use client';

import React, { useState } from 'react';
import {
  Car,
  ShieldCheck,
  ShieldAlert,
  Wrench,
  FileText,
  Palette,
  Fuel,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge, type BadgeStatus } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';

export interface VehicleCardData {
  plateNumber: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  engineNumber?: string;
  chassisNumber?: string;
  fuelType?: string;
  capacity?: number;
  ownerName: string;
  ownerDocumentNumber: string;
  soat: {
    status: 'valid' | 'expired' | 'expiring' | 'pending';
    insurer?: string;
    policyNumber?: string;
    expirationDate?: string;
  };
  technomechanical: {
    status: 'valid' | 'expired' | 'expiring' | 'pending';
    center?: string;
    certificateNumber?: string;
    expirationDate?: string;
  };
  registrationDate?: string;
}

export interface VehicleCardProps {
  vehicle: VehicleCardData;
  onPress?: () => void;
  className?: string;
}

function getSoatLabel(status: string): string {
  switch (status) {
    case 'valid': return 'SOAT Vigente';
    case 'expired': return 'SOAT Vencido';
    case 'expiring': return 'SOAT Por vencer';
    case 'pending': return 'SOAT Pendiente';
    default: return 'SOAT';
  }
}

function getTechLabel(status: string): string {
  switch (status) {
    case 'valid': return 'RTM Vigente';
    case 'expired': return 'RTM Vencida';
    case 'expiring': return 'RTM Por vencer';
    case 'pending': return 'RTM Pendiente';
    default: return 'RTM';
  }
}

function VehicleCard({ vehicle, onPress, className }: VehicleCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      variant="elevated"
      clickable={!!onPress}
      className={cn('overflow-hidden', className)}
      onClick={onPress}
    >
      {/* Header with plate number */}
      <div className="bg-colombia-yellow px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm border-2 border-gray-800">
            <p className="text-lg sm:text-xl font-black font-mono text-gray-900 tracking-widest">
              {vehicle.plateNumber}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-colombia-blue uppercase">
              {vehicle.vehicleType}
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {vehicle.brand} {vehicle.model}
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-bold text-gray-800">{vehicle.year}</p>
        </div>
      </div>

      <CardBody>
        {/* Status badges row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge status={vehicle.soat.status as BadgeStatus} dot size="md">
            {getSoatLabel(vehicle.soat.status)}
          </Badge>
          <Badge status={vehicle.technomechanical.status as BadgeStatus} dot size="md">
            {getTechLabel(vehicle.technomechanical.status)}
          </Badge>
        </div>

        {/* Quick info grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <InfoRow icon={Palette} label="Color" value={vehicle.color} />
          {vehicle.fuelType && (
            <InfoRow icon={Fuel} label="Combustible" value={vehicle.fuelType} />
          )}
          {vehicle.capacity && (
            <InfoRow icon={Users} label="Capacidad" value={`${vehicle.capacity} pasajeros`} />
          )}
          <InfoRow icon={FileText} label="Propietario" value={vehicle.ownerName} />
        </div>

        {/* Expandable details */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="w-full text-xs text-colombia-blue dark:text-colombia-yellow font-medium py-2 hover:underline"
        >
          {expanded ? 'Ocultar detalles' : 'Ver más detalles'}
        </button>

        {expanded && (
          <div className="animate-slide-up space-y-4 pt-2 border-t border-gray-100 dark:border-gray-700">
            {/* SOAT details */}
            <div>
              <h4 className="text-xs font-bold text-text-primary dark:text-text-primary-dark mb-2 flex items-center gap-1.5">
                {vehicle.soat.status === 'valid' ? (
                  <ShieldCheck size={14} className="text-green-500" />
                ) : (
                  <ShieldAlert size={14} className="text-red-500" />
                )}
                SOAT - Seguro Obligatorio
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {vehicle.soat.insurer && (
                  <div>
                    <p className="text-text-secondary dark:text-text-secondary-dark">Aseguradora</p>
                    <p className="font-medium text-text-primary dark:text-text-primary-dark">{vehicle.soat.insurer}</p>
                  </div>
                )}
                {vehicle.soat.policyNumber && (
                  <div>
                    <p className="text-text-secondary dark:text-text-secondary-dark">Póliza</p>
                    <p className="font-medium font-mono text-text-primary dark:text-text-primary-dark">{vehicle.soat.policyNumber}</p>
                  </div>
                )}
                {vehicle.soat.expirationDate && (
                  <div>
                    <p className="text-text-secondary dark:text-text-secondary-dark">Vence</p>
                    <p className="font-medium text-text-primary dark:text-text-primary-dark">{vehicle.soat.expirationDate}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Technomechanical details */}
            <div>
              <h4 className="text-xs font-bold text-text-primary dark:text-text-primary-dark mb-2 flex items-center gap-1.5">
                {vehicle.technomechanical.status === 'valid' ? (
                  <Wrench size={14} className="text-green-500" />
                ) : (
                  <Wrench size={14} className="text-red-500" />
                )}
                Revisión Técnico-Mecánica
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {vehicle.technomechanical.center && (
                  <div>
                    <p className="text-text-secondary dark:text-text-secondary-dark">CDA</p>
                    <p className="font-medium text-text-primary dark:text-text-primary-dark">{vehicle.technomechanical.center}</p>
                  </div>
                )}
                {vehicle.technomechanical.certificateNumber && (
                  <div>
                    <p className="text-text-secondary dark:text-text-secondary-dark">Certificado</p>
                    <p className="font-medium font-mono text-text-primary dark:text-text-primary-dark">{vehicle.technomechanical.certificateNumber}</p>
                  </div>
                )}
                {vehicle.technomechanical.expirationDate && (
                  <div>
                    <p className="text-text-secondary dark:text-text-secondary-dark">Vence</p>
                    <p className="font-medium text-text-primary dark:text-text-primary-dark">{vehicle.technomechanical.expirationDate}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle technical details */}
            <div>
              <h4 className="text-xs font-bold text-text-primary dark:text-text-primary-dark mb-2 flex items-center gap-1.5">
                <Car size={14} />
                Datos del vehículo
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {vehicle.engineNumber && (
                  <div>
                    <p className="text-text-secondary dark:text-text-secondary-dark">No. Motor</p>
                    <p className="font-medium font-mono text-text-primary dark:text-text-primary-dark">{vehicle.engineNumber}</p>
                  </div>
                )}
                {vehicle.chassisNumber && (
                  <div>
                    <p className="text-text-secondary dark:text-text-secondary-dark">No. Chasis</p>
                    <p className="font-medium font-mono text-text-primary dark:text-text-primary-dark">{vehicle.chassisNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-text-secondary dark:text-text-secondary-dark">Documento propietario</p>
                  <p className="font-medium font-mono text-text-primary dark:text-text-primary-dark">{vehicle.ownerDocumentNumber}</p>
                </div>
                {vehicle.registrationDate && (
                  <div>
                    <p className="text-text-secondary dark:text-text-secondary-dark">Fecha matrícula</p>
                    <p className="font-medium text-text-primary dark:text-text-primary-dark">{vehicle.registrationDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

// Helper component for info rows
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={14} className="text-text-secondary dark:text-text-secondary-dark mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xs font-semibold text-text-primary dark:text-text-primary-dark truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

export { VehicleCard };
