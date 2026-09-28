'use client';
/* Les huit rubriques du passeport (spec § 7.3). Mobile : une route par rubrique ; bureau : sections empilées. */
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { NetworkTag, Org, Sk, StatusPill, Validity } from '@/components/ui/kit';
import { RUBRIQUES, STATUS, building, issuer, validity } from '@/lib/data';
import { date, num, withUnit } from '@/lib/format';
import { useNode, useSeen } from '@/lib/hooks';
import { canRead, useStore } from '@/lib/store';
import { asset } from '@/lib/asset';
import type { Certificate, DataPoint, Rubrique, VerificationStatus } from '@/lib/types';
import { dpOf, usePassport, useProfile } from './context';
import { BenchmarkBar, certState, conformiteSummary } from './parts';
import { AssetRow, useAssets } from './negotiation';

const ChainMap = dynamic(() => import('@/components/ui/Maps').then(m => m.ChainMap), { ssr: false, loading: () => <Sk h={250} r={16} /> });
const PointsMap = dynamic(() => import('@/components/ui/Maps').then(m => m.PointsMap), { ssr: false, loading: () => <Sk h={200} r={16} /> });

export function SubHeader({ r }: { r: Rubrique }) {
  const { p, desk, goRub } = usePassport();
  return (
    <div className="pp-sub">
      {!desk && <Link className="crumb" href={`/p/${p.gtin}`}><Icon n="arrow-left" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(p.image)} alt="" width={22} height={22} /><b>{p.name}</b></Link>}
      <nav className="tabs" aria-label="Rubriques">{RUBRIQUES.map(x => desk
        ? <a key={x.key} id={`q-${x.key}`} href={`#${x.key}`} aria-current={x.key === r ? 'page' : undefined} onClick={e => { e.preventDefault(); goRub(x.key); }}><Icon n={x.icon} />{x.tab}</a>
        : <Link key={x.key} id={`tab-${x.key}`} href={`/p/${p.gtin}/${x.key}`} aria-current={x.key === r ? 'page' : undefined} replace><Icon n={x.icon} />{x.tab}</Link>)}</nav>
    </div>
  );
}

const Title = ({ r, sub }: { r: Rubrique; sub?: React.ReactNode }) => (
  <div className="rub-h"><h2>{RUBRIQUES.find(x => x.key === r)!.question}</h2>{sub && <p>{sub}</p>}</div>
);

/* ---------------------------------------------------------------- identité */
const GROUP_ICON: Record<string, string> = { Mécanique: 'dumbbell', Feu: 'flame', Thermique: 'thermometer', Acoustique: 'audio-lines', Santé: 'heart-pulse', Aspect: 'sun', Composition: 'layers', Hygrothermique: 'droplet' };

function DataRow({ d }: { d: DataPoint }) {
  const { openProof, openWallet } = usePassport();
  const profile = useProfile();
  const st = useNode(d.provenance.sourceNodeId);
  if (!canRead(d.visibility, profile)) return (
    <div className="row"><div className="grow"><div className="l">{d.label}</div><div className="v" style={{ color: 'var(--s400)', fontWeight: 500, fontSize: 13.5 }}><Icon n="lock" className="ic-s" /> Donnée réservée {d.visibility === 'authority' ? 'aux autorités' : 'aux professionnels'}</div></div>
      {d.visibility === 'professional' && <button className="btn sm" onClick={openWallet} aria-label="Présenter mon attestation"><Icon n="wallet" />Attestation</button>}</div>
  );
  if (st === 'loading') return <div className="row"><div className="grow"><Sk w="45%" h={10} /><Sk w="30%" h={14} m="6px 0 0" /></div><Sk w="120px" h={24} r={999} /></div>;
  return <div className={`row${st === 'offline' ? ' off' : ''}`}><div className="grow"><div className="l">{d.label}{d.method ? <> · <span className="mono">{d.method}</span></> : null}</div><div className="v num">{withUnit(d.value, d.unit)}</div>
    {st === 'offline' && <div className="offl"><Icon n="cloud-off" />Source indisponible · valeur du 26/09 à 10:42</div>}</div>
    <StatusPill s={d.provenance.status} off={st === 'offline'} onClick={st === 'offline' ? undefined : () => openProof(d.key)} /></div>;
}

