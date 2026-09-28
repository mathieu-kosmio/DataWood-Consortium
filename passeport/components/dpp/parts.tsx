'use client';
/* Carte d'identité du produit (spec § 7.2) : l'écran héros, mobile d'abord. */
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Org, Sk, StatusPill, Validity } from '@/components/ui/kit';
import { building, daysUntil, issuer, RUBRIQUES, trust, validity } from '@/lib/data';
import { date, num, NNBSP, withUnit } from '@/lib/format';
import { useNode } from '@/lib/hooks';
import { PROFILE_LABEL, canRead, useStore } from '@/lib/store';
import { asset } from '@/lib/asset';
import type { Certificate, DataPoint, Product } from '@/lib/types';
import { dpOf, usePassport, useProfile } from './context';

export function TopBar() {
  const { p, openWallet } = usePassport();
  const profile = useProfile();
  const hydrated = useStore(s => s.hydrated);
  const pro = hydrated && profile !== 'public';
  const toast = useStore(s => s.toast);
  return (
    <header className="pp-top" id="top">
      <div className="maker"><Org id={p.manufacturerId} /><span className="d-only">Passeport produit</span></div>
      <span className="sp" />
      <div className="lang" role="group" aria-label="Langue"><button aria-pressed="true">FR</button><button aria-pressed="false" onClick={() => toast("La version anglaise n'est pas encore traduite dans cette maquette", 'globe')}>EN</button></div>
      {pro ? <button className="pro-btn on" id="a-pro" onClick={openWallet}><Icon n="badge-check" />{PROFILE_LABEL[profile]}</button>
        : <button className="pro-btn" id="a-pro" onClick={openWallet}><Icon n="wallet" />Je suis un professionnel</button>}
      <button className="icon-btn" aria-label="Partager" onClick={() => { navigator.clipboard?.writeText(location.href); toast('Lien du passeport copié', 'link'); }}><Icon n="share" /></button>
    </header>
  );
}

export function StateBanner() {
  const { p } = usePassport();
  if (p.passportStatus === 'superseded' && p.newerVersion) return (
    <div className="state warn" role="status"><Icon n="history" /><div><b>Une version plus récente existe.</b> Vous lisez la version {p.passportVersion} ; le fabricant a publié la {p.newerVersion.version} le {date(p.newerVersion.date)}. <a className="link" href="#" onClick={e => e.preventDefault()}>Voir la version à jour</a></div></div>
  );
  if (p.passportStatus === 'withdrawn') return <div className="state crit" role="alert"><Icon n="octagon-x" /><div><b>Produit retiré du marché.</b> Ne pas poser. Contactez le fabricant.</div></div>;
  return null;
}

