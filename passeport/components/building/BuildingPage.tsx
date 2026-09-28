'use client';
/* Carnet numérique du bâtiment (spec § 7.4), bureau d'abord. */
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { NetworkTag, Org, Sheet, SheetClose, Sk, StatusPill } from '@/components/ui/kit';
import { MATERIALS, building, issuer, product, trust } from '@/lib/data';
import { date, num, withUnit } from '@/lib/format';
import { useSeen } from '@/lib/hooks';
import { useStore } from '@/lib/store';
import { asset } from '@/lib/asset';
import type { BuildingComponent, MaterialFamily } from '@/lib/types';
import { MaterialSankey } from './Sankey';

const PinMap = dynamic(() => import('@/components/ui/Maps').then(m => m.PinMap), { ssr: false, loading: () => <Sk h={156} r={12} /> });
type Tab = 'tableau' | 'inventaire' | 'journal';
const LOTS = ['Structure', 'Enveloppe', 'Systèmes', 'Second œuvre'] as const;

export function AppBar({ sub, crumbs, orgId, role }: { sub: string; crumbs: React.ReactNode; orgId: string; role: string }) {
  return <header className="app-bar"><Link className="brand" href="/"><span className="logo" aria-hidden="true">D</span><span>DataWood<em>-X</em></span><span className="sub">{sub}</span></Link>
    <nav className="crumbs" aria-label="Fil d'Ariane">{crumbs}</nav><span className="sp" />
    <span className="pill-demo"><Icon n="flask-conical" />Données fictives</span>
    <div className="who-me"><Org id={orgId} size="sm" /><div><div>{issuer(orgId).name}</div><div className="role">{role}</div></div></div></header>;
}

function SidePassport({ c, onClose }: { c: BuildingComponent | null; onClose: () => void }) {
  const p = c?.gtin ? product(c.gtin) : undefined;
  const emit = useStore(s => s.emit);
  useEffect(() => { if (c?.gtin === '03760000000011') emit('sankey:clt'); }, [c, emit]);
  if (!c) return null;
  const warn = p?.certificates.find(x => x.validUntil && Date.parse(x.validUntil) < Date.parse('2026-11-25'));
  return <Sheet open={!!c} onClose={onClose} label={`Passeport du composant : ${c.productName}`}>
    <div className="sheet-h" style={{ paddingTop: 16 }}><div><div className="eyebrow">Passeport du composant</div></div>
      <div style={{ display: 'flex', gap: 4 }}>{p && <Link className="btn sm" href={`/p/${p.gtin}`}><Icon n="maximize-2" />Ouvrir en plein écran</Link>}<SheetClose /></div></div>
    {p ? <div className="side-pp"><div className="shot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(p.image)} alt="" style={p.imagePosition ? { objectPosition: p.imagePosition } : undefined} /></div>
      <h3>{p.name}</h3><div className="by">{issuer(p.manufacturerId).name} · version {p.passportVersion} · <NetworkTag id={p.manufacturerId} /></div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}><span className="chip em"><Icon n="check" />{trust(p).tiers} sur {trust(p).total} vérifiées par un tiers</span>
        {p.passportStatus === 'superseded' && <span className="chip warn"><Icon n="history" />Version {p.newerVersion?.version} disponible</span>}</div>
      <div className="rows">{p.keyIndicators.slice(0, 4).map(k => { const d = p.data.find(x => x.key === k)!; return <div className="rw" key={k}><div><div className="l">{d.label}</div><div className="v num">{withUnit(d.value, d.unit)}</div></div><StatusPill s={d.provenance.status} /></div>; })}</div>
      <div className="rows"><div className="rw"><div><div className="l">Dans ce bâtiment</div><div className="v">{c.quantity} · {num(c.massTonnes)} t{c.where ? ` · ${c.where}` : ''}</div></div></div>
        {c.installedAt && <div className="rw"><div><div className="l">Posé le</div><div className="v">{c.installedAt}{c.installedBy ? ` par ${c.installedBy}` : ''}</div></div></div>}
        {warn && <div className="rw" style={{ background: 'var(--amber50)' }}><div><div className="l" style={{ color: 'var(--amber800)' }}>À surveiller</div><div className="v" style={{ color: 'var(--amber800)', fontSize: 13.5 }}>{warn.title} : échéance le {date(warn.validUntil)}</div></div><Icon n="clock-alert" /></div>}</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}><Link className="btn w" href={`/p/${p.gtin}/fin-de-vie`}><Icon n="recycle" />Fin de vie</Link><Link className="btn w" href={`/p/${p.gtin}/usage`}><Icon n="wrench" />Entretien</Link></div>
    </div> : <div className="side-pp"><h3>{c.productName}</h3><div className="by">Passeport publié par Lamellé-Collé du Val sur la maquette DataWood-X v0.7</div>
      <div className="rows"><div className="rw"><div><div className="l">Dans ce bâtiment</div><div className="v">{c.quantity} · {num(c.massTonnes)} t{c.where ? ` · ${c.where}` : ''}</div></div></div></div>
      <a className="btn w" style={{ marginTop: 14 }} href="/maquette/datawood-x/" target="_blank" rel="noopener"><Icon n="square-arrow-out-up-right" />Voir dans la maquette v0.7</a></div>}
  </Sheet>;
}