export function Identite() {
  const { p } = usePassport();
  const groups = [...new Set(p.data.map(d => d.group ?? 'Autres'))].filter(g => g !== 'Environnement' && g !== 'Origine');
  return <>
    <Title r="identite" sub={p.description.split('.')[0] + '.'} />
    <div className="grp" style={{ marginTop: 12 }}><div className="list"><div className="row" style={{ display: 'block', padding: 14 }}>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--s700)' }}>{p.description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>{p.intendedUse.map(u => <span key={u} className="chip"><Icon n="check" />{u}</span>)}</div></div>
      <div className="row"><div className="grow"><div className="l">Unité fonctionnelle</div><div className="v">{p.functionalUnit}</div></div></div>
      <div className="row"><div className="grow"><div className="l">Famille</div><div className="v">{p.family}</div></div></div></div></div>
    {groups.map((g, k) => {
      const rows = p.data.filter(d => (d.group ?? 'Autres') === g);
      return <details key={g} className="grp dg" open={k === 0}><summary className="grp-h" style={{ cursor: 'pointer', listStyle: 'none' }}><h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon n={GROUP_ICON[g] ?? 'info'} />{g}</h2>
        <span className="mut" style={{ fontSize: 12.5 }}>{rows.length} donnée{rows.length > 1 ? 's' : ''} <Icon n="chevron-down" className="ic-s" /></span></summary>
        <div className="list">{rows.map(d => <DataRow key={d.key} d={d} />)}</div></details>;
    })}
  </>;
}

/* ---------------------------------------------------------------- conformité */
const CERT_ICON: Record<Certificate['kind'], string> = { DoP: 'file-badge', CE: 'badge-check', product_standard: 'scroll-text', certification: 'trees', substances: 'flask-conical', health_label: 'wind', management_system: 'settings-2' };
const SCOPE = { product: 'Produit', site: 'Site', organisation: 'Organisation' };

function CertificateCard({ c }: { c: Certificate }) {
  const st = useNode(c.issuerId);
  const emit = useStore(s => s.emit);
  const toast = useStore(s => s.toast);
  const { v, txt } = certState(c);
  const cls = st === 'offline' ? 'off' : v === 'ok' ? '' : v;
  const life = c.validUntil ? Math.max(2, Math.min(100, Math.round(((Date.parse('2026-09-26') - Date.parse(c.issuedAt)) / (Date.parse(c.validUntil) - Date.parse(c.issuedAt))) * 100))) : 0;
  if (st === 'loading') return <article className="cert" id={`cert-${c.id}`} aria-busy="true"><div className="cert-h"><span className="cert-ic"><Icon n={CERT_ICON[c.kind]} /></span><div className="grow"><h4>{c.title}</h4><Sk w="50%" h={11} m="6px 0 0" /></div></div><Sk h={60} m="14px 0 0" /></article>;
  if (st === 'offline') return (
    <article className="cert off" id={`cert-${c.id}`}><div className="cert-h"><span className="cert-ic"><Icon n={CERT_ICON[c.kind]} /></span><div className="grow"><h4>{c.title}</h4><div className="no">{c.number}</div></div><Validity st="off">Indisponible</Validity></div>
      <div className="last"><Icon n="history" /><span>Dernière valeur connue : <b>{v === 'crit' ? `expiré le ${date(c.validUntil)}` : c.validUntil ? `valide jusqu'au ${date(c.validUntil)}` : 'valide, sans échéance'}</b>, lue le 26/09 à 10:42</span></div></article>
  );
  return (
    <article className={`cert ${cls}`} id={`cert-${c.id}`} onClick={() => c.id === 'pefc' && emit('cert:pefc')}>
      <div className="cert-h"><span className="cert-ic"><Icon n={CERT_ICON[c.kind]} /></span><div className="grow"><h4>{c.title}</h4><div className="no">{c.number}</div></div><Validity st={v}>{v === 'ok' ? 'Valide' : txt}</Validity></div>
      <dl><div><dt>Émetteur</dt><dd><Org id={c.issuerId} size="xs" />{issuer(c.issuerId).name}</dd></div><div><dt>Périmètre</dt><dd>{SCOPE[c.scope]}</dd></div>
        <div><dt>Émis le</dt><dd className="num">{date(c.issuedAt)}</dd></div><div><dt>Valide jusqu&apos;au</dt><dd className="num">{c.validUntil ? date(c.validUntil) : 'Sans échéance'}</dd></div></dl>
      {c.validUntil && <div className="life"><div className="bar"><i style={{ width: `${life}%` }} /></div><div className="cap num"><span>{date(c.issuedAt)}</span><span>{date(c.validUntil)}</span></div></div>}
      {c.followUp && v !== 'ok' && <div className="warnbox" style={v === 'crit' ? { background: 'var(--red50)', color: 'var(--red800)' } : undefined}><Icon n="bell-ring" /><span>{c.followUp}</span></div>}
      <div className="cert-f"><span className="sig"><Icon n="shield-check" />Signature vérifiée</span>
        <a className="btn sm" href={asset(c.documentUrl)} target="_blank" rel="noopener" onClick={e => { e.stopPropagation(); toast('Document de démonstration ouvert', 'file-down'); }}><Icon n="file-down" />PDF</a></div>
    </article>
  );
}

