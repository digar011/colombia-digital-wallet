'use client';

import React, { useState } from 'react';
import {
  HeartPulse,
  Building2,
  Calendar,
  User,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Stethoscope,
  Hash,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge, type BadgeStatus } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';

export interface HealthCardData {
  affiliateNumber: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  eps: string;
  epsNit?: string;
  regime: 'Contributivo' | 'Subsidiado' | 'Especial';
  category?: string;
  ipsAssigned?: string;
  coverageStatus: 'active' | 'pending' | 'expired' | 'revoked';
  affiliationDate?: string;
  validUntil?: string;
  beneficiaryType?: 'Cotizante' | 'Beneficiario' | 'Adicional';
  bloodType?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface HealthCardProps {
  data: HealthCardData;
  onPress?: () => void;
  className?: string;
}

function getRegimeColor(regime: string): string {
  switch (regime) {
    case 'Contributivo':
      return 'bg-colombia-blue text-white';
    case 'Subsidiado':
      return 'bg-emerald-600 text-white';
    case 'Especial':
      return 'bg-purple-600 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

function getCoverageInfo(status: string): {
  label: string;
  badgeStatus: BadgeStatus;
  Icon: typeof ShieldCheck;
} {
  switch (status) {
    case 'active':
      return { label: 'Afiliación activa', badgeStatus: 'active', Icon: ShieldCheck };
    case 'pending':
      return { label: 'En proceso', badgeStatus: 'pending', Icon: Shield };
    case 'expired':
      return { label: 'Afiliación inactiva', badgeStatus: 'expired', Icon: ShieldAlert };
    case 'revoked':
      return { label: 'Desafiliado', badgeStatus: 'revoked', Icon: ShieldAlert };
    default:
      return { label: status, badgeStatus: 'default', Icon: Shield };
  }
}

function HealthCard({ data, onPress, className }: HealthCardProps) {
  const [expanded, setExpanded] = useState(false);
  const coverageInfo = getCoverageInfo(data.coverageStatus);

  return (
    <Card
      variant="elevated"
      clickable={!!onPress}
      className={cn('overflow-hidden', className)}
      onClick={onPress}
    >
      {/* Header with health theme */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-lg">
              <HeartPulse size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] text-white/80 uppercase tracking-widest font-medium">
                Carné de Afiliación
              </p>
              <p className="text-sm font-bold text-white">{data.eps}</p>
            </div>
          </div>
          <div className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold', getRegimeColor(data.regime))}>
            {data.regime}
          </div>
        </div>
      </div>

      <CardBody>
        {/* Main info */}
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
              Nombre del afiliado
            </p>
            <p className="text-sm font-bold text-text-primary dark:text-text-primary-dark truncate">
              {data.fullName}
            </p>
          </div>
          <Badge status={coverageInfo.badgeStatus} size="sm" dot>
            {coverageInfo.label}
          </Badge>
        </div>

        {/* Key info grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <HealthInfoRow
            icon={Hash}
            label="No. Afiliado"
            value={data.affiliateNumber}
            mono
          />
          <HealthInfoRow
            icon={User}
            label={`${data.documentType}`}
            value={data.documentNumber}
            mono
          />
          {data.beneficiaryType && (
            <HealthInfoRow
              icon={Users2Icon}
              label="Tipo"
              value={data.beneficiaryType}
            />
          )}
          {data.ipsAssigned && (
            <HealthInfoRow
              icon={Building2}
              label="IPS Asignada"
              value={data.ipsAssigned}
            />
          )}
        </div>

        {/* Coverage status indicator bar */}
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg',
            data.coverageStatus === 'active'
              ? 'bg-green-50 dark:bg-green-900/20'
              : data.coverageStatus === 'pending'
              ? 'bg-yellow-50 dark:bg-yellow-900/20'
              : 'bg-red-50 dark:bg-red-900/20'
          )}
        >
          <coverageInfo.Icon
            size={16}
            className={cn(
              data.coverageStatus === 'active'
                ? 'text-green-600 dark:text-green-400'
                : data.coverageStatus === 'pending'
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-red-600 dark:text-red-400'
            )}
          />
          <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
            {coverageInfo.label}
          </span>
          {data.validUntil && (
            <span className="text-[10px] text-text-secondary dark:text-text-secondary-dark ml-auto">
              Hasta: {data.validUntil}
            </span>
          )}
        </div>

        {/* Expandable section */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="w-full text-xs text-colombia-blue dark:text-colombia-yellow font-medium py-2 mt-2 hover:underline"
        >
          {expanded ? 'Ocultar detalles' : 'Ver más detalles'}
        </button>

        {expanded && (
          <div className="animate-slide-up space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-3">
              {data.affiliationDate && (
                <HealthInfoRow
                  icon={Calendar}
                  label="Fecha afiliación"
                  value={data.affiliationDate}
                />
              )}
              {data.dateOfBirth && (
                <HealthInfoRow
                  icon={Calendar}
                  label="Fecha nacimiento"
                  value={data.dateOfBirth}
                />
              )}
              {data.bloodType && (
                <HealthInfoRow
                  icon={Activity}
                  label="Grupo sanguíneo"
                  value={data.bloodType}
                  highlight
                />
              )}
              {data.gender && (
                <HealthInfoRow
                  icon={User}
                  label="Sexo"
                  value={data.gender}
                />
              )}
              {data.category && (
                <HealthInfoRow
                  icon={Stethoscope}
                  label="Categoría"
                  value={data.category}
                />
              )}
              {data.epsNit && (
                <HealthInfoRow
                  icon={Building2}
                  label="NIT EPS"
                  value={data.epsNit}
                  mono
                />
              )}
            </div>

            <p className="text-[9px] text-text-secondary/50 dark:text-text-secondary-dark/50 text-center pt-2">
              Administradora de los Recursos del SGSSS (ADRES)
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

// Helper info row component
function HealthInfoRow({
  icon: Icon,
  label,
  value,
  mono = false,
  highlight = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon
        size={14}
        className="text-text-secondary dark:text-text-secondary-dark mt-0.5 shrink-0"
      />
      <div className="min-w-0">
        <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
          {label}
        </p>
        <p
          className={cn(
            'text-xs font-semibold truncate',
            highlight
              ? 'text-colombia-red'
              : 'text-text-primary dark:text-text-primary-dark',
            mono && 'font-mono'
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// Use User icon as fallback for beneficiary type
const Users2Icon: LucideIcon = User;

export { HealthCard };