export function Hero({ lot }: { lot?: string }) {
  const { p } = usePassport();
  const published = useStore(s => s.hydrated && s.admin.published);
  const g = { model: 'Passeport modèle', batch: 'Passeport lot', item: 'Passeport article' }[p.granularity];
  return (
    <div className="hero">
      <div className="shot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(p.image)} alt={`Photo du produit : ${p.name}`} width={800} height={800} style={p.imagePosition ? { objectPosition: p.imagePosition } : undefined} fetchPriority="high" />
        <span className="gran"><Icon n={p.granularity === 'batch' ? 'package' : 'box'} />{g}</span>
        {p.assets?.some(a => a.id === 'bim') && <a className="bim" href="#asset-bim" onClick={e => { e.preventDefault(); document.getElementById('asset-bim')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}><Icon n="box" />Maquette BIM</a>}
      </div>
      <h1>{p.name}</h1>
      <div className="by"><b>{issuer(p.manufacturerId).name}</b> · {p.family}</div>
      <div className="ids"><span>GTIN <span className="mono">{p.gtin}</span></span>{(lot || p.batch) && p.granularity === 'batch' || lot ? <span>Lot <span className="mono">{lot ?? p.batch}</span></span> : null}<span>Version {published && p.gtin === '03760000000011' ? '2.2' : p.passportVersion}</span><span>Mis à jour le {date(p.updatedAt)}</span></div>
    </div>
  );
}

export function TrustBanner() {
  const { p } = usePassport();
  const t = trust(p), off = 88 * (1 - t.tiers / t.total);
  return (
    <Link className="trust" id="a-trust" href={`/p/${p.gtin}/preuves`}>
      <span className="ring"><svg viewBox="0 0 34 34" aria-hidden="true"><circle className="t" cx="17" cy="17" r="14" /><circle className="v" cx="17" cy="17" r="14" style={{ ['--off' as string]: off }} /></svg><Icon n="check" /></span>
      <span><span className="tt" style={{ display: 'block' }}>{t.tiers} données sur {t.total} vérifiées par un tiers</span>
        <span className="ts" style={{ display: 'block' }}>Chaque donnée ouvre sa preuve : qui l&apos;affirme, qui l&apos;a vérifiée.</span></span>
      <Icon n="chevron-right" />
    </Link>
  );
}

export function BenchmarkBar({ d, cap = true }: { d: DataPoint; cap?: boolean }) {
  const b = d.benchmark!, v = d.value as number;
  const lo = b.p10 - (b.p90 - b.p10) * 0.22, hi = b.p90 + (b.p90 - b.p10) * 0.22;
  const x = (n: number) => `${(((n - lo) / (hi - lo)) * 100).toFixed(1)}%`;
  const diff = Math.round(((b.median - v) / b.median) * 100);
  return (
    <div className="bench" role="img" aria-label={`Valeur ${num(v)}, médiane de la famille ${num(b.median)}, 10 % les plus bas sous ${num(b.p10)}, 10 % les plus hauts au-dessus de ${num(b.p90)}`}>
      <div className="bench-track"><span className="rail" /><span className="band" style={{ left: x(b.p10), width: `calc(${x(b.p90)} - ${x(b.p10)})` }} />
        <span className="med" style={{ left: x(b.median) }} /><span className="me" style={{ left: x(v) }} /></div>
      <div className="bench-scale num"><span style={{ left: x(b.p10) }}>{num(b.p10)}</span><span style={{ left: x(b.median) }}>médiane {num(b.median)}</span><span style={{ left: x(b.p90) }}>{num(b.p90)}</span></div>
      {cap && <p className="bench-cap">{diff > 0 ? <><b>{diff} % sous la médiane</b> des {b.n} {b.familyLabel}</> : <><b style={{ color: 'var(--amber800)' }}>{-diff} % au-dessus de la médiane</b> des {b.n} {b.familyLabel}</>}</p>}
    </div>
  );
}

export function CarbonKpi() {
  const { p, openProof } = usePassport();
  const d = dpOf(p, p.keyIndicators[0])!;
  const st = useNode(d.provenance.sourceNodeId);
  const profile = useProfile();
  const stored = dpOf(p, 'biogenic_stored');
  const [u, per] = (d.unit ?? '').split('/');
  return (
    <section className="kpi" id="kpi-carbone" aria-labelledby="kpi-l" aria-busy={st === 'loading'}>
      <div className="kpi-h"><div className="kpi-l" id="kpi-l"><Icon n="factory" />Carbone de fabrication <span className="mut">(A1-A3)</span></div></div>
      {st === 'loading' ? <><Sk w="55%" h={46} m="8px 0 0" /><Sk w="70%" h={12} m="10px 0 0" /><Sk h={28} m="18px 0 0" /></> : <>
        <div className="kpi-v"><span className="n" style={st === 'offline' ? { color: 'var(--s400)' } : undefined}>{num(d.value as number)}</span><span className="u">{u}</span>
          <span style={{ marginLeft: 'auto', alignSelf: 'center' }}><StatusPill s={d.provenance.status} id="a-gwp" off={st === 'offline'} onClick={() => openProof(d.key)} /></span>
          <span className="per">par {per} de produit, selon sa fiche FDES</span></div>
        {d.benchmark && <BenchmarkBar d={d} />}
        {stored && canRead(stored.visibility, profile) && <div className="stored"><Icon n="leaf" /><span>Et <b>{num(stored.value as number)} kg de CO₂</b> stockés dans le bois de ce {per}</span></div>}
        {profile === 'public' && d.equivalent && <div className="equiv"><Icon n="car" /><span>{num(d.value as number)}{NNBSP}kg, c&apos;est {d.equivalent}</span></div>}
      </>}
    </section>
  );
}

function RetenirRow({ d }: { d: DataPoint }) {
  const { openProof } = usePassport();
  const st = useNode(d.provenance.sourceNodeId);
  if (st === 'loading') return <div className="row"><span className="tile"><Icon n={d.icon ?? 'info'} /></span><div className="grow"><Sk w="40%" h={10} /><Sk w="55%" h={14} m="6px 0 0" /></div><Sk w="120px" h={24} r={999} /></div>;
  if (st === 'offline') return (
    <div className="row off"><span className="tile"><Icon n={d.icon ?? 'info'} /></span><div className="grow"><div className="l">{d.label}</div><div className="v">{withUnit(d.value, d.unit)}</div>
      <div className="offl"><Icon n="cloud-off" />Source indisponible · valeur du 26/09 à 10:42</div></div><StatusPill s={d.provenance.status} off /></div>
  );
  return <div className="row"><span className="tile"><Icon n={d.icon ?? 'info'} /></span><div className="grow"><div className="l">{d.label}</div><div className="v">{withUnit(d.value, d.unit)}</div></div><StatusPill s={d.provenance.status} onClick={() => openProof(d.key)} /></div>;
}

export function Retenir() {
  const { p } = usePassport();
  const rows = p.keyIndicators.slice(1).map(k => dpOf(p, k)).filter((d): d is DataPoint => !!d);
  return (
    <section className="grp"><div className="grp-h"><h2>À retenir</h2><Link className="a" href={`/p/${p.gtin}/identite`}>Toutes les performances</Link></div>
      <div className="list">{rows.map(d => <RetenirRow key={d.key} d={d} />)}</div></section>
  );
}

export function certState(c: Certificate) {
  const v = validity(c.validUntil);
  const txt = v === 'crit' ? `Expiré le ${date(c.validUntil)}` : v === 'warn' ? `Expire dans ${daysUntil(c.validUntil)} jours` : c.validUntil ? `Jusqu'en ${c.validUntil.slice(0, 4)}` : 'Valide';
  return { v, txt };
}

function Badge({ c }: { c: Certificate }) {
  const { p } = usePassport();
  const st = useNode(c.issuerId);
  const { v, txt } = certState(c);
  const s = st === 'offline' ? 'off' : v;
  const I = { ok: 'circle-check', warn: 'clock-alert', crit: 'octagon-x', off: 'cloud-off' }[s];
  return <Link className={`badge ${s}`} href={`/p/${p.gtin}/conformite`}><Icon n={I} /><span><span className="bt" style={{ display: 'block' }}>{c.title}</span><span className="bd" style={{ display: 'block' }}>{st === 'loading' ? 'Lecture…' : s === 'off' ? 'Source indisponible' : txt}</span></span></Link>;
}

export function ComplianceBadges() {
  const { p } = usePassport();
  const rank = { crit: 0, warn: 1, ok: 2 };
  const list = p.certificates.filter(c => c.kind !== 'management_system' && c.kind !== 'substances').sort((a, b) => rank[validity(a.validUntil)] - rank[validity(b.validUntil)]);
  return <section className="grp"><div className="grp-h"><h2>Conformité</h2><Link className="a" href={`/p/${p.gtin}/conformite`}>Voir les preuves</Link></div>
    <div className="badges">{list.map(c => <Badge key={c.id} c={c} />)}</div></section>;
}

export function conformiteSummary(p: Product) {
  const w = p.certificates.filter(c => validity(c.validUntil) === 'warn').length, k = p.certificates.filter(c => validity(c.validUntil) === 'crit').length;
  return { n: p.certificates.length, w, k };
}

export function Questions() {
  const { p } = usePassport();
  const c = conformiteSummary(p);
  return (
    <section className="grp"><div className="grp-h"><h2>Tout savoir sur ce produit</h2></div><div className="list">
      {RUBRIQUES.slice(0, 6).map(r => {
        const a = r.key === 'conformite'
          ? <>{c.n} preuves{c.w ? <>, <span className="flag">{c.w} à renouveler</span></> : null}{c.k ? <>, <span className="flag" style={{ color: 'var(--red700)' }}>{c.k} expirée{c.k > 1 ? 's' : ''}</span></> : null}</>
          : p.summaries[r.key as keyof Product['summaries']];
        return <Link key={r.key} className="row" href={`/p/${p.gtin}/${r.key}`} id={`q-${r.key}`}><span className="tile"><Icon n={r.icon} /></span>
          <div className="grow"><div className="q">{r.question}</div><div className="a">{a}</div></div><Icon n="chevron-right" /></Link>;
      })}
    </div></section>
  );
}

export function ProBlock() {
  const { p, openProof, openWallet } = usePassport();
  const profile = useProfile();
  const unlockedAt = useStore(s => s.unlockedAt);
  const pro = p.data.filter(d => d.visibility === 'professional');
  if (!pro.length) return null;
  if (!canRead('professional', profile)) return (
    <section className="locked" id="blk-pro"><div className="locked-h"><Icon n="lock" /><div><div className="t">Données réservées aux professionnels</div>
      <div className="d">{pro.length} donnée{pro.length > 1 ? 's' : ''} détaillée{pro.length > 1 ? 's' : ''} et 2 documents : détails de pose, nomenclature du système. Présentez une attestation pour les lire ici.</div></div></div>
      <div className="ghost" aria-hidden="true"><span style={{ width: '84%' }} /><span style={{ width: '62%' }} /><span style={{ width: '73%' }} /></div>
      <button className="btn w" onClick={openWallet}><Icon n="wallet" />Présenter mon attestation</button></section>
  );
  const fresh = Date.now() - unlockedAt < 4000;
  return (
    <section className="unl" id="blk-pro"><div className="grp-h" style={{ margin: '0 2px 8px' }}><h2 style={{ fontSize: 15, fontWeight: 600 }}>Pour les professionnels</h2><span className="chip em"><Icon n="lock-open" />Ouvert par votre attestation</span></div>
      <p className="assets-note" style={{ margin: '0 2px 8px' }}><Icon n="file-signature" className="ic-s" /> Ouvert par le parcours « Accès professionnel » du fabricant : votre attestation suffit, le contrat est conclu automatiquement.</p>
      <div className={`list${fresh ? ' unlocked' : ''}`}>
        {pro.map(d => <div className="row" key={d.key}><div className="grow"><div className="l">{d.label}</div><div className="v">{withUnit(d.value, d.unit)}</div></div><StatusPill s={d.provenance.status} onClick={() => openProof(d.key)} /></div>)}
        <a className="row" href={asset(p.usage.installGuideUrl)} target="_blank" rel="noopener"><span className="tile"><Icon n="file-text" /></span><div className="grow"><div className="q">Détails de pose</div><div className="a">PDF · réservé aux professionnels</div></div><Icon n="download" /></a>
        <Link className="row" href={`/p/${p.gtin}/usage`}><span className="tile"><Icon n="list-tree" /></span><div className="grow"><div className="q">Nomenclature du système</div><div className="a">{p.usage.pro.length} éléments référencés</div></div><Icon n="chevron-right" /></Link>
      </div></section>
  );
}

export function BuildingLink() {
  const { p } = usePassport();
  const b = p.buildings[0] ? building(p.buildings[0]) : undefined;
  if (!b) return null;
  const comp = b.components.find(c => c.gtin === p.gtin);
  return (
    <Link className="bld" id="a-bld" href={`/b/${b.id}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(b.image.replace('.webp', '-vignette.webp'))} alt="" width={72} height={72} loading="lazy" />
      <div className="grow"><div className="k"><Icon n="building-2" />Présent dans {p.buildings.length} bâtiment</div><div className="n">{b.name}</div><div className="s">Montpellier{comp?.installedAt ? ` · posé le ${comp.installedAt}` : ''}</div></div><Icon n="chevron-right" />
    </Link>
  );
}

export function Actions() {
  const { p } = usePassport();
  const toast = useStore(s => s.toast);
  return (
    <div className="acts">
      <a className="act" href={asset('/docs/fiche-produit-demo.pdf')} target="_blank" rel="noopener"><span className="ci"><Icon n="file-down" /></span>Fiche PDF</a>
      <button className="act" onClick={() => { navigator.clipboard?.writeText(location.href); toast('Lien du passeport copié', 'link'); }}><span className="ci"><Icon n="link" /></span>Copier le lien</button>
      <button className="act" onClick={() => toast(`${p.name} ajouté au projet « Bureaux Les Arceaux »`, 'folder-plus')}><span className="ci"><Icon n="folder-plus" /></span>Ajouter à un projet</button>
      <a className="act" href={`mailto:contact@example.org?subject=${encodeURIComponent(p.name)}`}><span className="ci"><Icon n="mail" /></span>Contacter</a>
    </div>
  );
}

export function Footer() {
  const { p } = usePassport();
  return <footer className="foot">Passeport publié par {issuer(p.manufacturerId).name}. Chaque donnée est lue chez l&apos;entreprise qui l&apos;émet, au moment où vous la consultez.
    <div className="links"><Link className="link" href={`/p/${p.gtin}/preuves`}>Toutes les preuves</Link><Link className="link" href={`/p/${p.gtin}/historique`}>Historique des versions</Link></div></footer>;
}

export function SkeletonPassport() {
  return <div className="skel" aria-busy="true" aria-label="Chargement du passeport">
    <div className="hero"><Sk h={172} r={18} /><Sk w="78%" h={26} m="16px 0 0" /><Sk w="56%" h={16} m="10px 0 0" /><Sk w="64%" h={12} m="10px 0 0" /></div>
    <div className="band"><Sk h={58} m="16px 0 0" r={14} /><Sk h={176} m="12px 0 0" r={16} /><Sk w="30%" h={16} m="24px 0 10px" /><Sk h={56} /><Sk h={56} m="1px 0 0" /><Sk h={56} m="1px 0 0" /></div>
  </div>;
}