export function Conformite() {
  const { p } = usePassport();
  const nodes = useStore(s => s.nodes);
  const c = conformiteSummary(p);
  const offIds = [...new Set(p.certificates.map(x => x.issuerId))].filter(id => nodes[id] && !nodes[id].online);
  const nOff = p.certificates.filter(x => offIds.includes(x.issuerId)).length;
  const ok = p.certificates.filter(x => validity(x.validUntil) === 'ok' && !offIds.includes(x.issuerId)).length;
  useSeen('cert-pefc', 'cert:pefc', 900);
  const groups = ['Réglementaire', 'Produit', 'Substances', 'Santé', 'Système de management'].filter(g => p.certificates.some(x => x.group === g));
  const soon = p.certificates.find(x => validity(x.validUntil) === 'warn');
  return <>
    <Title r="conformite" sub={<>{c.n} preuves{soon ? `, dont 1 à renouveler avant le ${date(soon.validUntil)}` : c.k ? `, dont ${c.k} expirée` : ', toutes valides'}.</>} />
    <div className="rub-sum"><Validity st="ok">{ok} valide{ok > 1 ? 's' : ''}</Validity>{c.w > 0 && <Validity st="warn">{c.w} à renouveler</Validity>}{c.k > 0 && <Validity st="crit">{c.k} expirée{c.k > 1 ? 's' : ''}</Validity>}{nOff > 0 && <Validity st="off">{nOff} en attente de leur source</Validity>}</div>
    {offIds.map(id => <div key={id} className="state warn" style={{ marginTop: 12 }} role="status"><Icon n="cloud-off" /><div><b>{issuer(id).name} ne répond pas.</b> Ses {nOff} preuves affichent leur dernière valeur connue. Le reste du passeport est à jour ; nouvel essai dans 20 s.</div></div>)}
    {groups.map(g => <div key={g}><h3 className="gh">{g}</h3><div className="certs">{p.certificates.filter(x => x.group === g).map(x => <CertificateCard key={x.id} c={x} />)}</div></div>)}
  </>;
}

