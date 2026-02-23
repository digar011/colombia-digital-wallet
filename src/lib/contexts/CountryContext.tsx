'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  CountryConfig,
  CountryId,
  getCountryConfig,
  getDefaultCountryId,
  isValidCountryId,
  getAllCountries,
  getCountryIds,
} from '@/config';

// ─── Storage key ────────────────────────────────────────────────────────────

const STORAGE_KEY = 'digital-wallet-country';

// ─── Context shape ──────────────────────────────────────────────────────────

interface CountryContextType {
  /** The full configuration object for the currently selected country. */
  country: CountryConfig;
  /** The two-letter ISO code of the currently selected country. */
  countryId: CountryId;
  /** Switch the active country by its id code. */
  setCountry: (id: CountryId) => void;
  /** Convenience: array of all supported country configs. */
  allCountries: CountryConfig[];
  /** Convenience: array of all supported country id codes. */
  allCountryIds: CountryId[];
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

// ─── Helper: read persisted country from localStorage ───────────────────────

function getPersistedCountryId(): CountryId {
  if (typeof window === 'undefined') {
    return getDefaultCountryId();
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidCountryId(stored)) {
      return stored;
    }
  } catch {
    // localStorage may be unavailable (SSR, private browsing restrictions, etc.)
  }
  return getDefaultCountryId();
}

// ─── Provider ───────────────────────────────────────────────────────────────

interface CountryProviderProps {
  /** Override the initial country instead of reading from localStorage. */
  initialCountryId?: CountryId;
  children: ReactNode;
}

export function CountryProvider({
  initialCountryId,
  children,
}: CountryProviderProps) {
  const [countryId, setCountryId] = useState<CountryId>(
    initialCountryId ?? getDefaultCountryId()
  );

  // On first client-side render, hydrate from localStorage if no explicit
  // initial value was provided.
  useEffect(() => {
    if (!initialCountryId) {
      setCountryId(getPersistedCountryId());
    }
  }, [initialCountryId]);

  // Persist every change to localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, countryId);
    } catch {
      // Silently ignore write failures.
    }
  }, [countryId]);

  const setCountry = useCallback((id: CountryId) => {
    if (isValidCountryId(id)) {
      setCountryId(id);
    } else {
      console.warn(
        `[CountryContext] Invalid country id "${id}". Keeping current selection.`
      );
    }
  }, []);

  const value: CountryContextType = {
    country: getCountryConfig(countryId),
    countryId,
    setCountry,
    allCountries: getAllCountries(),
    allCountryIds: getCountryIds(),
  };

  return (
    <CountryContext.Provider value={value}>{children}</CountryContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * Access the current country configuration and switching function.
 *
 * Must be used inside a `<CountryProvider>`.
 */
export function useCountry(): CountryContextType {
  const ctx = useContext(CountryContext);
  if (!ctx) {
    throw new Error(
      'useCountry() must be used within a <CountryProvider>. ' +
        'Wrap your component tree (e.g. in app/layout.tsx) with <CountryProvider>.'
    );
  }
  return ctx;
}

export default CountryContext;
