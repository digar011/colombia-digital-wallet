'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IdCard,
  Car,
  FileText,
  HeartPulse,
  Users,
  Monitor,
  Globe,
  ChevronDown,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useCountry } from '@/lib/contexts/CountryContext';
import { cn } from '@/lib/utils/cn';
import type { CountryId } from '@/config';

// ─── Agency icon mapping ─────────────────────────────────────────────────────

const agencyIcons: Record<string, LucideIcon> = {
  identity: IdCard,
  vehicles: Car,
  tax: FileText,
  health: HeartPulse,
  socialServices: Users,
  technology: Monitor,
};

// ─── Agency color accents ────────────────────────────────────────────────────

const agencyColors: Record<string, string> = {
  identity: 'from-blue-500 to-blue-600',
  vehicles: 'from-emerald-500 to-emerald-600',
  tax: 'from-amber-500 to-amber-600',
  health: 'from-rose-500 to-rose-600',
  socialServices: 'from-purple-500 to-purple-600',
  technology: 'from-cyan-500 to-cyan-600',
};

const agencyBgColors: Record<string, string> = {
  identity: 'bg-blue-50 dark:bg-blue-950/30',
  vehicles: 'bg-emerald-50 dark:bg-emerald-950/30',
  tax: 'bg-amber-50 dark:bg-amber-950/30',
  health: 'bg-rose-50 dark:bg-rose-950/30',
  socialServices: 'bg-purple-50 dark:bg-purple-950/30',
  technology: 'bg-cyan-50 dark:bg-cyan-950/30',
};

const agencyIconColors: Record<string, string> = {
  identity: 'text-blue-600 dark:text-blue-400',
  vehicles: 'text-emerald-600 dark:text-emerald-400',
  tax: 'text-amber-600 dark:text-amber-400',
  health: 'text-rose-600 dark:text-rose-400',
  socialServices: 'text-purple-600 dark:text-purple-400',
  technology: 'text-cyan-600 dark:text-cyan-400',
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function AgencyPortalPage() {
  const router = useRouter();
  const { country, allCountries, setCountry, countryId } = useCountry();

  const [showCountrySelector, setShowCountrySelector] = useState(false);

  const agencies = country.agencies;
  const agencyKeys = Object.keys(agencies);

  const handleAgencyClick = (agencyKey: string) => {
    router.push(`/agency/${agencyKey}/dashboard`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── Gradient background ────────────────────────────────── */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `linear-gradient(135deg, ${country.colors.primary}15 0%, ${country.colors.secondary}10 50%, ${country.colors.accent}08 100%)`,
        }}
      />

      {/* ─── Top gradient accent bar ────────────────────────────── */}
      <div
        className="h-2 w-full shrink-0"
        style={{
          background: `linear-gradient(90deg, ${country.colors.primary} 0%, ${country.colors.primary} 50%, ${country.colors.secondary} 50%, ${country.colors.secondary} 75%, ${country.colors.accent} 75%, ${country.colors.accent} 100%)`,
        }}
      />

      {/* ─── Main content ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="text-6xl sm:text-7xl mb-4" role="img" aria-label={`Bandera de ${country.name}`}>
            {country.flag}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-primary-dark">
            Portal de Agencias
          </h1>
          <p className="text-sm sm:text-base text-text-secondary dark:text-text-secondary-dark mt-2 max-w-md mx-auto">
            Seleccione su agencia para acceder al portal
          </p>
        </div>

        {/* Agency cards grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-slide-up">
          {agencyKeys.map((key) => {
            const agency = agencies[key];
            const Icon = agencyIcons[key] || Monitor;
            const gradient = agencyColors[key] || 'from-gray-500 to-gray-600';
            const bgColor = agencyBgColors[key] || 'bg-gray-50 dark:bg-gray-950/30';
            const iconColor = agencyIconColors[key] || 'text-gray-600 dark:text-gray-400';

            return (
              <Card
                key={key}
                variant="elevated"
                className={cn(
                  'group relative overflow-hidden transition-all duration-300',
                  'hover:shadow-xl hover:-translate-y-1',
                  'cursor-pointer'
                )}
                clickable
                onClick={() => handleAgencyClick(key)}
              >
                {/* Top accent gradient */}
                <div className={cn('h-1.5 w-full bg-gradient-to-r', gradient)} />

                <div className="p-5 sm:p-6">
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
                      'transition-transform duration-300 group-hover:scale-110',
                      bgColor
                    )}
                  >
                    <Icon size={28} className={iconColor} />
                  </div>

                  {/* Agency short name (bold, large) */}
                  <h2 className="text-lg sm:text-xl font-bold text-text-primary dark:text-text-primary-dark mb-1">
                    {agency.shortName}
                  </h2>

                  {/* Agency full name (smaller) */}
                  <p className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary-dark leading-tight mb-4 line-clamp-2 min-h-[2.5rem]">
                    {agency.name}
                  </p>

                  {/* Acceder button */}
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={ArrowRight}
                    className={cn(
                      'w-full group-hover:bg-colombia-blue group-hover:text-white',
                      'dark:group-hover:bg-colombia-yellow dark:group-hover:text-colombia-blue',
                      'transition-all duration-300'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAgencyClick(key);
                    }}
                  >
                    Acceder
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ─── Country selector at bottom ──────────────────────────── */}
      <div className="relative pb-6 pt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setShowCountrySelector(!showCountrySelector)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg',
            'text-sm text-text-secondary dark:text-text-secondary-dark',
            'hover:bg-white/60 dark:hover:bg-gray-800/60',
            'transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-colombia-blue'
          )}
        >
          <Globe size={16} />
          <span>{country.flag} {country.name}</span>
          <ChevronDown
            size={14}
            className={cn('transition-transform duration-200', showCountrySelector && 'rotate-180')}
          />
        </button>

        {showCountrySelector && (
          <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-10 animate-slide-up">
            {allCountries.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCountry(c.id as CountryId);
                  setShowCountrySelector(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                  'hover:bg-surface dark:hover:bg-surface-dark',
                  countryId === c.id
                    ? 'text-colombia-blue dark:text-colombia-yellow font-semibold bg-surface/50 dark:bg-surface-dark/50'
                    : 'text-text-primary dark:text-text-primary-dark'
                )}
              >
                <span className="text-xl">{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