/* ---------------------------------------------------------------- impact */
export function Impact() {
  const { p } = usePassport();
  const [tbl, setTbl] = useState(false);
  const [more, setMore] = useState(false);
  const im = p.impact;
  const gwp = dpOf(p, 'gwp_a1_a3')!;
  const st = useNode(gwp.provenance.sourceNodeId);
  const per = (gwp.unit ?? '').split('/')[1];
  const vals = im.modules.map(m => m.value);
  const max = Math.max(...vals) * 1.1, min = Math.min(0, ...vals) * 1.3, H = 168, z = (max / (max - min)) * H;
  const h = (v: number) => (Math.abs(v) / (max - min)) * H;
  const env = p.data.filter(d => d.group === 'Environnement');
  const fdes = gwp.provenance;
  if (st === 'loading') return <><Title r="impact" /><div className="band"><Sk h={170} r={16} m="14px 0 0" /><Sk h={290} r={16} m="12px 0 0" /></div></>;
  return <>
    <Title r="impact" sub={im.storedCO2 ? "Ce que coûte ce produit au climat, et ce qu'il stocke." : 'Ce que coûte ce produit au climat.'} />
    {im.storedCO2 ? (
      <section className="balance" aria-label="Bilan carbone">
        <div className="bal-row"><div><div className="bal-n" style={{ color: 'var(--mat-bois)' }}>−{num(im.storedCO2)}</div><div className="bal-u">kg CO₂ stockés dans le bois, pendant toute sa vie en œuvre</div></div>
          <div><div className="bal-n">+{num(im.lifecycleTotal)}</div><div className="bal-u">kg CO₂e émis sur le cycle de vie, de la forêt à la fin de vie (A à C)</div></div></div>
        <div className="bal-viz" role="img" aria-label={`${im.storedCO2} kg stockés contre ${im.lifecycleTotal} kg émis`}>
          <span className="st" style={{ left: 0, width: `${(im.storedCO2 / (im.storedCO2 + im.lifecycleTotal)) * 100}%` }} /><span className="zero" style={{ left: `${(im.storedCO2 / (im.storedCO2 + im.lifecycleTotal)) * 100}%` }} />
          <span className="em" style={{ left: `calc(${(im.storedCO2 / (im.storedCO2 + im.lifecycleTotal)) * 100}% + 2px)`, width: `calc(${(im.lifecycleTotal / (im.storedCO2 + im.lifecycleTotal)) * 100}% - 2px)` }} /></div>
        <div className="bal-cap"><span>Stocké</span><span>Émis</span></div>
        <p className="bal-note">Le carbone stocké est rendu à l&apos;atmosphère si le bois est brûlé en fin de vie. Le réemploi prolonge le stockage.</p>
      </section>
    ) : (
      <section className="balance"><div className="bal-n">+{num(im.lifecycleTotal)}</div><div className="bal-u">kg CO₂e émis sur le cycle de vie (A à C), pour {p.functionalUnit}</div></section>
    )}
    <section className="chart"><div className="chart-h"><div><h3>Émissions par étape du cycle de vie</h3><p>kg CO₂e pour {p.functionalUnit}, selon EN 15804+A2</p></div>
      <div className="seg" role="group" aria-label="Affichage"><button aria-pressed={!tbl} onClick={() => setTbl(false)}><Icon n="chart-column" />Graphique</button><button aria-pressed={tbl} onClick={() => setTbl(true)}><Icon n="table" />Tableau</button></div></div>
      {tbl ? <table className="tbl" style={{ marginTop: 12 }}><caption className="sr">Émissions par module</caption><thead><tr><th scope="col">Module</th><th scope="col">Étape</th><th scope="col" className="r">kg CO₂e</th></tr></thead>
        <tbody>{im.modules.map(m => <tr key={m.m}><td>{m.m}</td><td>{m.label}{m.outOfCycle ? ' (hors cycle)' : ''}</td><td className="r">{num(m.value)}</td></tr>)}</tbody></table>
        : <>
          <div className="bars" role="img" aria-label={im.modules.map(m => `${m.m} : ${num(m.value)}`).join(', ')}>
            <span className="base" style={{ top: 22 + z }} />
            {im.modules.map((m, k) => <div className="bar-c" key={m.m}>{m.value >= 0
              ? <><span className={`b${k === 0 ? ' main' : ''}`} style={{ top: z - h(m.value), height: Math.max(h(m.value), m.value ? 2 : 0) }} /><span className="lbl" style={{ top: z - h(m.value) - 18 }}>{num(m.value)}</span></>
              : <><span className="b neg" style={{ top: z + 1, height: h(m.value) }} /><span className="lbl" style={{ top: z + h(m.value) + 5 }}>{num(m.value)}</span></>}</div>)}
          </div>
          <div className="bars-x">{im.modules.map(m => <div key={m.m}><b>{m.m}</b>{m.label}</div>)}</div>
          <div className="legend"><span><i style={{ background: 'var(--s900)' }} />Fabrication</span><span><i style={{ background: 'var(--s700)' }} />Autres étapes</span>
            <span><i style={{ background: 'repeating-linear-gradient(45deg,var(--s300) 0 2px,var(--s100) 2px 4px)', boxShadow: 'inset 0 0 0 1px var(--s300)' }} />Bénéfice potentiel, hors cycle</span></div>
        </>}
    </section>
    <div className="mini-grid">
      <div className="mini"><div className="l">Contenu biosourcé</div><div className="donut"><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--s200)" strokeWidth="4" />
        {im.biobased > 0 && <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--mat-bois)" strokeWidth="4" strokeDasharray={`${im.biobased} 100`} pathLength={100} />}</svg>
        <div><div className="v">{im.biobased}<small> %</small></div><div className="l" style={{ fontSize: 12 }}>{im.biobasedDetail}</div></div></div></div>
      <div className="mini"><div className="l">Eau douce consommée</div><div className="v" style={{ marginTop: 12 }}>{im.water}<small> m³ par {per}</small></div><div className="l" style={{ fontSize: 12, marginTop: 6 }}>Contenu recyclé : {im.recycled} %</div></div>
    </div>
    {gwp.benchmark && <section className="chart"><div className="chart-h"><div><h3>Face aux produits comparables</h3><p>Carbone de fabrication, {gwp.unit}</p></div><StatusPill s={gwp.provenance.status} /></div><BenchmarkBar d={gwp} /></section>}
    <div className="grp"><div className="list">
      <button className="row" aria-expanded={more} onClick={() => setMore(!more)}><span className="tile"><Icon n="table-2" /></span><div className="grow"><div className="q">{more ? "Masquer l'analyse détaillée" : "Voir l'analyse détaillée"}</div><div className="a">{env.length} indicateurs environnementaux, avec leur preuve</div></div><Icon n={more ? 'chevron-up' : 'chevron-down'} /></button>
      {more && <div className="row" style={{ display: 'block' }}><table className="tbl"><caption className="sr">Indicateurs environnementaux</caption><thead><tr><th scope="col">Indicateur</th><th scope="col" className="r">Valeur</th><th scope="col" className="r">Statut</th></tr></thead>
        <tbody>{env.map(d => <tr key={d.key}><td>{d.label}</td><td className="r">{withUnit(d.value, d.unit)}</td><td className="r">{STATUS[d.provenance.status].label}</td></tr>)}</tbody></table></div>}
      {fdes.documentRef && <a className="row" href={asset(fdes.documentUrl ?? '')} target="_blank" rel="noopener"><span className="tile"><Icon n="file-text" /></span><div className="grow"><div className="q">{fdes.documentRef.replace('n° ', '')}</div><div className="a">PDF{fdes.verifierId ? ` · vérifiée par ${issuer(fdes.verifierId).name}` : ''}</div></div><Icon n="download" /></a>}
    </div></div>
  </>;
}

