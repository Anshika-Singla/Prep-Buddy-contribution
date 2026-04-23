import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { fetchCatalog, fetchProfile } from '../lib/api';

const ProfileContext = createContext(null);

/**
 * Provides shared profile + catalog data across all authenticated pages.
 * - `profile`: full user object (stats, insights, settings, dsaData, coreData, aptitudeData)
 * - `refreshProfile()`: re-fetches profile from server (call after mutations if fresh stats needed)
 * - `loadCatalog()`: fetches topic catalog once, then returns cached copy on subsequent calls
 */
export function ProfileProvider({ initialUser, children }) {
  const [profile, setProfile] = useState(initialUser ?? null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [catalog, setCatalog] = useState(null);
  const catalogLoadingRef = useRef(false);

  // Sync with auth changes (login / logout)
  useEffect(() => {
    setProfile(initialUser ?? null);
  }, [initialUser]);

  const refreshProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const res = await fetchProfile();
      setProfile(res.user);
      return res.user;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const loadCatalog = useCallback(async () => {
    if (catalog) return catalog;          // cache hit — no re-fetch
    if (catalogLoadingRef.current) return; // in-flight guard
    catalogLoadingRef.current = true;
    try {
      const data = await fetchCatalog();
      setCatalog(data);
      return data;
    } finally {
      catalogLoadingRef.current = false;
    }
  }, [catalog]);

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, profileLoading, refreshProfile, catalog, loadCatalog }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside <ProfileProvider>');
  return ctx;
}
