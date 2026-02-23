'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Maximize2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge, type BadgeStatus } from '@/components/ui/Badge';
import { QRCode } from '@/components/ui/QRCode';

export interface DocumentCardData {
  documentType: string;
  documentTypeHeader: string;
  documentNumber: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  bloodType?: string;
  gender?: string;
  photoUrl?: string | null;
  issuedDate?: string;
  expirationDate?: string;
  status: 'valid' | 'expired' | 'pending' | 'revoked';
  qrValue?: string;
  authority?: string;
  additionalFields?: Record<string, string>;
}

export interface DocumentCardProps {
  document: DocumentCardData;
  onViewFullScreen?: () => void;
  className?: string;
}

function getStatusBadge(status: string): { label: string; badgeStatus: BadgeStatus } {
  switch (status) {
    case 'valid':
      return { label: 'Vigente', badgeStatus: 'valid' };
    case 'expired':
      return { label: 'Vencido', badgeStatus: 'expired' };
    case 'pending':
      return { label: 'En trámite', badgeStatus: 'pending' };
    case 'revoked':
      return { label: 'Revocado', badgeStatus: 'revoked' };
    default:
      return { label: status, badgeStatus: 'default' };
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'valid':
      return ShieldCheck;
    case 'expired':
    case 'revoked':
      return ShieldAlert;
    default:
      return Shield;
  }
}