/* ---------------------------------------------------------------- origine */
function Step({ s, sel, onSelect }: { s: ReturnType<typeof usePassport>['p']['supplyChain'][number]; sel: boolean; onSelect: () => void }) {
  const st = useNode(s.sourceNodeId);
  return <li className={`step${sel ? ' sel' : ''}`}><span className="nb"><Icon n={s.icon} /></span>
    <div className="step-c" id={`etape-${s.order}`} role="button" tabIndex={0} aria-expanded={sel} onClick={onSelect} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect())}>
      <div className="step-t"><b>{s.label}</b><span className="km">{s.distanceKmFromPrevious ? `+${s.distanceKmFromPrevious} km` : 'départ'}</span></div>
      <div className="step-p">{s.place}{s.date ? ` · ${s.date}` : ''}</div>
      <div className="step-m"><span className="from"><Org id={s.actorId} size="xs" /><span>Fourni par <b>{issuer(s.actorId).name}</b></span></span><NetworkTag id={s.actorId} /></div>
      {sel ? <div className="step-x"><div className="mut" style={{ fontSize: 12.5 }}>{s.detail}</div>
        {st === 'offline' ? <div className="offbox"><Icon n="cloud-off" /><span>La source de cette étape ne répond pas ; sa preuve reviendra dès qu&apos;elle répondra.</span></div>
          : st === 'loading' ? <Sk h={90} m="8px 0 0" /> : s.proof && <article className="cert"><div className="cert-h"><span className="cert-ic"><Icon n="trees" /></span><div className="grow"><h4>{s.proof.title}</h4><div className="no">{s.proof.number}</div></div><Validity st={validity(s.proof.validUntil) === 'ok' ? 'ok' : validity(s.proof.validUntil)}>{validity(s.proof.validUntil) === 'ok' ? 'Valide' : 'À renouveler'}</Validity></div>
            <dl><div><dt>Titulaire</dt><dd><Org id={s.proof.holderId} size="xs" />{issuer(s.proof.holderId).name}</dd></div><div><dt>Valide jusqu&apos;au</dt><dd className="num">{date(s.proof.validUntil)}</dd></div></dl>
            <div className="cert-f"><span className="sig"><Icon n="shield-check" />Signé par {s.proof.holderId === s.actorId ? 'l’entreprise elle-même' : issuer(s.proof.holderId).name}</span><a className="btn sm" href={asset('/docs/certificat-demo.pdf')} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}><Icon n="file-down" />PDF</a></div></article>}</div>
        : s.certificates.length ? <div className="step-m">{s.certificates.map(c => <span key={c} className="chip"><Icon n="badge-check" />{c}</span>)}</div> : null}
    </div></li>;
}

