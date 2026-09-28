'use client';
/* Catalogue fédéré (processus IMT n° 6) : il ne contient que des descriptions. Chaque produit de données dit
   quels éléments sont libres et lesquels se négocient, avec les étapes fixées par le fournisseur. */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { AppBar } from '@/components/building/BuildingPage';
import { CATALOG, NEGOTIATION } from '@/lib/data';
import { asset } from '@/lib/asset';
import { useStore } from '@/lib/store';

type Entry = (typeof CATALOG)[number];
const WF_OF: Record<string, string> = { 'Maquette numérique (IFC)': 'bim', 'Plan de dépose détaillé': 'depose', 'Origine détaillée': 'pro' };

export function Catalogue() {
  const [q, setQ] = useState('');
  const [net, setNet] = useState<'all' | 'DataWood-X' | 'DataBuilding-X'>('all');
  const [fam, setFam] = useState('all');
  const [open, setOpen] = useState<string | null>('03760000000011');
  const wfs = useStore(s => s.admin.workflows);
  const published = useStore(s => s.hydrated && s.admin.published);
  const toast = useStore(s => s.toast);
  const families = useMemo(() => [...new Set(CATALOG.map(c => c.family))], []);
  const contracts = (c: Entry) => c.contract.filter(x => !(c.gtin === '03760000000011' && x === 'Plan de dépose détaillé' && !published));
  const list = CATALOG.filter(c => (net === 'all' || c.network === net) && (fam === 'all' || c.family === fam)
    && (!q || `${c.name} ${c.makerName} ${c.family} ${c.gtin}`.toLowerCase().includes(q.toLowerCase())));
  const steps = (el: string) => {
    const w = wfs.find(x => x.id === WF_OF[el]);
    return w ? w.steps.map(s => NEGOTIATION.stepTypes[s.type].label + (s.type === 'attestation' ? ` (${s.param.toLowerCase()})` : '')) : ['Attestation professionnelle', 'Accord de confidentialité'];
  };
  return (
    <div className="bureau">
      <AppBar sub="Catalogue du réseau" orgId="lcv" role="Catalogue fédéré" crumbs={<><Icon n="chevron-right" /><b>Catalogue fédéré</b></>} />
      <main className="wrap">
        <div className="cat-h"><div><div className="eyebrow">Catalogue fédéré · DataWood-X et DataBuilding-X</div><h1>Ce qui existe sur le réseau, et à quelles conditions</h1>
          <p>Les fournisseurs y décrivent leurs produits de données ; les données, elles, restent chez eux. Chaque élément dit s&apos;il est libre ou sous contrat, et quelles étapes mènent au contrat.</p></div>
          <div className="cat-legend"><span className="acc y"><Icon n="lock-open" />Libre</span><span>lisible sans condition</span><span className="acc c"><Icon n="file-signature" />Sous contrat</span><span>parcours fixé par le fournisseur</span></div></div>
        <section className="panel" style={{ marginTop: 16 }}>
          <div className="toolbar"><label className="search" style={{ flex: 1, maxWidth: 360 }}><Icon n="search" /><input className="cat-q" value={q} onChange={e => setQ(e.target.value)} placeholder="Produit, fournisseur, GTIN" aria-label="Rechercher dans le catalogue" /></label>
            <div className="segs" role="group" aria-label="Réseau">{(['all', 'DataWood-X', 'DataBuilding-X'] as const).map(n => <button key={n} aria-pressed={net === n} onClick={() => setNet(n)}>{n === 'all' ? 'Tous les réseaux' : n}<span className="c">{CATALOG.filter(c => n === 'all' || c.network === n).length}</span></button>)}</div>
            <select className="sel3" value={fam} onChange={e => setFam(e.target.value)} aria-label="Famille de produits"><option value="all">Toutes les familles</option>{families.map(f => <option key={f}>{f}</option>)}</select>
            <span style={{ flex: 1 }} /><span className="mut" style={{ fontSize: 12.5 }}>{list.length} produit{list.length > 1 ? 's' : ''} de données</span></div>
          <ul className="cat-list">{list.map(c => {
            const ct = contracts(c), isOpen = open === c.gtin;
            return <li key={c.gtin} className={isOpen ? 'on' : ''}>
              <div className="cat-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {c.image ? <img src={asset(c.image)} alt="" width={52} height={52} /> : <span className="ph"><Icon n="box" /></span>}
                <div className="grow"><div className="n">{c.name}</div><div className="m">{c.makerName} · <span className={`net${c.network === 'DataBuilding-X' ? ' dbx' : ''}`}>{c.network}</span> · <span className="mono">{c.gtin}</span> · v{c.version}</div>
                  <div className="els"><span className="acc y"><Icon n="lock-open" />{c.open} éléments libres</span>{ct.length > 0 && <span className="acc c"><Icon n="file-signature" />{ct.length} sous contrat</span>}</div></div>
                <div className="acts2">{ct.length > 0 && <button className="btn sm" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : c.gtin)}>Conditions<Icon n={isOpen ? 'chevron-up' : 'chevron-down'} /></button>}
                  {c.detailed ? <Link className="btn p sm" href={`/p/${c.gtin}`}>Ouvrir le passeport<Icon n="arrow-right" /></Link>
                    : <button className="btn sm" onClick={() => toast('Passeport non détaillé dans cette démonstration', 'info')}>Ouvrir le passeport</button>}</div>
              </div>
              {isOpen && ct.length > 0 && <div className="cat-conds">{ct.map(el => <div key={el} className="cond"><div className="t"><Icon n="file-signature" className="ic-s" />{el}</div>
                <ol>{steps(el).map((s, k) => <li key={k}>{s}</li>)}<li className="end">Contrat d&apos;accès délivré</li></ol></div>)}</div>}
            </li>;
          })}</ul>
          {!list.length && <p className="mut" style={{ padding: 16, fontSize: 13 }}>Aucun produit ne correspond à cette recherche.</p>}
        </section>
        <p className="mut" style={{ fontSize: 12.5, marginTop: 14, lineHeight: 1.6 }}>Le catalogue est tenu par l&apos;autorité de gouvernance du réseau, selon un vocabulaire commun. Il ne stocke que des descriptions : à la lecture, chaque donnée est demandée à l&apos;agent de son fournisseur.</p>
      </main>
    </div>
  );
}
