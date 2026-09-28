/* Les <img> et les liens de téléchargement ne passent pas par next/link : on préfixe le basePath à la main. */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const asset = (path: string) => `${BASE}${path}`;