export function Origine() {
  const { p } = usePassport();
  const emit = useStore(s => s.emit);
  const [sel, setSel] = useState(0);
  const [map, setMap] = useState(true);
  const total = p.supplyChain.reduce((s, x) => s + (x.distanceKmFromPrevious ?? 0), 0);
  const pick = (n: number) => { setSel(sel === n ? 0 : n); emit('step:' + n); };
  return <>
    <Title r="origine" sub="Chaque étape est déclarée et prouvée par l'entreprise qui la connaît." />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 16px 0' }} className="band-x">
      <div className="seg" role="group" aria-label="Affichage"><button aria-pressed={map} onClick={() => setMap(true)}><Icon n="map" />Carte</button><button aria-pressed={!map} onClick={() => setMap(false)}><Icon n="list-ordered" />Étapes</button></div>
      {p.batch && <span className="mut" style={{ fontSize: 12.5 }}>Lot {p.batch}</span>}</div>
    {map && <div className="map" role="img" aria-label={`Carte du trajet : ${p.supplyChain.map(s => s.place).join(', ')}`}><ChainMap steps={p.supplyChain} sel={sel} onSelect={pick} /></div>}
    <div className="route-sum"><div><div className="v">{num(total)} km</div><div className="l">de l&apos;origine au chantier</div></div><div><div className="v">100 %</div><div className="l">des étapes en France</div></div><div><div className="v">{p.supplyChain.length} sur {p.supplyChain.length}</div><div className="l">étapes prouvées</div></div></div>
    <ol className="steps">{p.supplyChain.map(s => <Step key={s.order} s={s} sel={sel === s.order} onSelect={() => pick(s.order)} />)}</ol>
  </>;
}

/* ---------------------------------------------------------------- usage */
export function Usage() {
  const { p, openWallet } = usePassport();
  const profile = useProfile();
  const toast = useStore(s => s.toast);
  const [find, setFind] = useState(false);
  const u = p.usage;
  return <>
    <Title r="usage" sub="Poser, entretenir, garantir." />
    <div className="grp" style={{ marginTop: 12 }}><div className="list">
      <a className="row" href={asset(u.installGuideUrl)} target="_blank" rel="noopener"><span className="tile"><Icon n="book-open-text" /></span><div className="grow"><div className="q">Notice de pose</div><div className="a">PDF · public</div></div><Icon n="download" /></a>
      {u.warrantyYears > 0 && <div className="row"><span className="tile"><Icon n="shield" /></span><div className="grow"><div className="q">Garantie {u.warrantyYears} ans</div><div className="a">Sous réserve d&apos;une pose conforme à la notice</div></div><StatusPill s="declared" /></div>}
    </div></div>
    <section className="grp"><div className="grp-h"><h2>Compatible avec</h2></div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{u.compatibleWith.map(c => <span key={c} className="chip"><Icon n="link-2" />{c}</span>)}</div></section>
    <section className="grp"><div className="grp-h"><h2>Plan d&apos;entretien</h2></div><div className="list">
      {u.maintenancePlan.map(m => <div className="row" key={m.every}><span className="tile"><Icon n="calendar-clock" /></span><div className="grow"><div className="l">{m.every}</div><div className="q" style={{ fontWeight: 500 }}>{m.task}</div></div></div>)}</div></section>
    {canRead('professional', profile)
      ? <section className="unl"><div className="grp-h" style={{ margin: '0 2px 8px' }}><h2 style={{ fontSize: 15, fontWeight: 600 }}>Pour les professionnels</h2><span className="chip em"><Icon n="lock-open" />Ouvert</span></div><div className="list">
        {u.pro.map(x => <div className="row" key={x.label}><div className="grow"><div className="l">{x.label}</div><div className="v">{x.value}</div></div><StatusPill s="documented" /></div>)}
        <div className="row"><div className="grow"><div className="l">Pièces du système</div><div className="v">Commande directe au fabricant</div></div><button className="btn sm" onClick={() => toast('Demande de pièce envoyée à ' + issuer(p.manufacturerId).name, 'shopping-cart')}><Icon n="shopping-cart" />Commander une pièce</button></div></div></section>
      : <section className="locked"><div className="locked-h"><Icon n="lock" /><div><div className="t">Détails de pose et nomenclature</div><div className="d">Entraxes, fixations, composants du système et commande de pièces. Réservé aux professionnels.</div></div></div>
        <div className="ghost" aria-hidden="true"><span style={{ width: '78%' }} /><span style={{ width: '58%' }} /></div><button className="btn w" onClick={openWallet}><Icon n="wallet" />Présenter mon attestation</button></section>}
    <div className="grp"><button className="btn w lg" aria-expanded={find} onClick={() => setFind(!find)}><Icon n="hard-hat" />Trouver un poseur qualifié</button>
      {find && <div className="list" style={{ marginTop: 10 }}>{[['Horizon Bois Construction', 'Qualification RGE · 12 km'], ['Charpentes du Lez', 'Qualification Qualibat 2393 · 7 km'], ['Ossature Méditerranée', 'Qualification RGE · 24 km']].map(([n, d]) =>
        <div className="row" key={n}><span className="tile"><Icon n="hard-hat" /></span><div className="grow"><div className="q">{n}</div><div className="a">{d}</div></div><Icon n="chevron-right" /></div>)}
        <div className="row mut" style={{ fontSize: 12, minHeight: 0 }}>Liste fictive, pour la démonstration.</div></div>}</div>
  </>;
}