export function BuildingPage({ id, tab }: { id: string; tab: Tab }) {
  const b = building(id)!;
  const emit = useStore(s => s.emit);
  const hydrated = useStore(s => s.hydrated);
  const [open, setOpen] = useState<BuildingComponent | null>(null);
  const [lot, setLot] = useState<string>('all');
  const [pp, setPp] = useState<'all' | 'yes' | 'no'>('all');
  const [sLot, setSLot] = useState<string>('all');
  const total = b.components.reduce((s, c) => s + c.massTonnes, 0);
  useEffect(() => { if (hydrated) emit('building:open'); }, [hydrated, emit]);
  useEffect(() => { if (hydrated && tab === 'inventaire') emit('tab:inventaire'); }, [hydrated, tab, emit]);
  useEffect(() => {
    if (tab === 'inventaire' && location.hash === '#matieres') setTimeout(() => document.getElementById('matieres')?.scrollIntoView({ behavior: 'smooth' }), 150);
    const q = new URLSearchParams(location.search).get('passeport'); if (q === 'oui') setPp('yes');
  }, [tab]);
  useSeen('alertes', 'alerts:seen', 1500);

  const fam = useMemo(() => (Object.keys(MATERIALS) as MaterialFamily[]).map(f => ({ f, ...MATERIALS[f], t: b.components.reduce((s, c) => s + c.materials.filter(m => m.family === f).reduce((a, m) => a + m.tonnes, 0), 0) })).sort((a, c) => c.t - a.t), [b]);
  const pct = (t: number) => (t / total) * 100;
  const withPp = b.components.filter(c => c.gtin);
  const rows = b.components.filter(c => (lot === 'all' || c.lot === lot) && (pp === 'all' || (pp === 'yes' ? !!c.gtin : !c.gtin))).sort((a, c) => c.massTonnes - a.massTonnes);
  const sComps = b.components.filter(c => sLot === 'all' || c.lot === sLot);
  const K = { critical: ['octagon-alert', 'Critique', 'crit'], warning: ['clock-alert', 'Échéance', 'warn'], info: ['file-stack', 'Information', 'info'] } as const;
  const ownerRole = 'Gestionnaire du bâtiment';

  const tabs: [Tab, string, string, number?][] = [['tableau', 'layout-dashboard', 'Tableau de bord'], ['inventaire', 'boxes', 'Inventaire', b.components.length], ['journal', 'scroll-text', 'Journal', b.events.length]];
  const journal = (n: number) => <section className="panel"><div className="panel-h"><div><h2>Journal</h2><div className="d">Événements datés, signés par leur auteur</div></div>{n < b.events.length && <Link className="a" href={`/b/${id}/journal`}>Tout voir</Link>}</div>
    <ul className="feed">{b.events.slice(0, n).map(j => <li key={j.date + j.label + j.detail}><span className="dt">{date(j.date)}</span><span className="ico"><Icon n={j.icon} /></span><div><div className="t">{j.label}</div><div className="s">{j.detail}</div>
      <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--s500)' }}><Org id={j.actorId} size="xs" />{issuer(j.actorId).name}</div></div></li>)}</ul></section>;

  return <div className="bureau">
    <AppBar sub="Carnet numérique" orgId={b.ownerId} role={ownerRole} crumbs={<><Icon n="chevron-right" /><span>Patrimoine</span><Icon n="chevron-right" /><b>{b.name}</b></>} />
    <main className="wrap">
      <section className="panel bid" aria-label="Carte d'identité du bâtiment">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ph" src={asset(b.image)} alt={`Façade des ${b.name}`} width={232} height={156} />
        <div><div className="eyebrow">Carnet numérique du bâtiment</div><h1>{b.name}</h1><div className="addr"><Icon n="map-pin" className="ic-s" />{b.address}</div>
          <dl className="facts"><div><dt>Typologie</dt><dd>{b.typology}</dd></div><div><dt>Livré en</dt><dd>{b.yearBuilt}</dd></div><div><dt>Surface</dt><dd>{num(b.floorAreaM2, { dec: 0 })} m²</dd></div>
            <div><dt>Usage</dt><dd>{b.usage}</dd></div><div><dt>Zone climatique</dt><dd>{b.climateZone}</dd></div><div><dt>Réseau</dt><dd><NetworkTag id={b.ownerId} /></dd></div></dl></div>
        <div className="minimap" role="img" aria-label={`Situation : ${b.address}`}><PinMap center={[b.lat, b.lng]} /></div></section>

      <nav className="ptabs" aria-label="Sections du carnet">{tabs.map(([k, i, l, n]) => <Link key={k} id={`tab-${k}`} href={k === 'tableau' ? `/b/${id}` : `/b/${id}/${k}`} aria-current={k === tab ? 'page' : undefined}><Icon n={i} />{l}{n ? <span className="n">{n}</span> : null}</Link>)}
        <span className="sp" /><button className="btn sm" onClick={() => { navigator.clipboard?.writeText(location.href); useStore.getState().toast('Lien du carnet copié', 'link'); }}><Icon n="share-2" />Partager</button>
        <a className="btn sm" style={{ marginLeft: 6 }} href={asset('/docs/fiche-produit-demo.pdf')} target="_blank" rel="noopener"><Icon n="download" />Exporter le carnet</a></nav>

      {tab === 'tableau' && <>
        <section className="panel strip" style={{ marginTop: 16 }} aria-label="Chiffres clés">
          <Link href={`/b/${id}/inventaire#matieres`}><div className="l"><Icon n="factory" />Carbone des composants</div><div className="v">{num(b.carbonTonnes, { dec: 0 })}<small> t CO₂e</small></div><div className="s">{Math.round((b.carbonTonnes * 1000) / b.floorAreaM2)} kg CO₂e par m²</div></Link>
          <Link href={`/b/${id}/inventaire#matieres`}><div className="l"><Icon n="weight" />Masse totale</div><div className="v">{num(total, { dec: 0 })}<small> t</small></div><div className="s">{Math.round((total * 1000) / b.floorAreaM2)} kg par m²</div></Link>
          <Link href={`/b/${id}/inventaire?passeport=oui`}><div className="l"><Icon n="badge-check" />Composants avec passeport</div><div className="v">{withPp.length}<small> sur {b.components.length}</small></div>
            <div className="segbar" aria-hidden="true">{b.components.map((c, k) => <i key={k} className={c.gtin ? 'on' : ''} />)}</div></Link>
          <Link href={`/b/${id}/inventaire`}><div className="l"><Icon n="recycle" />Part réemployable</div><div className="v">{b.reuseShare}<small> % de la masse</small></div><div className="fill" aria-hidden="true"><i style={{ width: `${b.reuseShare}%` }} /></div></Link>
          <a href="#alertes"><div className="l"><Icon n="bell" />Alertes</div><div className="v">{b.alerts.length}</div><div className="s" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="dot" style={{ background: 'var(--red700)' }} />1 critique, 1 échéance, 1 info</div></a>
        </section>
        <div className="g16" style={{ gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', marginTop: 16 }}>
          <div className="g16" style={{ alignContent: 'start' }}>
            <section className="panel" id="alertes"><div className="panel-h"><div><h2>Alertes</h2><div className="d">Elles remontent des passeports des produits posés</div></div></div>
              <ul className="alerts">{b.alerts.map((a, i) => { const k = K[a.level]; return <li key={i} className={`alert ${k[2]}`}><span className="lv"><Icon n={k[0]} /></span><div className="grow"><div className="k">{k[1]}</div><div className="t">{a.title}</div><div className="d">{a.text}</div></div>
                {a.gtin && <Link className="btn sm" href={`/p/${a.gtin}/${a.level === 'info' ? '' : 'conformite'}`}>Ouvrir le passeport<Icon n="arrow-up-right" /></Link>}</li>; })}</ul></section>
            <section className="panel"><div className="panel-h"><div><h2>Inventaire matière par famille</h2><div className="d">{num(total, { dec: 0 })} t, arrondies à la tonne</div></div><Link className="a" href={`/b/${id}/inventaire#matieres`}>Détail</Link></div>
              <div style={{ paddingBottom: 10 }} role="table" aria-label="Masse par famille de matériaux">{fam.map(f => <div className="fam" key={f.f} role="row"><span className="sw" style={{ background: f.hex }} /><span role="cell">{f.label}</span><span className="track"><i style={{ width: `${Math.max(pct(f.t), 0.6)}%`, background: f.hex }} /></span><span className="t" role="cell">{num(Math.round(f.t), { dec: 0 })} t</span><span className="p" role="cell">{pct(f.t) < 1 ? '< 1' : num(Math.round(pct(f.t)), { dec: 0 })} %</span></div>)}</div></section>
          </div>
          <div className="g16" style={{ alignContent: 'start' }}>
            <section className="panel"><div className="panel-h"><div><h2>Passeports des composants</h2><div className="d">{withPp.length} disponibles, {b.components.length - withPp.length} manquants</div></div><Link className="a" href={`/b/${id}/inventaire`}>Tout voir</Link></div>
              <div style={{ padding: '0 8px 8px' }}>{withPp.map(c => { const p = product(c.gtin!);
                const crit = p?.certificates.some(x => x.validUntil && Date.parse(x.validUntil) < Date.parse('2026-09-26')), warn = p?.certificates.some(x => x.validUntil && Date.parse(x.validUntil) >= Date.parse('2026-09-26') && Date.parse(x.validUntil) < Date.parse('2026-11-25'));
                return <button key={c.productName} className="alert" style={{ border: 0, padding: 8, borderRadius: 10, alignItems: 'center', width: '100%', textAlign: 'left' }} onClick={() => setOpen(c)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p ? <img src={asset(p.image)} alt="" width={36} height={36} style={{ width: 36, height: 36, borderRadius: 9, objectFit: 'cover', objectPosition: p.imagePosition }} /> : <span className="lv" style={{ background: 'var(--s100)', color: 'var(--s500)' }}><Icon n="box" /></span>}
                  <div className="grow"><div className="t" style={{ fontWeight: 500 }}>{c.productName}</div><div className="d">{p ? `${issuer(p.manufacturerId).name} · v${p.passportVersion}` : 'Lamellé-Collé du Val · v1.3'}</div></div>
                  {p?.passportStatus === 'superseded' ? <span className="chip warn" style={{ height: 24 }}><Icon n="history" />Remplacé</span> : crit ? <span className="chip crit" style={{ height: 24 }}><Icon n="octagon-x" />1 expiré</span> : warn ? <span className="chip warn" style={{ height: 24 }}><Icon n="clock-alert" />21 j</span> : <span className="chip em" style={{ height: 24 }}><Icon n="circle-check" />À jour</span>}</button>; })}</div></section>
            {journal(4)}
          </div>
        </div>
      </>}

      {tab === 'inventaire' && <>
        <section className="panel" style={{ marginTop: 16 }}><div className="toolbar">
          <div className="segs" role="group" aria-label="Lot"><button aria-pressed={lot === 'all'} onClick={() => setLot('all')}>Tous<span className="c">{b.components.length}</span></button>{LOTS.map(l => <button key={l} aria-pressed={lot === l} onClick={() => setLot(l)}>{l}<span className="c">{b.components.filter(c => c.lot === l).length}</span></button>)}</div>
          <span style={{ flex: 1 }} />
          <div className="segs" role="group" aria-label="Passeport"><button aria-pressed={pp === 'all'} onClick={() => setPp('all')}>Tous</button><button aria-pressed={pp === 'yes'} onClick={() => setPp('yes')}><Icon n="badge-check" className="ic-s" />Disponible<span className="c">{withPp.length}</span></button><button aria-pressed={pp === 'no'} onClick={() => setPp('no')}>Manquant<span className="c">{b.components.length - withPp.length}</span></button></div></div>
          <table className="tb"><caption className="sr">Composants du bâtiment, triés par masse</caption>
            <thead><tr><th scope="col">Composant</th><th scope="col">Lot</th><th scope="col" className="r">Quantité</th><th scope="col" className="r">Masse <Icon n="arrow-down" className="ic-s" /></th><th scope="col">Matière principale</th><th scope="col">Passeport</th></tr></thead>
            <tbody>{rows.map(c => <tr key={c.productName} className={open?.productName === c.productName ? 'sel' : ''} onClick={() => setOpen(c)} tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpen(c)}>
              <td className="pn">{c.productName}</td><td className="m">{c.lot}</td><td className="r">{c.quantity}</td><td className="r">{num(Math.round(c.massTonnes), { dec: 0 })} t</td>
              <td><span className="matdot"><i style={{ background: MATERIALS[c.family].hex }} />{c.mainMaterial}</span></td>
              <td>{c.gtin ? <span className="pp-ok"><Icon n="circle-check" />Disponible</span> : <span className="pp-no"><Icon n="circle-dashed" />Manquant</span>}</td></tr>)}</tbody>
            <tfoot><tr><td className="pn" style={{ height: 40, padding: '0 16px', borderTop: '1px solid var(--line)' }}>{rows.length} composant{rows.length > 1 ? 's' : ''}</td><td /><td /><td className="r" style={{ padding: '0 16px', borderTop: '1px solid var(--line)', fontWeight: 600 }}>{num(Math.round(rows.reduce((s, c) => s + c.massTonnes, 0)), { dec: 0 })} t</td><td /><td className="m" style={{ padding: '0 16px', borderTop: '1px solid var(--line)' }}>{rows.filter(c => c.gtin).length} sur {rows.length}</td></tr></tfoot></table></section>
        <section className="panel" id="matieres" style={{ marginTop: 16 }}><div className="panel-h"><div><h2>De la matière au bâtiment</h2><div className="d">Tonnes, par famille de matériaux puis par composant. Les composants de moins de 1 % sont regroupés.</div></div>
          <div className="segs" role="group" aria-label="Lot du diagramme"><button aria-pressed={sLot === 'all'} onClick={() => setSLot('all')}>Tous les lots</button>{LOTS.slice(0, 2).map(l => <button key={l} aria-pressed={sLot === l} onClick={() => setSLot(l)}>{l}</button>)}</div></div>
          <div className="legend-row">{Object.values(MATERIALS).map(m => <span key={m.label}><i style={{ background: m.hex }} />{m.label}</span>)}</div>
          <MaterialSankey key={sLot} b={b} comps={sComps} onOpen={c => setOpen(c)} />
          <details style={{ padding: '0 16px 16px' }}><summary className="link" style={{ cursor: 'pointer', fontSize: 13 }}>Voir en tableau</summary>
            <table className="tb" style={{ marginTop: 8 }}><thead><tr><th scope="col">Famille</th><th scope="col" className="r">Tonnes</th><th scope="col" className="r">Part</th></tr></thead>
              <tbody>{fam.map(f => <tr key={f.f}><td>{f.label}</td><td className="r">{num(Math.round(f.t * 10) / 10)}</td><td className="r">{num(pct(f.t), { dec: 1 })} %</td></tr>)}</tbody></table></details></section>
      </>}

      {tab === 'journal' && <div style={{ marginTop: 16 }}>{journal(b.events.length)}</div>}
    </main>
    <SidePassport c={open} onClose={() => setOpen(null)} />
  </div>;
}
