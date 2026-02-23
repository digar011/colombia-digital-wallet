'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  X,
  Share2,
  Download,
  ShieldCheck,
  ShieldAlert,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge, type BadgeStatus } from '@/components/ui/Badge';
import { QRCode } from '@/components/ui/QRCode';

export interface DocumentViewerData {
  documentType: string;
  documentTypeHeader: string;
  documentNumber: string;
  fullName: string;
  status: 'valid' | 'expired' | 'pending' | 'revoked';
  qrValue: string;
  expirationDate?: string;
  authority?: string;
  additionalInfo?: Array<{ label: string; value: string }>;
}

export interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentViewerData;
  onShare?: () => void;
  onDownload?: () => void;
  onRefreshQR?: () => void;
}

function getStatusInfo(status: string): {
  label: string;
  badgeStatus: BadgeStatus;
  Icon: typeof ShieldCheck;
  color: string;
} {
  switch (status) {
    case 'valid':
      return { label: 'Documento vigente', badgeStatus: 'valid', Icon: ShieldCheck, color: 'text-green-500' };
    case 'expired':
      return { label: 'Documento vencido', badgeStatus: 'expired', Icon: ShieldAlert, color: 'text-red-500' };
    case 'pending':
      return { label: 'En trámite', badgeStatus: 'pending', Icon: Shield, color: 'text-yellow-500' };
    case 'revoked':
      return { label: 'Documento revocado', badgeStatus: 'revoked', Icon: ShieldAlert, color: 'text-red-500' };
    default:
      return { label: status, badgeStatus: 'default', Icon: Shield, color: 'text-gray-500' };
  }
}

function DocumentViewer({
  isOpen,
  onClose,
  document: doc,
  onShare,
  onDownload,
  onRefreshQR,
}: DocumentViewerProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const statusInfo = getStatusInfo(doc.status);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Swipe-to-close handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart === null) return;
      const delta = e.touches[0].clientY - touchStart;
      // Only allow downward swipe
      if (delta > 0) {
        setTouchDelta(delta);
      }
    },
    [touchStart]
  );

  const handleTouchEnd = useCallback(() => {
    if (touchDelta > 120) {
      onClose();
    }
    setTouchStart(null);
    setTouchDelta(0);
    setIsDragging(false);
  }, [touchDelta, onClose]);

  // Keyboard close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-gray-900"
      style={{
        transform: isDragging ? `translateY(${touchDelta}px)` : 'translateY(0)',
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        opacity: isDragging ? Math.max(0.5, 1 - touchDelta / 400) : 1,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Colombia flag top stripe */}
      <div className="h-1.5 flex shrink-0">
        <div className="flex-[2] bg-colombia-yellow" />
        <div className="flex-1 bg-colombia-blue" />
        <div className="flex-1 bg-colombia-red" />
      </div>

      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:text-text-primary-dark dark:hover:bg-gray-800 transition-colors"
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>

        <h2 className="text-sm font-bold text-text-primary dark:text-text-primary-dark uppercase tracking-wider">
          {doc.documentType}
        </h2>

        <div className="flex items-center gap-1">
          {onShare && (
            <button
              onClick={onShare}
              className="p-2 rounded-lg text-text-secondary hover:text-colombia-blue hover:bg-colombia-blue/10 dark:text-text-secondary-dark dark:hover:text-colombia-yellow dark:hover:bg-colombia-yellow/10 transition-colors"
              aria-label="Compartir"
            >
              <Share2 size={20} />
            </button>
          )}
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-2 rounded-lg text-text-secondary hover:text-colombia-blue hover:bg-colombia-blue/10 dark:text-text-secondary-dark dark:hover:text-colombia-yellow dark:hover:bg-colombia-yellow/10 transition-colors"
              aria-label="Descargar"
            >
              <Download size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Main content - scrollable */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pb-safe-bottom">
        {/* Document header info */}
        <div className="text-center mt-4 mb-6">
          <p className="text-xs text-text-secondary dark:text-text-secondary-dark uppercase tracking-widest mb-1">
            {doc.documentTypeHeader}
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
            {doc.fullName}
          </h1>
          <p className="text-lg font-mono font-bold text-colombia-blue dark:text-colombia-yellow mt-1">
            {doc.documentNumber}
          </p>
        </div>

        {/* Status indicator */}
        <div className={cn('flex items-center gap-2 mb-6', statusInfo.color)}>
          <statusInfo.Icon size={24} />
          <Badge status={statusInfo.badgeStatus} size="md" dot>
            {statusInfo.label}
          </Badge>
        </div>

        {/* Large QR code */}
        <div className="w-full max-w-xs mx-auto mb-6">
          <QRCode
            value={doc.qrValue}
            size={240}
            title="Código de verificación"
            subtitle="Escanee para validar el documento"
            showTimestamp
            refreshable={!!onRefreshQR}
            onRefresh={onRefreshQR}
            allowFullScreen={false}
            fgColor="#003893"
          />
        </div>

        {/* Additional info */}
        {doc.additionalInfo && doc.additionalInfo.length > 0 && (
          <div className="w-full max-w-sm space-y-2 mb-6">
            {doc.additionalInfo.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <span className="text-xs text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {doc.expirationDate && (
          <p className="text-xs text-text-secondary dark:text-text-secondary-dark mb-4">
            Fecha de vencimiento: <span className="font-semibold">{doc.expirationDate}</span>
          </p>
        )}

        {doc.authority && (
          <p className="text-[10px] text-text-secondary/60 dark:text-text-secondary-dark/60 uppercase tracking-widest text-center mb-6">
            {doc.authority}
          </p>
        )}

        {/* Swipe hint */}
        <div className="flex flex-col items-center gap-1 mt-auto py-4 text-text-secondary/40 dark:text-text-secondary-dark/40">
          <ChevronDown size={20} />
          <p className="text-[10px]">Deslice hacia abajo para cerrar</p>
        </div>
      </div>

      {/* Colombia flag bottom stripe */}
      <div className="h-1.5 flex shrink-0">
        <div className="flex-[2] bg-colombia-yellow" />
        <div className="flex-1 bg-colombia-blue" />
        <div className="flex-1 bg-colombia-red" />
      </div>
    </div>
  );
}

export { DocumentViewer };
