import colombiaConfig from './countries/colombia.json';
import ecuadorConfig from './countries/ecuador.json';
import guatemalaConfig from './countries/guatemala.json';

// ─── Country ID type ────────────────────────────────────────────────────────

export type CountryId = 'CO' | 'EC' | 'GT';

// ─── Shared sub-types ───────────────────────────────────────────────────────

export interface DocumentConfig {
  name: string;
  shortName?: string;
  format?: string;
  authority: string;
  icon: string;
}

export interface AgencyConfig {
  name: string;
  shortName: string;
  website: string;
}

export interface EmergencyNumber {
  number: string;
  label: string;
}

export interface SocialProgram {
  id: string;
  name: string;
  authority: string;
}

export interface HealthSystem {
  regimes: string[];
  mainEPS: string[];
  vaccinationProgram: string;
}

// ─── Main country configuration interface ───────────────────────────────────

export interface CountryConfig {
  id: CountryId;
  name: string;
  fullName: string;
  flag: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  currency: string;
  locale: string;
  timezone: string;
  documents: Record<string, DocumentConfig>;
  agencies: Record<string, AgencyConfig>;
  emergencyNumbers: Record<string, EmergencyNumber>;
  socialPrograms: SocialProgram[];
  healthSystem: HealthSystem;
}

// ─── Configuration registry ─────────────────────────────────────────────────

const configs: Record<CountryId, CountryConfig> = {
  CO: colombiaConfig as CountryConfig,
  EC: ecuadorConfig as CountryConfig,
  GT: guatemalaConfig as CountryConfig,
};

const DEFAULT_COUNTRY: CountryId = 'CO';

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Retrieve the full configuration object for a given country.
 * Falls back to Colombia (CO) when no country id is provided.
 */
export function getCountryConfig(countryId?: CountryId): CountryConfig {
  return configs[countryId || DEFAULT_COUNTRY];
}

/**
 * Return an array of all supported country configurations.
 */
export function getAllCountries(): CountryConfig[] {
  return Object.values(configs);
}

/**
 * Return an array of all supported country id codes.
 */
export function getCountryIds(): CountryId[] {
  return Object.keys(configs) as CountryId[];
}

/**
 * Check whether a given string is a valid CountryId.
 */
export function isValidCountryId(value: string): value is CountryId {
  return value in configs;
}

/**
 * Return the default country id used when none is specified.
 */
export function getDefaultCountryId(): CountryId {
  return DEFAULT_COUNTRY;
}

// ─── Named exports for direct JSON access ───────────────────────────────────

export { colombiaConfig, ecuadorConfig, guatemalaConfig };

// ─── Default export: full config map ────────────────────────────────────────

export default configs;
