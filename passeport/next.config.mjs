/** Export statique servi par le nginx du site sous /passeport/ */
const basePath = '/passeport';
const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  reactStrictMode: true,
  /* Avec output: 'export', distDir est aussi le dossier d'export : on ne le change que pour un build de test en parallèle du serveur de dev. */
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
};
export default nextConfig;
