'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Maximize2,
  RotateCw,
  Shield,
  BadgeCheck,
  Copy,
  Check,
  Loader2,
  Fingerprint,
  QrCode,
  X,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  mockCitizen,
  mockDocuments,
  formatColombianDate,
} from '@/lib/mock/citizenData';

// ─── Age calculation helper ─────────────────────────────────────────────────

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// ─── Digital Identity Document Page ─────────────────────────────────────────

export default function IdentityPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const citizenAge = calculateAge(mockCitizen.dateOfBirth);
  const isMinor = citizenAge < 18;
  const documentTitle = isMinor ? 'Tarjeta de Identidad' : 'Cedula de Ciudadania';
  const documentShort = isMinor ? 'TI' : 'CC';
  const documentPrefix = isMinor ? 'TI' : 'CC';

  const cedulaDoc = mockDocuments.find((d) => d.type === 'identity');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(mockCitizen.documentNumber).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-colombia-blue" />
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Cargando documento digital...
          </p>
        </div>
      </div>
    );
  }

  // ── Full-screen overlay ──
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4">
        <button
          onClick={() => setIsFullScreen(false)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
        >
          <X size={24} className="text-white" />
        </button>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors text-white text-sm"
        >
          <RotateCw size={16} />
          {isFlipped ? 'Ver frente' : 'Ver respaldo'}
        </button>

        <div className="w-full max-w-md">
          {!isFlipped ? (
            <CedulaFront fullscreen isMinor={isMinor} documentTitle={documentTitle} documentShort={documentShort} />
          ) : (
            <CedulaBack fullscreen isMinor={isMinor} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark pb-20">
      {/* ── Header ── */}
      <div className="bg-white dark:bg-gray-800 px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} className="text-text-primary dark:text-text-primary-dark" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
              {documentTitle}
            </h1>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              Documento digital verificado
            </p>
          </div>
          <Badge status="active" size="sm" dot>
            Vigente
          </Badge>
        </div>
      </div>

      {/* ── Card Display ── */}
      <div className="px-4 mt-6">
        <div className="relative" style={{ perspective: '1200px' }}>
          <div
            className={`transition-transform duration-700 relative`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front */}
            <div
              style={{ backfaceVisibility: 'hidden' }}
              className={isFlipped ? 'invisible absolute inset-0' : ''}
            >
              <CedulaFront isMinor={isMinor} documentTitle={documentTitle} documentShort={documentShort} />
            </div>

            {/* Back */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              className={!isFlipped ? 'invisible absolute inset-0' : ''}
            >
              <CedulaBack isMinor={isMinor} />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <Button
            variant="outline"
            size="sm"
            leftIcon={RotateCw}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {isFlipped ? 'Ver frente' : 'Ver respaldo'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={Maximize2}
            onClick={() => setIsFullScreen(true)}
          >
            Pantalla completa
          </Button>
        </div>
      </div>

      {/* ── Document Details ── */}
      <div className="px-4 mt-6 space-y-4">
        {/* Verification Status */}
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <BadgeCheck size={20} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">
                Documento Verificado
              </p>
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Validado con la Registraduria Nacional
              </p>
            </div>
            <Badge status="active" size="sm">
              Verificado
            </Badge>
          </div>
        </Card>

        {/* Personal Info */}
        <Card variant="elevated">
          <CardBody>
            <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark mb-3">
              Informacion Personal
            </h3>
            <div className="space-y-3">
              <InfoRow label="Nombre Completo" value={mockCitizen.fullName} />
              <InfoRow
                label="Numero de Documento"
                value={`${documentPrefix} ${mockCitizen.documentNumber}`}
                copyable
                onCopy={handleCopy}
                isCopied={copied}
              />
              <InfoRow
                label="Fecha de Nacimiento"
                value={formatColombianDate(mockCitizen.dateOfBirth)}
              />
              <InfoRow label="Lugar de Nacimiento" value={mockCitizen.placeOfBirth} />
              <InfoRow
                label="Genero"
                value={mockCitizen.gender === 'M' ? 'Masculino' : 'Femenino'}
              />
              <InfoRow
                label="Grupo Sanguineo"
                value={`${mockCitizen.bloodType}${mockCitizen.rh}`}
              />
            </div>
          </CardBody>
        </Card>

        {/* Document Info */}
        <Card variant="elevated">
          <CardBody>
            <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark mb-3">
              Datos del Documento
            </h3>
            <div className="space-y-3">
              <InfoRow
                label="Autoridad Emisora"
                value="Registraduria Nacional del Estado Civil"
              />
              <InfoRow
                label="Fecha de Expedicion"
                value={cedulaDoc ? formatColombianDate(cedulaDoc.issueDate) : 'N/A'}
              />
              <InfoRow label="Vigencia" value="Sin vencimiento" />
              <InfoRow
                label="Ultima Verificacion"
                value={new Date(mockCitizen.lastVerified).toLocaleString('es-CO')}
              />
            </div>
          </CardBody>
        </Card>

        {/* Security */}
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-colombia-blue/10 flex items-center justify-center">
              <Shield size={20} className="text-colombia-blue" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">
                Proteccion Biometrica
              </p>
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Este documento esta protegido con huella digital
              </p>
            </div>
            <Fingerprint size={20} className="text-colombia-blue" />
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Cedula Front Component ──────────────────────────────────────────────────

function CedulaFront({ fullscreen = false, isMinor = false, documentTitle = 'Cedula de Ciudadania', documentShort = 'CC' }: { fullscreen?: boolean; isMinor?: boolean; documentTitle?: string; documentShort?: string }) {
  return (
    <div
      className={`bg-gradient-to-br ${isMinor ? 'from-emerald-700 via-emerald-600 to-emerald-800' : 'from-colombia-blue via-colombia-blue to-colombia-blue-dark'} rounded-2xl overflow-hidden shadow-xl ${
        fullscreen ? 'p-6' : 'p-5'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`${isMinor ? 'text-emerald-200' : 'text-colombia-yellow'} text-[10px] font-semibold uppercase tracking-[0.2em]`}>
            Republica de Colombia
          </p>
          <p className="text-white text-xs font-bold mt-0.5">
            {documentTitle}
          </p>
        </div>
        {/* Coat of Arms placeholder */}
        <div className={`w-10 h-10 rounded-full ${isMinor ? 'bg-emerald-200/20 border-emerald-200/30' : 'bg-colombia-yellow/20 border-colombia-yellow/30'} flex items-center justify-center border`}>
          <span className={`${isMinor ? 'text-emerald-200' : 'text-colombia-yellow'} text-lg`}>{documentShort}</span>
        </div>
      </div>

      {/* Photo and info */}
      <div className="flex gap-4">
        {/* Photo placeholder */}
        <div className="w-20 h-24 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 border border-white/10">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-white/30 mx-auto mb-1" />
            <p className="text-white/50 text-[8px]">FOTO</p>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div>
            <p className="text-white/60 text-[8px] uppercase tracking-wider">
              Apellidos
            </p>
            <p className="text-white text-xs font-bold">
              {mockCitizen.firstLastName.toUpperCase()} {mockCitizen.secondLastName.toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-white/60 text-[8px] uppercase tracking-wider">
              Nombres
            </p>
            <p className="text-white text-xs font-bold">
              {mockCitizen.firstName.toUpperCase()} {mockCitizen.secondName.toUpperCase()}
            </p>
          </div>
          <div className="flex gap-3">
            <div>
              <p className="text-white/60 text-[8px] uppercase tracking-wider">
                Numero
              </p>
              <p className={`${isMinor ? 'text-emerald-200' : 'text-colombia-yellow'} text-sm font-bold tracking-wider`}>
                {mockCitizen.documentNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
        <div className="flex gap-4">
          <div>
            <p className="text-white/60 text-[8px] uppercase">F. Nacimiento</p>
            <p className="text-white text-[10px] font-medium">
              {mockCitizen.dateOfBirth.split('-').reverse().join('/')}
            </p>
          </div>
          <div>
            <p className="text-white/60 text-[8px] uppercase">Sexo</p>
            <p className="text-white text-[10px] font-medium">
              {mockCitizen.gender}
            </p>
          </div>
          <div>
            <p className="text-white/60 text-[8px] uppercase">RH</p>
            <p className="text-white text-[10px] font-medium">
              {mockCitizen.bloodType}{mockCitizen.rh}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-green-500/20 rounded-full px-2 py-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-gentle" />
          <span className="text-green-300 text-[8px] font-semibold">DIGITAL</span>
        </div>
      </div>
    </div>
  );
}

// ─── Cedula Back Component ───────────────────────────────────────────────────

function CedulaBack({ fullscreen = false, isMinor = false }: { fullscreen?: boolean; isMinor?: boolean }) {
  const cedulaDoc = mockDocuments.find((d) => d.type === 'identity');

  return (
    <div
      className={`bg-gradient-to-br ${isMinor ? 'from-emerald-800 via-emerald-700 to-emerald-600' : 'from-colombia-blue-dark via-colombia-blue to-colombia-blue'} rounded-2xl overflow-hidden shadow-xl ${
        fullscreen ? 'p-6' : 'p-5'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className={`${isMinor ? 'text-emerald-200' : 'text-colombia-yellow'} text-[10px] font-semibold uppercase tracking-[0.2em]`}>
          Republica de Colombia
        </p>
        <p className="text-white/60 text-[9px]">RESPALDO</p>
      </div>

      {/* QR Code placeholder */}
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
          <div className="text-center">
            <QrCode size={48} className="text-colombia-blue mx-auto" />
            <p className="text-colombia-blue text-[7px] font-medium mt-1">
              QR VERIFICACION
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div>
            <p className="text-white/60 text-[8px] uppercase tracking-wider">
              Lugar de Nacimiento
            </p>
            <p className="text-white text-[10px] font-medium">
              {mockCitizen.placeOfBirth}
            </p>
          </div>
          <div>
            <p className="text-white/60 text-[8px] uppercase tracking-wider">
              Fecha de Expedicion
            </p>
            <p className="text-white text-[10px] font-medium">
              {cedulaDoc ? cedulaDoc.issueDate.split('-').reverse().join('/') : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-white/60 text-[8px] uppercase tracking-wider">
              Lugar de Expedicion
            </p>
            <p className="text-white text-[10px] font-medium">Bogota D.C.</p>
          </div>
        </div>
      </div>

      {/* Digital Signature area */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-[8px] uppercase tracking-wider">
              Firma Digital
            </p>
            <p className={`${isMinor ? 'text-emerald-200' : 'text-colombia-yellow'} text-[9px] font-mono tracking-wider mt-0.5`}>
              DSig:A3F8...K92B
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-[8px] uppercase tracking-wider">
              Huella Digital
            </p>
            <Fingerprint size={18} className={`${isMinor ? 'text-emerald-200' : 'text-colombia-yellow'} ml-auto mt-0.5`} />
          </div>
        </div>
      </div>

      {/* Machine-readable zone */}
      <div className="mt-3 pt-2 border-t border-white/10">
        <p className="text-white/30 text-[7px] font-mono tracking-[0.15em] leading-relaxed">
          {isMinor ? 'TICOL' : 'IDCOL'}{mockCitizen.documentNumber}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
          <br />
          {mockCitizen.dateOfBirth.replace(/-/g, '')}M{mockCitizen.firstLastName.toUpperCase()}&lt;&lt;{mockCitizen.firstName.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

// ─── Info Row ────────────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  copyable = false,
  onCopy,
  isCopied,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: () => void;
  isCopied?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
          {value}
        </span>
        {copyable && onCopy && (
          <button
            onClick={onCopy}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isCopied ? (
              <Check size={14} className="text-green-500" />
            ) : (
              <Copy size={14} className="text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
