import type { Metadata, Viewport } from 'next';
import './styles/tailwind.css';
import './styles/base.css';
import { Providers } from '@/components/demo/Providers';

export const metadata: Metadata = {
  title: { default: 'Passeport produit bâtiment · DataWood Consortium', template: '%s · Passeport produit bâtiment' },
  description: "Maquette de démonstration : passeport numérique d'un produit de construction, relié au carnet du bâtiment. Données fictives.",
  robots: { index: false },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#fcfdfc' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
