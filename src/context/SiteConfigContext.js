import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import defaultConfig from '../config/site.config.json';
import apiClient from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import { selectIsLoggedIn } from '../store/slices/authSlice';

const SiteConfigContext = createContext(defaultConfig);

// Merges a clinic's branding override (from the backend, resolved by
// subdomain) over the static default config. A clinic that hasn't
// customized anything still gets its own name/subdomain reflected.
function mergeBranding(base, override) {
  if (!override) return base;
  return {
    ...base,
    ...override,
    clinic: { ...base.clinic, ...override.clinic, ...(override.name ? { name: override.name } : {}) },
    branding: {
      ...base.branding,
      ...override.branding,
      colors: {
        ...base.branding.colors,
        ...override.branding?.colors,
        // Merge shade-by-shade so overriding just one shade (e.g. 600)
        // doesn't blow away the rest of the primary palette (50-900).
        primary: { ...base.branding.colors.primary, ...override.branding?.colors?.primary },
      },
    },
    portals: { ...base.portals, ...override.portals },
  };
}

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(defaultConfig);
  const { i18n } = useTranslation();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    let cancelled = false;
    // Real per-clinic subdomains aren't set up yet (no wildcard DNS), so the
    // subdomain-based public endpoint always resolves to the "default"
    // clinic. Once logged in, resolve branding via the user's own
    // clinic_id instead, so each clinic's admin/doctor/patient actually
    // see that clinic's saved branding rather than always the default's.
    const endpoint = isLoggedIn ? ENDPOINTS.clinic.myBranding : ENDPOINTS.clinic.branding;
    apiClient.get(endpoint)
      .then((data) => {
        // Merge over the pristine defaults, not the previous state - this
        // effect can now re-run on login/logout, and each response is a
        // complete snapshot of "this clinic's overrides", not an
        // incremental patch. Merging over `prev` would leave a previous
        // clinic's colors stuck after logging out or switching accounts.
        if (!cancelled) setConfig(mergeBranding(defaultConfig, data));
      })
      .catch(() => {
        // No resolvable clinic (e.g. local dev without a subdomain, or a
        // platform_admin with no clinic_id at all) - fall back to defaults
        if (!cancelled) setConfig(defaultConfig);
      });
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  // Inject color scheme as CSS custom properties on :root
  useEffect(() => {
    const colors = config.branding.colors.primary;
    const root = document.documentElement;

    // Primary palette
    Object.entries(colors).forEach(([shade, value]) => {
      root.style.setProperty(`--color-primary-${shade}`, value);
    });

    // Accent / status colors
    root.style.setProperty('--color-accent',  config.branding.colors.accent);
    root.style.setProperty('--color-danger',  config.branding.colors.danger);
    root.style.setProperty('--color-success', config.branding.colors.success);
    root.style.setProperty('--color-warning', config.branding.colors.warning);

    // Font family - index.css/tailwind.config.js both read a single
    // --font-primary variable (chosen per current text direction), not the
    // --font-ltr/--font-rtl split this used to set here, which nothing ever
    // consumed. Re-runs on language toggle too, not just branding changes,
    // since direction can change independently of the clinic's config.
    const isRtl = i18n.language?.startsWith('ar');
    const fontName = isRtl ? config.branding.fontFamily.rtl : config.branding.fontFamily.ltr;
    root.style.setProperty('--font-primary', `'${fontName}', sans-serif`);
  }, [config, i18n.language]);

  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
}

/** Hook — use anywhere in the app */
export function useSiteConfig() {
  return useContext(SiteConfigContext);
}

export default SiteConfigContext;
