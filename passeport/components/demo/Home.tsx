'use client';
/* Accueil de la démonstration : lancer le récit, ou choisir un point d'entrée. */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { asset } from '@/lib/asset';
import { HERO_GTIN, STEPS } from '@/lib/data';
import { useStore } from '@/lib/store';

const ENTRIES: [string, string, string, string][] = [
  ['/scan', 'scan-line', 'Scanner un produit', 'Le passeport tel que le lit le chantier : sans compte, en cinq secondes.'],
  [`/p/${HERO_GTIN}`, 'badge-check', 'Ouvrir un passeport', 'Le panneau CLT 5 plis : chaque chiffre ouvre sa preuve.'],
  ['/b/arceaux', 'building-2', 'Carnet du bâtiment', 'Les Bureaux Les Arceaux : alertes, inventaire, matière.'],
  ['/admin', 'layout-dashboard', 'Espace fabricant', 'Publier, fixer ses conditions d’accès, étiqueter.'],
  ['/catalogue', 'search', 'Catalogue du réseau', 'Ce qui existe sur DataWood-X et DataBuilding-X, et à quelles conditions.'],
];

export function Home() {
  const router = useRouter();
  const start = () => { useStore.getState().recitStart(); router.push('/scan'); };
  return (
    <div className="home">
      <header className="home-top"><span className="logo" aria-hidden="true">D</span><div><div className="t">Passeport produit bâtiment</div><div className="s">Maquette de démonstration · DataWood Consortium</div></div><span className="sp" />
        <span className="pill-demo"><Icon n="flask-conical" />Données fictives</span></header>
      <main className="home-main">
        <section className="home-hero"><div>
          <div className="eyebrow">Passeport numérique de produit · carnet du bâtiment</div>
          <h1>Un QR scanné, un produit compris, chaque chiffre prouvé.</h1>
          <p>Suivez un panneau de bois lamellé-croisé du chantier au bâtiment, puis chez son fabricant. Quatre personnes, douze étapes, environ huit minutes. Chaque donnée reste chez l&apos;entreprise qui l&apos;émet : le passeport va la lire à la source.</p>
          <div className="cta"><button className="btn p lg" onClick={start}><Icon n="play" />Suivre le récit ({STEPS.length} étapes)</button><Link className="btn lg" href="/architecture"><Icon n="cpu" />Comment ça marche</Link></div>
        </div>
          <div className="home-shots" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/img/apercu-carte.webp')} alt="" style={{ left: 10, top: 20, transform: 'rotate(-4deg)' }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/img/apercu-preuve.webp')} alt="" style={{ left: 160, top: 0, zIndex: 2 }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/img/apercu-origine.webp')} alt="" style={{ left: 310, top: 24, transform: 'rotate(4deg)' }} />
          </div></section>
        <nav className="entries" aria-label="Points d'entrée">{ENTRIES.map(([h, i, t, d]) =>
          <Link key={h} className="entry" href={h}><span className="ico"><Icon n={i} /></span><span className="t">{t}</span><span className="d">{d}</span><span className="go">Explorer librement<Icon n="arrow-right" /></span></Link>)}</nav>
        <p className="home-note">Toutes les données sont fictives. Le panneau de démonstration s&apos;ouvre avec la touche D : couper une source, changer de profil, sauter à une étape. Les photos de produits et du bâtiment ont été générées pour la maquette.</p>
      </main>
    </div>
  );
}
