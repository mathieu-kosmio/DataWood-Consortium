'use client';
/* Liste des passeports du fabricant : un diagnostic par ligne, jamais une note. */
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Validity } from '@/components/ui/kit';
import { PRODUCTS, validity } from '@/lib/data';
import { date } from '@/lib/format';
import { useStore } from '@/lib/store';
import { AdminShell } from './Shell';

const ROWS: [string, string, string, 'ok' | 'warn' | 'crit', string, string][] = [
  ['Poutre lamellé-collé GL24h 140 × 400', '03760000000042', '1.3', 'ok', 'Toutes les exigences couvertes', '02/07/2026'],
  ['Panneau CLT 3 plis 100 mm', '03760000000059', '1.1', 'warn', 'Origine du lot 27-0131 attendue de la scierie', '23/09/2026'],
  ['Poutre GL28h 100 × 300', '03760000000066', '1.4', 'warn', 'FDES à renouveler avant le 30/11/2026', '11/06/2026'],
  ['Bois massif reconstitué 80 × 200', '03760000000073', '1.0', 'ok', 'Toutes les exigences couvertes', '14/03/2026'],
];

export function Products() {
  const ap = useStore(s => s.hydrated && s.admin.pefcApplied);
  const clt = PRODUCTS[0];
  const cltWarn = !ap && clt.certificates.some(c => validity(c.validUntil) === 'warn');
  return (
    <AdminShell cur="produits" crumb="Produits">
      <div className="pg-h"><div><h1>Produits</h1><div className="d">24 passeports publiés, 3 en préparation. Cinq sont détaillés dans cette démonstration.</div></div>
        <Link className="btn p sm" href="/admin/studio/rpc"><Icon n="plus" />Nouveau passeport</Link></div>
      <section className="panel" style={{ marginTop: 16 }}>
        <table className="tb"><caption className="sr">Passeports du fabricant</caption>
          <thead><tr><th scope="col">Produit</th><th scope="col">GTIN</th><th scope="col">Version</th><th scope="col">Mis à jour</th><th scope="col">Diagnostic</th><th scope="col" /></tr></thead>
          <tbody>
            <tr><td className="pn"><Link className="link" href={`/p/${clt.gtin}`}>{clt.name}</Link></td><td className="mono m">{clt.gtin}</td><td><span className="tag">v{ap ? '2.2' : clt.passportVersion}</span></td><td className="m">{ap ? '26/09/2026' : date(clt.updatedAt)}</td>
              <td>{cltWarn ? <Validity st="warn">PEFC du site à renouveler avant le 17/10/2026</Validity> : <Validity st="ok">Toutes les exigences couvertes</Validity>}</td><td className="r"><Link className="btn sm" href="/admin/studio/rpc">Studio</Link></td></tr>
            {ROWS.map(([n, g, v, st, d, u]) => <tr key={g}><td className="pn">{n}</td><td className="mono m">{g}</td><td><span className="tag">v{v}</span></td><td className="m">{u}</td><td><Validity st={st}>{d}</Validity></td><td className="r"><Link className="btn sm" href="/admin/studio/rpc">Studio</Link></td></tr>)}
          </tbody></table></section>
    </AdminShell>
  );
}
