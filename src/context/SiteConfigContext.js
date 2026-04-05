import React, { createContext, useContext, useEffect } from 'react';
import config from '../config/site.config.json';

const SiteConfigContext = createContext(config);

export function SiteConfigProvider({ children }) {
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
  }, []);

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
