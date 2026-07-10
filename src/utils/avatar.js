// Default avatar resolution - static gender-appropriate illustrations
// (public/avatars/*.svg) instead of an initials-based external service.
// Always prefers a real uploaded photo when one exists.
export const getAvatarSrc = (explicitAvatarUrl, gender) => {
  if (explicitAvatarUrl) return explicitAvatarUrl;
  if (gender === 'Male') return '/avatars/male.svg';
  if (gender === 'Female') return '/avatars/female.svg';
  return '/avatars/neutral.svg';
};
