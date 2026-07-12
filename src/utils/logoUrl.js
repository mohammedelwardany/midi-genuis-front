import { BASE_URL } from '../api/endpoints';

// A clinic logo path is either a backend upload ('/uploads/logos/xxx.png',
// resolved against the API origin) or the default config's frontend public
// asset ('/logo.png', served by this app itself) - resolving both the same
// way as a bare relative path against the wrong origin is why an uploaded
// logo silently 404'd and never rendered (TopNav's onError just hides it).
export const getClinicLogoSrc = (path) => {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  if (path.startsWith('/uploads')) {
    const origin = BASE_URL.split('/backend/api')[0];
    return `${origin}${path}`;
  }
  return path;
};