/* ---------------------------------------------------------------- fin de vie */
const LV = { easy: ['Facile', 3], medium: ['Moyenne', 2], hard: ['Difficile', 1], high: ['Élevé', 3], mid: ['Moyen', 2], low: ['Faible', 1] } as const;
const OUT = { reuse: ['Réemploi', '#3a8a55'], recycling: ['Recyclage', '#3565a8'], energy: ['Valorisation', '#c98a2e'] } as const;

export function FinDeVie() {
  const { p } = usePassport();
  const depose = useAssets().find(a => a.id === 'depose');
  const profile = useProfile();
  const [f, setF] = useState<'all' | keyof typeof OUT>('all');
  const e = p.endOfLife, b = building(p.buildings[0] ?? '');
  const meter = (label: string, k: keyof typeof LV, note: string) => {
    const [t, n] = LV[k];
    return <div className="meter"><div className="l">{label}</div><div className="v"><Icon n={n === 3 ? 'circle-check' : n === 2 ? 'circle-dashed' : 'circle-alert'} />{t}</div>
      <div className="pips" aria-hidden="true">{[1, 2, 3].map(i => <i key={i} className={i <= n ? 'on' : ''} />)}</div><div className="s">{note}</div></div>;
  };
  const outlets = e.outlets.filter(o => f === 'all' || o.type === f);
  return <>
    <Title r="fin-de-vie" sub="Démonter, réemployer, recycler." />
    <div className="meters">{meter('Démontabilité', e.dismantlability, e.dismantlabilityNote)}{meter('Potentiel de réemploi', e.reusePotential === 'medium' ? 'mid' : e.reusePotential, e.reuseNote)}</div>
    <section className="grp" style={{ marginLeft: 0, marginRight: 0 }}><div className="grp-h" style={{ margin: '0 18px 8px' }}><h2>Déposer en {e.steps.length} gestes</h2><span className="mut" style={{ fontSize: 12.5 }}>{profile === 'deconstructor' ? 'Version détaillée' : 'Version simplifiée'}</span></div>
      <div className="dism">{e.steps.map((s, k) => <div className="dstep" key={k}><div className="pic"><span>0{k + 1}</span><Icon n={s.icon} /></div><p>{s.text}</p></div>)}</div></section>
    {e.eprScheme && <div className="grp"><div className="list"><div className="row"><span className="tile"><Icon n="recycle" /></span><div className="grow"><div className="q">Filière REP PMCB · {issuer(e.eprIssuerId ?? 'eco').name}</div><div className="a">{e.eprScheme.split('· ')[1] ?? e.eprScheme}</div></div><NetworkTag id={e.eprIssuerId ?? 'eco'} /></div></div></div>}
    <section className="grp"><div className="grp-h"><h2>Où l&apos;orienter près du bâtiment</h2></div></section>
    <div className="filters" role="group" aria-label="Type d'exutoire">
      <button aria-pressed={f === 'all'} onClick={() => setF('all')}>Tous<span className="n">{e.outlets.length}</span></button>
      {(Object.keys(OUT) as (keyof typeof OUT)[]).filter(k => e.outlets.some(o => o.type === k)).map(k => <button key={k} aria-pressed={f === k} onClick={() => setF(k)}>{OUT[k][0]}<span className="n">{e.outlets.filter(o => o.type === k).length}</span></button>)}
    </div>
    {b && <div className="map" style={{ height: 200 }} role="img" aria-label="Carte des exutoires autour du bâtiment"><PointsMap center={[b.lat, b.lng]} points={outlets.map(o => ({ lat: o.lat, lng: o.lng, color: OUT[o.type][1] }))} /></div>}
    <div className="grp" style={{ marginTop: 12 }}><div className="list">{outlets.map(o => <div className="row" key={o.name}><span className="pinc" style={{ background: OUT[o.type][1], margin: '0 6px 0 4px' }} /><div className="grow"><div className="q" style={{ fontWeight: 500 }}>{o.name}</div><div className="a">{OUT[o.type][0]} · {o.place} · {o.distanceKm} km</div></div><Icon n="chevron-right" /></div>)}</div></div>
    {depose ? <section className="grp"><div className="grp-h"><h2>Plan de dépose détaillé</h2><span className="mut" style={{ fontSize: 12.5 }}>Sous contrat</span></div><div className="list"><AssetRow a={depose} /></div></section>
      : <section className="locked"><div className="locked-h"><Icon n="lock" /><div><div className="t">Plan de dépose détaillé</div><div className="d">Points de levage, ordre de dépose, masses par panneau. Le fabricant ne l&apos;a pas encore ouvert : il fixera d&apos;abord ses conditions d&apos;accès.</div></div></div></section>}
  </>;
}

