'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Phone,
  Flame,
  HeartPulse,
  Shield,
  Baby,
  AlertTriangle,
  Mountain,
  Loader2,
  PhoneCall,
  AlertOctagon,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { getCountryConfig } from '@/config';

// ─── Emergency category config ───────────────────────────────────────────────

interface EmergencyCategory {
  key: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  ringColor: string;
  description: string;
}

const emergencyCategories: EmergencyCategory[] = [
  {
    key: 'general',
    label: 'Emergencias',
    icon: Phone,
    color: 'text-white',
    bgColor: 'bg-colombia-red',
    ringColor: 'ring-colombia-red/30',
    description: 'Linea unica de emergencias',
  },
  {
    key: 'police',
    label: 'Policia Nacional',
    icon: Shield,
    color: 'text-white',
    bgColor: 'bg-colombia-blue',
    ringColor: 'ring-colombia-blue/30',
    description: 'Seguridad y orden publico',
  },
  {
    key: 'fire',
    label: 'Bomberos',
    icon: Flame,
    color: 'text-white',
    bgColor: 'bg-orange-600',
    ringColor: 'ring-orange-300',
    description: 'Incendios y rescate',
  },
  {
    key: 'ambulance',
    label: 'Cruz Roja',
    icon: HeartPulse,
    color: 'text-white',
    bgColor: 'bg-red-600',
    ringColor: 'ring-red-300',
    description: 'Emergencias medicas y ambulancia',
  },
  {
    key: 'domesticViolence',
    label: 'Violencia de Genero',
    icon: AlertTriangle,
    color: 'text-white',
    bgColor: 'bg-violet-600',
    ringColor: 'ring-violet-300',
    description: 'Orientacion y proteccion',
  },
  {
    key: 'childProtection',
    label: 'ICBF Linea Ninez',
    icon: Baby,
    color: 'text-white',
    bgColor: 'bg-teal-600',
    ringColor: 'ring-teal-300',
    description: 'Proteccion de ninos y adolescentes',
  },
  {
    key: 'civilDefense',
    label: 'Defensa Civil',
    icon: Shield,
    color: 'text-white',
    bgColor: 'bg-amber-600',
    ringColor: 'ring-amber-300',
    description: 'Prevencion y atencion de desastres',
  },
  {
    key: 'disasterRisk',
    label: 'Gestion del Riesgo',
    icon: Mountain,
    color: 'text-white',
    bgColor: 'bg-gray-700',
    ringColor: 'ring-gray-400',
    description: 'Emergencias por desastres naturales',
  },
];

// ─── Emergency Button ────────────────────────────────────────────────────────

function EmergencyButton({
  category,
  number,
}: {
  category: EmergencyCategory;
  number: string;
}) {
  const Icon = category.icon;

  const handleCall = () => {
    // On mobile devices, this opens the dialer
    if (typeof window !== 'undefined') {
      window.location.href = `tel:${number}`;
    }
  };

  return (
    <button
      onClick={handleCall}
      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl ${category.bgColor} shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 ring-4 ${category.ringColor} w-full min-h-[130px] focus:outline-none focus:ring-4`}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
        <Icon size={24} className={category.color} />
      </div>

      {/* Number (large) */}
      <p className="text-white text-2xl font-black tracking-wider">{number}</p>

      {/* Label */}
      <p className="text-white/90 text-[10px] font-medium mt-1 text-center leading-tight">
        {category.label}
      </p>

      {/* Phone indicator */}
      <div className="absolute top-2 right-2">
        <PhoneCall size={12} className="text-white/50" />
      </div>
    </button>
  );
}

// ─── Emergency Page ──────────────────────────────────────────────────────────

export default function EmergencyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const config = getCountryConfig('CO');
  const emergencyNumbers = config.emergencyNumbers;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-colombia-red" />
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Cargando numeros de emergencia...
          </p>
        </div>
      </div>
    );
  }

  // Get the general emergency number for the SOS button
  const generalNumber = emergencyNumbers.general?.number || '123';

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
              Numeros de Emergencia
            </h1>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              Colombia &middot; Toca para llamar
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* ── SOS Button ── */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = `tel:${generalNumber}`;
            }
          }}
          className="w-full bg-colombia-red rounded-2xl p-6 shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all duration-200 ring-4 ring-colombia-red/30 focus:outline-none focus:ring-4 focus:ring-colombia-red/50"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center animate-pulse-gentle">
              <AlertOctagon size={36} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-white text-3xl font-black">SOS</p>
              <p className="text-white/80 text-sm font-medium">
                Llamar al {generalNumber}
              </p>
              <p className="text-white/60 text-xs mt-0.5">
                Linea unica de emergencias
              </p>
            </div>
          </div>
        </button>

        {/* ── Emergency Numbers Grid ── */}
        <div>
          <h2 className="text-sm font-bold text-text-primary dark:text-text-primary-dark mb-3">
            Lineas de Atencion
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {emergencyCategories.map((category) => {
              const emergencyEntry = emergencyNumbers[category.key as keyof typeof emergencyNumbers];
              if (!emergencyEntry) return null;

              return (
                <EmergencyButton
                  key={category.key}
                  category={category}
                  number={emergencyEntry.number}
                />
              );
            })}
          </div>
        </div>

        {/* ── Additional info ── */}
        <Card variant="outlined" padding="md">
          <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark mb-2">
            Informacion Importante
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-colombia-blue mt-1.5 flex-shrink-0" />
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                El <span className="font-semibold">123</span> es la linea unica de emergencias. Desde alli
                lo conectaran con policia, bomberos o ambulancia segun su necesidad.
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-colombia-blue mt-1.5 flex-shrink-0" />
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                Todas las lineas son <span className="font-semibold">gratuitas</span> y funcionan
                las 24 horas del dia, los 7 dias de la semana.
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-colombia-blue mt-1.5 flex-shrink-0" />
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                La linea <span className="font-semibold">155</span> atiende casos de violencia de
                genero con asesoria legal y psicologica.
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-colombia-blue mt-1.5 flex-shrink-0" />
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                La linea <span className="font-semibold">141</span> del ICBF recibe denuncias sobre
                maltrato o abuso infantil.
              </p>
            </li>
          </ul>
        </Card>

        {/* ── Warning ── */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            El uso indebido de las lineas de emergencia es sancionable por la ley colombiana.
            Use estos numeros unicamente en caso de emergencia real.
          </p>
        </div>
      </div>
    </div>
  );
}
