'use client';
/* Coque de l'espace fabricant : barre latérale, barre du haut. Profil forcé : fabricant. */
import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Org } from '@/components/ui/kit';
import { useStore } from '@/lib/store';

const NAV: [string, string, string, string][] = [
  ['flotte', '/admin', 'layout-dashboard', 'Tableau de bord'], ['produits', '/admin/produits', 'package', 'Produits'],
  ['studio', '/admin/studio/rpc', 'shapes', 'Studio'], ['acces', '/admin/acces', 'key-round', 'Accès'], ['lots', '/admin/lots', 'qr-code', 'Lots et QR'],
];

export function AdminShell({ cur, crumb, children }: { cur: string; crumb: string; children: ReactNode }) {
  const applied = useStore(s => s.admin.pefcApplied);
  const hydrated = useStore(s => s.hydrated);
  useEffect(() => { if (hydrated && useStore.getState().profile !== 'manufacturer') useStore.getState().setProfile('manufacturer'); }, [hydrated]);
  return (
    <div className="bureau"><div className="shell">
      <aside className="adm-side" aria-label="Navigation de l'espace fabricant">
        <Link className="brand" href="/"><span className="logo" aria-hidden="true">D</span><span>DataWood<em>-X</em></span><span className="sub">Passeports</span></Link>
        <button className="org" onClick={() => useStore.getState().toast("Démonstration : un seul compte fabricant", 'building')}><Org id="lcv" size="sm" /><div><div className="n">Lamellé-Collé du Val</div><div className="r">Fabricant · Saint-Claude</div></div><Icon n="chevrons-up-down" /></button>
        <ul className="adm-nav">{NAV.map(([k, h, i, l]) => <li key={k}><Link href={h} id={`nav-${k}`} title={l} aria-current={k === cur ? 'page' : undefined}><Icon n={i} /><span className="lb">{l}</span>
          {k === 'produits' ? <span className="c">24</span> : k === 'flotte' && hydrated && !applied ? <span className="c w">2</span> : null}</Link></li>)}</ul>
        <div className="adm-foot"><div className="live"><i />Connecteur en ligne</div><div>Les données restent sur votre serveur. Le réseau n&apos;en garde aucune copie.</div></div>
      </aside>
      <div>
        <header className="topb"><nav className="crumbs" aria-label="Fil d'Ariane"><span>Espace fabricant</span><Icon n="chevron-right" /><b>{crumb}</b></nav><span className="sp" />
          <span className="kbar"><Icon n="search" className="ic-s" />Rechercher un produit, un lot<span className="kbd">⌘K</span></span><span className="pill-demo"><Icon n="flask-conical" />Données fictives</span>
          <div className="who-me"><span className="av sm em">CL</span><div><div>Claire</div><div className="role">Responsable qualité</div></div></div></header>
        <main className="pg">{children}</main>
      </div>
    </div></div>
  );
}
