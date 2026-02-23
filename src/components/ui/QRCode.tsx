'use client';

import React, { useState, useCallback } from 'react';
import QRCodeLib from 'react-qr-code';
import { Maximize2, Minimize2, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface QRCodeProps {
  value: string;
  size?: number;
  title?: string;
  subtitle?: string;
  showTimestamp?: boolean;
  allowFullScreen?: boolean;
  refreshable?: boolean;
  onRefresh?: () => void;
  className?: string;
  bgColor?: string;
  fgColor?: string;
}

function QRCode({
  value,
  size = 200,
  title,
  subtitle,
  showTimestamp = true,
  allowFullScreen = true,
  refreshable = false,
  onRefresh,
  className,
  bgColor = '#FFFFFF',
  fgColor = '#003893',
}: QRCodeProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const handleRefresh = useCallback(() => {
    setLastRefreshed(new Date());
    onRefresh?.();
  }, [onRefresh]);

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const qrContent = (qrSize: number) => (
    <div className="flex flex-col items-center gap-3">
      {title && (
        <div className="text-center">
          <p className={cn(
            'font-bold',
            isFullScreen
              ? 'text-xl text-colombia-blue dark:text-colombia-yellow'
              : 'text-sm text-text-primary dark:text-text-primary-dark'
          )}>
            {title}
          </p>
          {subtitle && (
            <p className={cn(
              'text-text-secondary dark:text-text-secondary-dark',
              isFullScreen ? 'text-base mt-1' : 'text-xs mt-0.5'
            )}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <QRCodeLib
          value={value}
          size={qrSize}
          bgColor={bgColor}
          fgColor={fgColor}
          level="H"
        />
      </div>

      {showTimestamp && (
        <p className={cn(
          'text-text-secondary dark:text-text-secondary-dark font-mono',
          isFullScreen ? 'text-sm' : 'text-[10px]'
        )}>
          Generado: {formatTimestamp(lastRefreshed)}
        </p>
      )}

      <div className="flex items-center gap-2">
        {refreshable && (
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-colombia-blue/10 text-colombia-blue hover:bg-colombia-blue/20 dark:bg-colombia-yellow/10 dark:text-colombia-yellow dark:hover:bg-colombia-yellow/20 transition-colors"
          >
            <RefreshCw size={14} />
            Actualizar
          </button>
        )}
        {allowFullScreen && !isFullScreen && (
          <button
            onClick={() => setIsFullScreen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-text-secondary hover:bg-gray-200 dark:bg-gray-700 dark:text-text-secondary-dark dark:hover:bg-gray-600 transition-colors"
          >
            <Maximize2 size={14} />
            Pantalla completa
          </button>
        )}
      </div>
    </div>
  );

  // Full screen overlay for showing QR to officials
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6">
        {/* Close button */}
        <button
          onClick={() => setIsFullScreen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
          aria-label="Cerrar pantalla completa"
        >
          <X size={24} />
        </button>

        {/* Minimize button */}
        <button
          onClick={() => setIsFullScreen(false)}
          className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
          aria-label="Minimizar"
        >
          <Minimize2 size={24} />
        </button>

        {/* Colombia flag stripe decoration */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          <div className="flex-[2] bg-colombia-yellow" />
          <div className="flex-1 bg-colombia-blue" />
          <div className="flex-1 bg-colombia-red" />
        </div>

        <div className="animate-fade-in">
          {qrContent(Math.min(320, typeof window !== 'undefined' ? window.innerWidth - 80 : 280))}
        </div>

        {/* Bottom stripe */}
        <div className="absolute bottom-0 left-0 right-0 h-2 flex">
          <div className="flex-[2] bg-colombia-yellow" />
          <div className="flex-1 bg-colombia-blue" />
          <div className="flex-1 bg-colombia-red" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {qrContent(size)}
    </div>
  );
}

export { QRCode };
