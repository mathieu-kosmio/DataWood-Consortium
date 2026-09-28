'use client';
/* Tableau de bord de flotte (spec § 7.5) : une phrase de diagnostic à la place d'un pourcentage. */
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Org, Sk } from '@/components/ui/kit';
import { FLEET, HERO_GTIN, PRODUCTS, issuer } from '@/lib/data';
import { num } from '@/lib/format';
import { useStore } from '@/lib/store';
import { AdminShell } from './Shell';

const ScansMap = dynamic(() => import('@/components/ui/Maps').then(m => m.ScansMap), { ssr: false, loading: () => <Sk h={220} r={10} /> });

export function Fleet() {
  const ap = useStore(s => s.hydrated && s.admin.pefcApplied);
  const applyPefc = useStore(s => s.applyPefc);
  const toast = useStore(s => s.toast);
  const sp = FLEET.spark;
  const path = sp.map((v, i) => `${i ? 'L' : 'M'}${((i * 160) / (sp.length - 1)).toFixed(1)},${(34 - v / 2).toFixed(1)}`).join(' ');
  const ok = ap ? 22 : 21, warn = ap ? 1 : 2;
  const todo = [
    !ap && ['clock-alert', 'PEFC chaîne de contrôle du site', 'Échéance le 17/10/2026 · audit planifié le 08/10', 'Suivre'],
    ['file-clock', 'Poutre GL28h 100 × 300 : FDES à renouveler', 'Échéance le 30/11/2026 · 1 passeport concerné', 'Préparer'],
    ['hourglass', 'Panneau CLT 3 plis 100 mm : origine du lot 27-0131', 'En attente de la Scierie des Trois Massifs depuis 3 jours', 'Relancer'],
  ].filter(Boolean) as string[][];
  return (
    <AdminShell cur="flotte" crumb="Tableau de bord">
      <div className="pg-h"><div><h1>Tableau de bord</h1><div className="d">Samedi 26 septembre 2026 · {FLEET.published} passeports publiés sur le réseau DataWood-X</div></div>
        <div style={{ display: 'flex', gap: 8 }}><button className="btn sm" onClick={() => toast('Export CSV de la flotte préparé', 'download')}><Icon n="download" />Exporter</button><Link className="btn p sm" href="/admin/studio/rpc"><Icon n="plus" />Nouveau passeport</Link></div></div>
      <p className="diag"><Link href="/admin/produits">{FLEET.published} passeports</Link> publiés. <Link href="/admin/produits">{ok}</Link> couvrent toutes leurs exigences, <Link className="w" href="/admin/produits">{warn} {warn > 1 ? 'ont une preuve' : 'a une preuve'} à renouveler</Link>, <Link className="w" href="/admin/produits">1 attend une donnée</Link> de votre scierie.</p>
      <section className="panel strip" style={{ marginTop: 18, gridTemplateColumns: 'repeat(4,1fr)' }}>
        <Link href="/admin/produits"><div className="l"><Icon n="file-check-2" />Publiés</div><div className="v">{FLEET.published}</div><div className="s">+2 ce mois-ci</div></Link>
        <Link href="/admin/produits"><div className="l"><Icon n="file-pen-line" />En préparation</div><div className="v">{FLEET.drafts}</div><div className="s">1 prêt à publier</div></Link>
        <Link href="/admin/produits"><div className="l"><Icon n="calendar-clock" />Échéances sous 60 jours</div><div className="v" style={{ color: 'var(--amber800)' }}>{warn}</div><div className="s">{ap ? 'FDES GL28h, le 30/11' : 'PEFC le 17/10, FDES GL28h le 30/11'}</div></Link>
        <Link href="/admin/lots"><div className="l"><Icon n="scan-line" />Scans ce mois-ci</div><div className="v">{num(FLEET.scansMonth, { dec: 0 })}</div>
          <svg className="spark" width="160" height="34" viewBox="0 0 160 34" aria-label="Scans en hausse sur quatorze jours"><path d={path} fill="none" stroke="var(--s700)" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" /><circle cx="160" cy={34 - sp[sp.length - 1] / 2} r="3" fill="var(--s900)" /></svg></Link>
      </section>
      <div className="g16" style={{ gridTemplateColumns: 'minmax(0,1.35fr) minmax(0,1fr)', marginTop: 16 }}>
        <div className="g16" style={{ alignContent: 'start' }}>
          <section className="panel"><div className="panel-h"><div><h2>Mises à jour de vos fournisseurs</h2><div className="d">Arrivées par le réseau, sans ressaisie</div></div></div>
            <div className="upd"><Org id="st3m" /><div className="grow"><div className="t">Scierie des Trois Massifs a renouvelé son certificat PEFC</div>
              <div className="d">Il y a 2 heures · valable jusqu&apos;au 02/03/2029 · concerne 6 de vos passeports, dont Panneau CLT 5 plis 140 mm</div>
              <div className="upd-acts" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>{ap ? <span className="chip em"><Icon n="circle-check" />Appliqué aux 6 passeports · versions signées</span>
                : <><button className="btn p sm" id="a-appliquer" onClick={applyPefc}><Icon n="check-check" />Appliquer aux 6 passeports</button><Link className="btn sm" href={`/p/${HERO_GTIN}/origine`}>Voir le certificat</Link></>}</div></div></div>
            <div className="upd"><Org id="iqc" /><div className="grow"><div className="t">{issuer('iqc').name} a planifié l&apos;audit de votre site</div><div className="d">Hier · audit de renouvellement PEFC le 08/10/2026</div></div></div></section>
          <section className="panel"><div className="panel-h"><div><h2>À traiter</h2><div className="d">Classé par échéance</div></div></div>
            {todo.map(([i, t, d, a]) => <div className="todo" key={t}><Icon n={i} /><div className="grow"><div className="t">{t}</div><div className="d">{d}</div></div><button className="btn sm" onClick={() => toast(`${a} : action enregistrée`, 'check')}>{a}</button></div>)}</section>
        </div>
        <div className="g16" style={{ alignContent: 'start' }}>
          <section className="panel"><div className="panel-h"><div><h2>Où vos produits sont scannés</h2><div className="d">30 derniers jours · {num(FLEET.scansMonth, { dec: 0 })} scans</div></div></div>
            <div style={{ position: 'relative', isolation: 'isolate', height: 220, margin: '0 16px 16px', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)' }} role="img" aria-label="Carte des scans : Montpellier, Lyon et Paris en tête"><ScansMap points={FLEET.scans} /></div></section>
          <section className="panel"><div className="panel-h"><div><h2>Produits les plus scannés</h2><div className="d">30 derniers jours</div></div></div>
            <div style={{ paddingBottom: 10 }}>{FLEET.top.map(([n, v, g]) => <div className="hbar" key={n as string}><span>{g && PRODUCTS.some(p => p.gtin === g) ? <Link className="link" href={`/p/${g}`}>{n}</Link> : n}</span><span className="track"><i style={{ width: `${((v as number) / 412) * 100}%` }} /></span><span className="v">{v}</span></div>)}</div></section>
        </div>
      </div>
    </AdminShell>
  );
}