function DocumentCard({
  document,
  onViewFullScreen,
  className,
}: DocumentCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const statusInfo = getStatusBadge(document.status);
  const StatusIcon = getStatusIcon(document.status);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFlip();
      }
    },
    [handleFlip]
  );

  return (
    <div
      className={cn(
        'w-full max-w-[400px] mx-auto',
        '[perspective:1200px]',
        className
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`${document.documentTypeHeader}. Tap to ${isFlipped ? 'see front' : 'see back'}`}
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative w-full aspect-[1.586/1] cursor-pointer transition-transform duration-700',
          '[transform-style:preserve-3d]',
          isFlipped && '[transform:rotateY(180deg)]'
        )}
      >
        {/* ─── Front Face ─────────────────────────────────────── */}
        <div
          className={cn(
            'absolute inset-0 [backface-visibility:hidden] rounded-2xl overflow-hidden',
            'bg-gradient-to-br from-white via-white to-gray-50',
            'dark:from-gray-800 dark:via-gray-800 dark:to-gray-900',
            'border border-gray-200 dark:border-gray-700',
            'shadow-lg'
          )}
        >
          {/* Header stripe with Colombia colors */}
          <div className="relative">
            <div className="h-1.5 flex">
              <div className="flex-[2] bg-colombia-yellow" />
              <div className="flex-1 bg-colombia-blue" />
              <div className="flex-1 bg-colombia-red" />
            </div>
            <div className="bg-colombia-blue px-3 py-1.5 sm:px-4 sm:py-2">
              <p className="text-[8px] sm:text-[10px] text-colombia-yellow font-bold tracking-widest uppercase text-center leading-tight">
                {document.documentTypeHeader}
              </p>
            </div>
          </div>

          {/* Body content */}
          <div className="p-3 sm:p-4 flex gap-3 h-[calc(100%-52px)]">
            {/* Photo section */}
            <div className="shrink-0 flex flex-col items-center gap-1.5">
              <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                {document.photoUrl ? (
                  <Image
                    src={document.photoUrl}
                    alt={document.fullName}
                    width={80}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Fingerprint
                      size={28}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                )}
              </div>
              <Badge status={statusInfo.badgeStatus} size="sm" dot>
                {statusInfo.label}
              </Badge>
            </div>

            {/* Info section */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div className="space-y-1">
                <div>
                  <p className="text-[9px] sm:text-[10px] text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
                    Nombre completo
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-text-primary dark:text-text-primary-dark truncate">
                    {document.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
                    {document.documentType === 'CC'
                      ? 'Número de cédula'
                      : 'Número de documento'}
                  </p>
                  <p className="text-xs sm:text-sm font-bold font-mono text-colombia-blue dark:text-colombia-yellow">
                    {document.documentNumber}
                  </p>
                </div>
                <div className="flex gap-3">
                  {document.dateOfBirth && (
                    <div>
                      <p className="text-[9px] sm:text-[10px] text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
                        F. Nacimiento
                      </p>
                      <p className="text-[10px] sm:text-xs font-semibold text-text-primary dark:text-text-primary-dark">
                        {document.dateOfBirth}
                      </p>
                    </div>
                  )}
                  {document.bloodType && (
                    <div>
                      <p className="text-[9px] sm:text-[10px] text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
                        RH
                      </p>
                      <p className="text-[10px] sm:text-xs font-semibold text-colombia-red">
                        {document.bloodType}
                      </p>
                    </div>
                  )}
                  {document.gender && (
                    <div>
                      <p className="text-[9px] sm:text-[10px] text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
                        Sexo
                      </p>
                      <p className="text-[10px] sm:text-xs font-semibold text-text-primary dark:text-text-primary-dark">
                        {document.gender}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Full-screen button */}
              {onViewFullScreen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewFullScreen();
                  }}
                  className="self-end p-1 rounded text-text-secondary hover:text-colombia-blue dark:hover:text-colombia-yellow transition-colors"
                  aria-label="Ver en pantalla completa"
                >
                  <Maximize2 size={14} />
                </button>
              )}
            </div>

            {/* Mini QR code */}
            {document.qrValue && (
              <div className="shrink-0 hidden sm:flex flex-col items-center justify-end">
                <div className="bg-white p-1 rounded border border-gray-200">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <QRCode
                      value={document.qrValue}
                      size={44}
                      showTimestamp={false}
                      allowFullScreen={false}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Back Face ──────────────────────────────────────── */}
        <div
          className={cn(
            'absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden',
            'bg-gradient-to-br from-colombia-blue via-colombia-blue to-colombia-blue-dark',
            'border border-colombia-blue-dark',
            'shadow-lg'
          )}
        >
          {/* Header stripe */}
          <div className="h-1.5 flex">
            <div className="flex-[2] bg-colombia-yellow" />
            <div className="flex-1 bg-white/30" />
            <div className="flex-1 bg-colombia-red" />
          </div>

          <div className="p-4 flex flex-col items-center justify-center h-[calc(100%-6px)] gap-3">
            {/* QR Code section */}
            {document.qrValue ? (
              <div className="bg-white p-3 rounded-xl">
                <QRCode
                  value={document.qrValue}
                  size={100}
                  showTimestamp={false}
                  allowFullScreen={false}
                  fgColor="#003893"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-white/70">
                <StatusIcon size={20} />
                <span className="text-xs">Sin QR disponible</span>
              </div>
            )}

            {/* Additional info on back */}
            <div className="text-center space-y-1 w-full">
              {document.authority && (
                <p className="text-[9px] text-colombia-yellow/80 uppercase tracking-widest">
                  {document.authority}
                </p>
              )}
              {document.issuedDate && (
                <p className="text-[10px] text-white/70">
                  Expedido: {document.issuedDate}
                </p>
              )}
              {document.expirationDate && (
                <p className="text-[10px] text-white/70">
                  Vence: {document.expirationDate}
                </p>
              )}
              {document.placeOfBirth && (
                <p className="text-[10px] text-white/70">
                  Lugar de nacimiento: {document.placeOfBirth}
                </p>
              )}
            </div>

            {/* Additional fields */}
            {document.additionalFields && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
                {Object.entries(document.additionalFields).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <p className="text-[8px] text-white/50 uppercase">{key}</p>
                    <p className="text-[10px] text-white font-medium">{val}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tap hint */}
            <p className="text-[9px] text-white/40 mt-auto">
              Toque para voltear
            </p>
          </div>
        </div>
      </div>

      {/* Flip hint (only when front is visible) */}
      {!isFlipped && (
        <p className="text-center text-[10px] text-text-secondary dark:text-text-secondary-dark mt-2">
          Toque la tarjeta para ver el reverso
        </p>
      )}
    </div>
  );
}

export { DocumentCard };
