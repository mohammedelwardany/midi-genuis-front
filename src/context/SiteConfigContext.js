import React, { createContext, useContext, useEffect, useState } from 'react';
import defaultConfig from '../config/site.config.json';
import apiClient from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

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
      colors: { ...base.branding.colors, ...override.branding?.colors },
    },
    portals: { ...base.portals, ...override.portals },
  };
}

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    let cancelled = false;
    apiClient.get(ENDPOINTS.clinic.branding)
      .then((data) => {
        if (!cancelled) setConfig((prev) => mergeBranding(prev, data));
      })
      .catch(() => {
        // No resolvable clinic (e.g. local dev without a subdomain) - keep defaults
      });
    return () => { cancelled = true; };
  }, []);

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

    // Font families
    root.style.setProperty('--font-ltr', `'${config.branding.fontFamily.ltr}', sans-serif`);
    root.style.setProperty('--font-rtl', `'${config.branding.fontFamily.rtl}', sans-serif`);
  }, [config]);

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
