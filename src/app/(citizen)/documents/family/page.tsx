'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  UserPlus,
  Heart,
  Baby,
  User,
  Calendar,
  IdCard,
  CreditCard,
  ChevronRight,
  Loader2,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockFamily, mockCitizen, formatColombianDate, formatShortDate } from '@/lib/mock/citizenData';
import type { FamilyMember } from '@/lib/mock/citizenData';

// ─── Relationship icons & colors ─────────────────────────────────────────────

const relationshipConfig: Record<
  string,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  spouse: { icon: Heart, color: 'text-rose-600', bgColor: 'bg-rose-50' },
  child: { icon: Baby, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  parent: { icon: User, color: 'text-green-600', bgColor: 'bg-green-50' },
  sibling: { icon: Users, color: 'text-violet-600', bgColor: 'bg-violet-50' },
};

// ─── Document Type Label ─────────────────────────────────────────────────────

function docTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    CC: 'Cedula de Ciudadania',
    TI: 'Tarjeta de Identidad',
    RC: 'Registro Civil',
    CE: 'Cedula de Extranjeria',
  };
  return labels[type] || type;
}

// ─── Family Member Card ──────────────────────────────────────────────────────

function FamilyMemberCard({ member }: { member: FamilyMember }) {
  const [expanded, setExpanded] = useState(false);
  const config = relationshipConfig[member.relationship] || relationshipConfig.sibling;
  const Icon = config.icon;

  const isMinor = member.documentType === 'TI' || member.documentType === 'RC';

  return (
    <Card variant="elevated" className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-center gap-3 p-4">
          {/* Avatar */}
          <div
            className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}
          >
            <Icon size={22} className={config.color} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-primary dark:text-text-primary-dark truncate">
              {member.fullName}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge status="info" size="sm">
                {member.relationshipLabel}
              </Badge>
              <span className="text-[10px] text-text-secondary dark:text-text-secondary-dark">
                {member.documentType} {member.documentNumber}
              </span>
            </div>
          </div>

          <ChevronRight
            size={16}
            className={`text-gray-300 transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 animate-slide-down">
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-3">
            {/* Personal info */}
            <div className="space-y-2">
              <InfoRow
                icon={IdCard}
                label="Tipo Documento"
                value={docTypeLabel(member.documentType)}
              />
              <InfoRow
                icon={CreditCard}
                label="Numero"
                value={`${member.documentType} ${member.documentNumber}`}
              />
              <InfoRow
                icon={Calendar}
                label="Fecha de Nacimiento"
                value={formatColombianDate(member.dateOfBirth)}
              />
              <InfoRow
                icon={User}
                label="Genero"
                value={member.gender === 'M' ? 'Masculino' : 'Femenino'}
              />
              <InfoRow
                icon={Users}
                label="Vinculado desde"
                value={formatShortDate(member.linkedDate)}
              />
            </div>

            {/* TI Card Preview for children */}
            {isMinor && (
              <div className="mt-3">
                <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider mb-2">
                  Documento Digital
                </p>
                <MinorDocumentCard member={member} />
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Minor Document Card (TI / RC) ──────────────────────────────────────────

function MinorDocumentCard({ member }: { member: FamilyMember }) {
  const isTI = member.documentType === 'TI';
  const gradient = isTI
    ? 'from-colombia-blue to-colombia-blue-light'
    : 'from-teal-500 to-teal-700';

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-4 shadow-md`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-white/70 text-[8px] font-semibold uppercase tracking-[0.2em]">
            Republica de Colombia
          </p>
          <p className="text-white text-[10px] font-bold mt-0.5">
            {isTI ? 'Tarjeta de Identidad' : 'Registro Civil'}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
          <span className="text-white/80 text-[10px] font-bold">CO</span>
        </div>
      </div>

      {/* Photo placeholder and info */}
      <div className="flex gap-3">
        <div className="w-14 h-16 rounded bg-white/20 flex items-center justify-center flex-shrink-0">
          <User size={20} className="text-white/40" />
        </div>
        <div className="flex-1 space-y-1">
          <div>
            <p className="text-white/50 text-[7px] uppercase">Nombres</p>
            <p className="text-white text-[10px] font-bold">
              {member.firstName.toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-white/50 text-[7px] uppercase">Apellidos</p>
            <p className="text-white text-[10px] font-bold">
              {member.lastName.toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-white/50 text-[7px] uppercase">Numero</p>
            <p className="text-colombia-yellow text-xs font-bold tracking-wider">
              {member.documentNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
        <div>
          <p className="text-white/50 text-[7px] uppercase">F. Nacimiento</p>
          <p className="text-white text-[9px] font-medium">
            {member.dateOfBirth.split('-').reverse().join('/')}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-0.5">
          <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse-gentle" />
          <span className="text-white/70 text-[7px] font-semibold">DIGITAL</span>
        </div>
      </div>
    </div>
  );
}

// ─── Info Row ────────────────────────────────────────────────────────────────

function InfoRow({
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
      <Icon size={14} className="text-text-secondary dark:text-text-secondary-dark flex-shrink-0" />
      <span className="text-xs text-text-secondary dark:text-text-secondary-dark min-w-0">
        {label}:
      </span>
      <span className="text-xs font-medium text-text-primary dark:text-text-primary-dark ml-auto text-right">
        {value}
      </span>
    </div>
  );
}

// ─── Add Family Member Modal ─────────────────────────────────────────────────

function AddFamilyMemberForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    relationship: '',
    documentType: '',
    documentNumber: '',
    dateOfBirth: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      'Solicitud enviada para vinculacion.\n\n(En produccion, esto enviaria una solicitud de verificacion a la Registraduria.)'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-base font-bold text-text-primary dark:text-text-primary-dark">
            Vincular Familiar
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input
            label="Nombres"
            placeholder="Ej: Maria Elena"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
          <Input
            label="Apellidos"
            placeholder="Ej: Lopez Herrera"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />

          {/* Relationship select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
              Parentesco
            </label>
            <select
              className="h-10 px-3.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-colombia-blue/30"
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="spouse">Conyuge</option>
              <option value="child">Hijo/a</option>
              <option value="parent">Padre/Madre</option>
              <option value="sibling">Hermano/a</option>
            </select>
          </div>

          {/* Document type select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
              Tipo de Documento
            </label>
            <select
              className="h-10 px-3.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-colombia-blue/30"
              value={formData.documentType}
              onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="CC">Cedula de Ciudadania</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="RC">Registro Civil</option>
              <option value="CE">Cedula de Extranjeria</option>
            </select>
          </div>

          <Input
            label="Numero de Documento"
            placeholder="Ej: 1234567890"
            value={formData.documentNumber}
            onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
            required
          />
          <Input
            label="Fecha de Nacimiento"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            required
          />

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button variant="primary" fullWidth type="submit">
              Solicitar Vinculacion
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Family Page ─────────────────────────────────────────────────────────────

export default function FamilyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

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
            Cargando grupo familiar...
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
              Mi Familia
            </h1>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              {mockFamily.length} miembro{mockFamily.length !== 1 ? 's' : ''} vinculado{mockFamily.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={UserPlus}
            onClick={() => setShowAddForm(true)}
          >
            Agregar
          </Button>
        </div>
      </div>

      {/* ── Titular Card ── */}
      <div className="px-4 mt-4">
        <Card variant="outlined" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-colombia-yellow flex items-center justify-center">
              <span className="text-colombia-blue font-bold text-lg">
                {mockCitizen.firstName[0]}{mockCitizen.firstLastName[0]}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
                {mockCitizen.fullName}
              </p>
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Titular &middot; CC {mockCitizen.documentNumber}
              </p>
            </div>
            <Badge status="active" size="sm" dot>
              Titular
            </Badge>
          </div>
        </Card>
      </div>

      {/* ── Family Members ── */}
      <div className="px-4 mt-4 space-y-3">
        <h2 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
          Familiares Vinculados
        </h2>
        {mockFamily.map((member) => (
          <FamilyMemberCard key={member.id} member={member} />
        ))}
      </div>

      {/* ── Note ── */}
      <div className="px-4 mt-6">
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Users size={16} className="text-colombia-blue flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            La vinculacion familiar requiere verificacion con la Registraduria Nacional
            del Estado Civil. Los documentos de menores de edad se muestran como respaldo digital.
          </p>
        </div>
      </div>

      {/* ── Add Family Member Modal ── */}
      {showAddForm && <AddFamilyMemberForm onClose={() => setShowAddForm(false)} />}
    </div>
  );
}
