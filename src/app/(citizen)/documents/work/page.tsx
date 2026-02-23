'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  Building2,
  Briefcase,
  Landmark,
  Shield,
  PiggyBank,
  Download,
  ChevronDown,
  ChevronUp,
  Loader2,
  Wallet,
  BadgeCheck,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockWork, formatShortDate, formatCOPCurrency } from '@/lib/mock/citizenData';

// ─── Download Certificate Mock ───────────────────────────────────────────────

function handleDownload(certName: string) {
  // In production this would trigger a real download
  alert(`Descargando certificado: ${certName}\n\n(Esta es una funcion de demostrado. En produccion se generaria el PDF real.)`);
}

// ─── Work & Tax Page ─────────────────────────────────────────────────────────

export default function WorkPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showResponsibilities, setShowResponsibilities] = useState(false);

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
            Cargando datos laborales...
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
              Trabajo e Impuestos
            </h1>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              RUT, empleo y seguridad social
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* ── RUT Card ── */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-amber-700 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <FileText size={22} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-[10px] font-medium uppercase tracking-wider">
                  Registro Unico Tributario
                </p>
                <p className="text-white font-bold text-lg">RUT</p>
              </div>
              <div className="ml-auto">
                <Badge status="active" size="sm" dot>
                  Activo
                </Badge>
              </div>
            </div>

            {/* NIT display */}
            <div className="bg-white/10 rounded-lg px-4 py-2 inline-flex items-center gap-2">
              <span className="text-white/70 text-xs">NIT:</span>
              <span className="text-white font-mono font-bold text-xl tracking-wider">
                {mockWork.rut.fullNit}
              </span>
            </div>
          </div>

          <CardBody className="py-3 px-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Actividad Principal
              </span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark text-right max-w-[60%]">
                {mockWork.rut.mainActivity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Codigo CIIU
              </span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                {mockWork.rut.activityCode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Regimen
              </span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                {mockWork.rut.regime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Registro
              </span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                {formatShortDate(mockWork.rut.registrationDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Ultima actualizacion
              </span>
              <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark">
                {formatShortDate(mockWork.rut.lastUpdate)}
              </span>
            </div>

            {/* Responsibilities */}
            <button
              onClick={() => setShowResponsibilities(!showResponsibilities)}
              className="w-full flex items-center justify-center gap-1 mt-2 py-2 text-xs font-medium text-colombia-blue dark:text-colombia-yellow hover:underline"
            >
              Responsabilidades ({mockWork.rut.responsibilities.length})
              {showResponsibilities ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showResponsibilities && (
              <div className="space-y-1.5 animate-slide-down">
                {mockWork.rut.responsibilities.map((resp, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <BadgeCheck size={12} className="text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-text-primary dark:text-text-primary-dark">
                      {resp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* ── Employment Info ── */}
        {mockWork.employment && (
          <Card variant="elevated" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Briefcase size={20} className="text-colombia-blue" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
                  Empleo Actual
                </h3>
                <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                  {mockWork.employment.employer}
                </p>
              </div>
              <Badge status="active" size="sm">
                Activo
              </Badge>
            </div>

            <div className="space-y-2">
              <InfoRow label="Cargo" value={mockWork.employment.position} />
              <InfoRow label="Departamento" value={mockWork.employment.department} />
              <InfoRow label="Tipo de Contrato" value={mockWork.employment.contractType} />
              <InfoRow label="NIT Empleador" value={mockWork.employment.employerNit} />
              <InfoRow label="Inicio" value={formatShortDate(mockWork.employment.startDate)} />
              <InfoRow label="Salario" value={formatCOPCurrency(mockWork.employment.salary)} />
            </div>
          </Card>
        )}

        {/* ── Pension Fund ── */}
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <PiggyBank size={20} className="text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
                Fondo de Pensiones
              </h3>
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                {mockWork.pension.fund}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <InfoRow label="Tipo" value={mockWork.pension.type} />
            <InfoRow label="No. Afiliacion" value={mockWork.pension.affiliationNumber} />
            <InfoRow
              label="Semanas Cotizadas"
              value={`${mockWork.pension.weeksContributed} semanas`}
            />
          </div>
        </Card>

        {/* ── ARL ── */}
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Shield size={20} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
                ARL
              </h3>
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                {mockWork.arl.name}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <InfoRow label="Nivel de Riesgo" value={`Nivel ${mockWork.arl.riskLevel}`} />
            <InfoRow label="No. Afiliacion" value={mockWork.arl.affiliationNumber} />
          </div>
        </Card>

        {/* ── Cesantias ── */}
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <Wallet size={20} className="text-violet-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
                Cesantias
              </h3>
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                {mockWork.cesantias.fund}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
              <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Saldo Disponible
              </span>
              <span className="text-lg font-bold text-violet-700 dark:text-violet-400">
                {formatCOPCurrency(mockWork.cesantias.balance)}
              </span>
            </div>
            <InfoRow label="Ultimo Deposito" value={formatShortDate(mockWork.cesantias.lastDeposit)} />
          </div>
        </Card>

        {/* ── Caja de Compensacion ── */}
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
              <Building2 size={20} className="text-cyan-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
                Caja de Compensacion
              </h3>
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                {mockWork.caja.name}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <InfoRow label="No. Afiliacion" value={mockWork.caja.affiliationNumber} />
            <InfoRow label="Categoria" value={mockWork.caja.category} />
          </div>
        </Card>

        {/* ── Download Certificates ── */}
        <Card variant="elevated" padding="md">
          <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark mb-3">
            Descargar Certificados
          </h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              fullWidth
              size="sm"
              leftIcon={Download}
              onClick={() => handleDownload('Certificado RUT')}
            >
              Certificado RUT (DIAN)
            </Button>
            <Button
              variant="outline"
              fullWidth
              size="sm"
              leftIcon={Download}
              onClick={() => handleDownload('Certificado Laboral')}
            >
              Certificado Laboral
            </Button>
            <Button
              variant="outline"
              fullWidth
              size="sm"
              leftIcon={Download}
              onClick={() => handleDownload('Certificado Pension')}
            >
              Certificado Afiliacion Pension
            </Button>
            <Button
              variant="outline"
              fullWidth
              size="sm"
              leftIcon={Download}
              onClick={() => handleDownload('Certificado ARL')}
            >
              Certificado Afiliacion ARL
            </Button>
            <Button
              variant="outline"
              fullWidth
              size="sm"
              leftIcon={Download}
              onClick={() => handleDownload('Certificado Cesantias')}
            >
              Certificado Cesantias
            </Button>
          </div>
        </Card>

        {/* ── Footer note ── */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Landmark size={16} className="text-colombia-blue flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Informacion tributaria sincronizada con la DIAN. Datos laborales y de
            seguridad social del sistema PILA.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Info Row ────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
        {label}
      </span>
      <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark text-right max-w-[60%]">
        {value}
      </span>
    </div>
  );
}
