'use client';

import Image from 'next/image';
import { useCountry } from '@/lib/contexts/CountryContext';
import { cn } from '@/lib/utils/cn';

interface ColombiaMapLogoProps {
  /** Size in pixels (width — height scales proportionally). */
  size?: number;
  className?: string;
}

/**
 * Renders the Colombia map silhouette filled with the tricolor flag.
 * Falls back to the country flag emoji for non-Colombia countries.
 */
export function ColombiaMapLogo({ size = 48, className }: ColombiaMapLogoProps) {
  const { country } = useCountry();

  if (country.id !== 'CO') {
    return (
      <span
        className={cn('leading-none', className)}
        role="img"
        aria-label={`Bandera de ${country.name}`}
        style={{ fontSize: size * 0.75 }}
      >
        {country.flag}
      </span>
    );
  }

  return (
    <Image
      src="/images/colombia-map-logo.png"
      alt="Mapa de Colombia"
      width={size}
      height={Math.round(size * 1.5)}
      className={cn('object-contain', className)}
      priority
    />
  );
}