/* ---------------------------------------------------------------- preuves */
export function Preuves() {
  const { p, openProof } = usePassport();
  const profile = useProfile();
  const [f, setF] = useState<'all' | VerificationStatus>('all');
  const n = (s: VerificationStatus) => p.data.filter(d => d.provenance.status === s).length;
  const F: ['all' | VerificationStatus, string, number][] = [['all', 'Toutes', p.data.length], ...(['third_party_verified', 'controlled', 'documented', 'declared', 'unverified'] as VerificationStatus[]).filter(s => n(s)).map(s => [s, STATUS[s].label, n(s)] as ['all' | VerificationStatus, string, number])];
  return <>
    <Title r="preuves" sub={`${p.data.length} données, ${p.certificates.length} certificats. Chacune dit qui l'affirme et qui l'a vérifiée.`} />
    <div className="filters" role="group" aria-label="Filtrer par statut" style={{ marginTop: 12 }}>{F.map(([k, l, c]) => <button key={k} aria-pressed={f === k} onClick={() => setF(k)}>{l}<span className="n">{c}</span></button>)}</div>
    <div className="grp" style={{ marginTop: 12 }}><div className="list">{p.data.filter(d => f === 'all' || d.provenance.status === f).map(d => {
      const ok = canRead(d.visibility, profile);
      return <div className="row" key={d.key}><div className="grow"><div className="l">{d.label}</div>
        <div className="v" style={ok ? undefined : { color: 'var(--s400)', fontWeight: 500, fontSize: 13.5 }}>{ok ? withUnit(d.value, d.unit) : <><Icon n="lock" className="ic-s" /> Réservée {d.visibility === 'authority' ? 'aux autorités' : 'aux professionnels'}</>}</div>
        <div className="from" style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--s500)' }}><Org id={d.provenance.sourceNodeId} size="xs" /><span>{issuer(d.provenance.sourceNodeId).name}</span></div></div>
        <StatusPill s={d.provenance.status} onClick={ok ? () => openProof(d.key) : undefined} /></div>;
    })}</div></div>
  </>;
}

/* ---------------------------------------------------------------- historique */
export function Historique() {
  const { p } = usePassport();
  return <>
    <Title r="historique" sub="Chaque version est signée. Rien n'est effacé." />
    <ol className="steps" style={{ marginTop: 16 }}>{p.versions.map((v, k) => <li key={v.version} className={`step${k === 0 ? ' sel' : ''}`}><span className="nb"><Icon n={k === 0 ? 'file-check-2' : 'file-clock'} /></span>
      <div className="step-c"><div className="step-t"><b>Version {v.version}{k === 0 && p.passportStatus === 'published' ? <span className="chip em" style={{ height: 22, marginLeft: 6 }}>En vigueur</span> : null}</b><span className="km">{date(v.date)}</span></div>
        <div className="step-p">{v.author}</div><ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: 13, color: 'var(--s700)', lineHeight: 1.6 }}>{v.changes.map(c => <li key={c}>{c}</li>)}</ul>
        <div className="step-m"><span className="sig"><Icon n="shield-check" />Signée par {issuer(p.manufacturerId).name}</span></div></div></li>)}</ol>
    <section className="grp"><div className="grp-h"><h2>Vie du produit</h2></div><div className="list">{p.events.map(e => <div className="row" key={e.date + e.label}><span className="tile"><Icon n={e.type === 'delivered' ? 'truck' : e.type === 'installed' ? 'hammer' : 'factory'} /></span>
      <div className="grow"><div className="q" style={{ fontWeight: 500 }}>{e.label}</div><div className="a">{date(e.date)} · {issuer(e.actorId).name}</div></div></div>)}</div></section>
  </>;
}

export const RENDER: Record<Rubrique, () => JSX.Element> = { identite: Identite, conformite: Conformite, impact: Impact, origine: Origine, usage: Usage, 'fin-de-vie': FinDeVie, preuves: Preuves, historique: Historique };

/** Émet l'ouverture d'une rubrique pour le récit. */
export function useRubEvent(r?: string) {
  const emit = useStore(s => s.emit);
  const hydrated = useStore(s => s.hydrated);
  useEffect(() => { if (r && hydrated) emit('rub:' + r); }, [r, hydrated, emit]);
}
