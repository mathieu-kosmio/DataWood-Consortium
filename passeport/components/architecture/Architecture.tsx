'use client';
/* Comment ça marche (spec § 7.6), architecture étudiée avec IMT Transfert : Simpl-Open (agents par participant,
   autorité de gouvernance, catalogue fédéré) étendu d'un service de négociation de contrats.
   Les requêtes s'animent au rythme des latences simulées ; un scan fait dans un autre onglet rejoue l'animation. */
import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Icon } from '@/components/ui/Icon';
import { AppBar } from '@/components/building/BuildingPage';
import { HERO_GTIN, issuer } from '@/lib/data';
import { useStore } from '@/lib/store';

const NODES: [string, string][] = [['st3m', 'Fournisseur'], ['lcv', 'Fabricant'], ['iqc', 'Certificateur'], ['eco', 'Éco-organisme'], ['fda', 'Carnet du bâtiment']];
const W = 800, H = 520;
const ny = (i: number) => (i < 3 ? 52 + i * 84 : 318 + (i - 3) * 84);

export function Architecture() {
  const nodes = useStore(s => s.nodes);
  const lastScan = useStore(s => s.lastScan);
  const dacs = useStore(s => s.dacs);
  const setNode = useStore(s => s.setNode);
  const [run, setRun] = useState(1);
  const [shown, setShown] = useState(99);
  const off = !nodes.iqc.online;

  const log = useMemo(() => {
    const L: { t: number; who: string; msg: string; ok?: boolean; ko?: boolean }[] = [
      { t: 0, who: 'Scan du QR', msg: `01/${HERO_GTIN}` }, { t: 38, who: 'Résolveur GS1', msg: 'passeport v2.1 de Lamellé-Collé du Val', ok: true },
      { t: 50, who: 'Cache public', msg: '11 données publiques affichées', ok: true },
      { t: 51, who: 'Autorité de gouvernance', msg: 'participants reconnus, 5 agents trouvés au catalogue', ok: true },
      { t: 60, who: 'Service de négociation', msg: dacs.length ? `${dacs.length} contrat${dacs.length > 1 ? 's' : ''} d'accès en vigueur (${dacs.map(d => d.ref).join(', ')})` : 'aucun contrat requis pour ces données', ok: true },
    ];
    const msgs: Record<string, string> = { st3m: 'origine, PEFC signés', lcv: 'performances, carbone signés', iqc: '5 certificats signés', eco: 'filière REP PMCB', fda: 'pose, entretien' };
    NODES.forEach(([k]) => {
      const n = nodes[k];
      L.push(n.online ? { t: 61 + n.latency, who: `Agent Simpl de ${issuer(k).name}`, msg: msgs[k], ok: true } : { t: 61 + 2000, who: `Agent Simpl de ${issuer(k).name}`, msg: 'délai dépassé, dernière valeur connue affichée', ko: true });
    });
    return L.sort((a, b) => a.t - b.t);
  }, [nodes, dacs]);

  useEffect(() => {
    setShown(0);
    const ts = log.map((l, i) => setTimeout(() => setShown(i + 1), l.t + i * 60));
    return () => ts.forEach(clearTimeout);
  }, [run, log]);
  useEffect(() => { if (lastScan) setRun(r => r + 1); }, [lastScan]);

  const box = (x: number, y: number, w: number, h: number, t1: string, t2: string, cls = '') => <g className={cls}><rect className="box" x={x} y={y} width={w} height={h} rx={12} /><text className="t1" x={x + 14} y={y + 24}>{t1}</text><text className="t2" x={x + 14} y={y + 42}>{t2}</text></g>;
  const nOff = NODES.filter(([k]) => !nodes[k].online).length;
  const short = (s: string) => (s.length > 21 ? s.slice(0, 20) + '…' : s);

  return <div className="bureau">
    <AppBar sub="Comment ça marche" orgId="lcv" role="Démonstration" crumbs={<><Icon n="chevron-right" /><b>Sous le capot d&apos;un scan</b></>} />
    <main className="wrap">
      <section className="hero-a"><div><div className="eyebrow">Sous le capot d&apos;un scan</div><h1>Un scan, cinq sources, aucune base centrale</h1>
        <p>Le QR code ne contient pas de données : il contient une adresse. Chaque entreprise a son agent, qui garde ses données et applique ses règles. Ce que vous avez le droit de lire, chacune vous le transmet elle-même, avec sa signature ; ce qui est restreint passe d&apos;abord par un contrat.</p></div>
        <div style={{ display: 'flex', gap: 8 }}><button className="btn" onClick={() => { setNode('iqc', off); setRun(r => r + 1); }}><Icon n={off ? 'plug-zap' : 'unplug'} />{off ? 'Rétablir le certificateur' : 'Couper le certificateur'}</button>
          <button className="btn p" onClick={() => setRun(r => r + 1)}><Icon n="scan-line" />Rejouer un scan</button></div></section>
      <section className="panel stage">
        <div className="dia">
          <svg key={run} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Parcours d'un scan : téléphone, résolveur GS1, application passeport, puis cinq agents Simpl ; autorité de gouvernance et service de négociation communs au réseau">
            <defs><filter id="sh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#1f2a37" floodOpacity=".08" /></filter></defs>
            <path className="wire" d="M104,247 L128,247" /><path className="wire" d="M252,247 L270,247" /><path className="wire pub" d="M345,212 L345,160" />
            <path className="wire pub" d="M345,282 L345,330" /><path className="wire gov" d="M420,452 C480,452 500,440 548,420" /><path className="wire gov" d="M420,452 C490,452 500,200 548,170" />
            {NODES.map(([k], i) => { const y = ny(i) + 29; return <path key={k} id={`w${i}`} className={`wire${nodes[k].online ? '' : ' down'}`} d={`M420,247 C500,247 480,${y} 560,${y}`} />; })}
            <g filter="url(#sh)">
              <g><rect className="box" x={20} y={150} width={84} height={180} rx={16} /><rect x={28} y={166} width={68} height={148} rx={8} fill="var(--s50)" />
                <foreignObject x={38} y={196} width={48} height={48}><QRCodeSVG value={`https://datawood.org/passeport/01/${HERO_GTIN}`} size={48} level="L" /></foreignObject>
                <text className="t2" x={62} y={272} textAnchor="middle">Scan</text><text className="t3" x={62} y={290} textAnchor="middle">t = 0</text></g>
              {box(128, 219, 124, 56, 'Résolveur', 'GS1 Digital Link')}
              {box(270, 104, 150, 56, 'Cache public', 'Données publiques')}
              <g><rect className="box app" x={270} y={212} width={150} height={70} rx={12} /><text className="t1" x={284} y={236}>Application</text><text className="t1" x={284} y={253}>passeport</text><text className="t2" x={284} y={271}>fournisseur d&apos;application</text></g>
              {box(270, 330, 150, 56, 'Négociation', 'Service commun · contrats', 'shared')}
              <g className="shared"><rect className="box" x={20} y={420} width={400} height={64} rx={12} /><text className="t1" x={34} y={444}>Autorité de gouvernance du réseau</text><text className="t2" x={34} y={463}>Adhésions et attestations · catalogue fédéré · vocabulaire commun</text></g>
              <rect className="grp" x={548} y={36} width={244} height={262} rx={16} /><text className="gl" x={562} y={30}>DataWood-X · agents Simpl</text>
              <rect className="grp" x={548} y={302} width={244} height={178} rx={16} /><text className="gl" x={562} y={500}>DataBuilding-X · agents Simpl</text>
              {NODES.map(([k, r], i) => { const o = !nodes[k].online;
                return <g key={k} className={o ? 'off' : ''}><rect className="box" x={560} y={ny(i)} width={220} height={58} rx={12} />
                  <circle className={o ? 'ko-dot' : 'ok-dot'} cx={576} cy={ny(i) + 20} r={4} /><text className="t1" x={588} y={ny(i) + 24}>{r}</text>
                  <text className="t2" x={576} y={ny(i) + 43}>{short(issuer(k).name)}</text>
                  <text className="t3" x={768} y={ny(i) + 24} textAnchor="end">{o ? 'ne répond pas' : `${nodes[k].latency} ms`}</text>
                  <text className="t3 agent" x={768} y={ny(i) + 43} textAnchor="end">agent</text></g>; })}
            </g>
            {NODES.map(([k], i) => { const n = nodes[k], lat = n.latency / 1000;
              return n.online ? <g key={k}><circle className="pkt" r={4}><animateMotion dur={`${(0.5 + lat).toFixed(2)}s`} begin={`${(i * 0.12).toFixed(2)}s`} repeatCount="indefinite"><mpath href={`#w${i}`} /></animateMotion></circle>
                <circle className="pkt back" r={3.5}><animateMotion dur={`${(0.5 + lat).toFixed(2)}s`} begin={`${(i * 0.12 + 0.25 + lat / 2).toFixed(2)}s`} repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear"><mpath href={`#w${i}`} /></animateMotion></circle></g>
                : <circle key={k} className="ko-dot" r={5}><animateMotion dur="1.2s" repeatCount="indefinite" keyPoints="0;0.55;0.55" keyTimes="0;0.6;1" calcMode="linear"><mpath href={`#w${i}`} /></animateMotion></circle>; })}
          </svg>
        </div>
        <aside className="log" aria-label="Journal du scan" aria-live="polite"><h2><span>Journal du scan</span><span className="tag">{nOff ? `${nOff} source${nOff > 1 ? 's' : ''} en panne` : 'Toutes les sources répondent'}</span></h2>
          <ol>{log.slice(0, shown).map((l, i) => <li key={run + ':' + i} className={`${l.ok ? 'ok' : ''}${l.ko ? ' ko' : ''}`}><span className="tm">{i === 0 ? '10:42:03' : `+${l.t} ms`}</span><span><b>{l.who}</b> : {l.msg}</span></li>)}</ol>
          <div className="sum">{nOff ? <><b>La page s&apos;est affichée en 50 ms</b> avec les données publiques ; {5 - nOff} agents sur 5 ont complété. Les autres montrent leur dernière valeur connue, datée.</>
            : <><b>Page utile en 50 ms</b>, complète en moins d&apos;une seconde. Aucune de ces données n&apos;a été copiée dans une base centrale.</>}</div></aside>
      </section>
      <section className="panel steps4 steps5">{[['Une adresse, pas des données', 'Le QR suit le format GS1 Digital Link. Imprimé une fois, il reste juste quand le passeport change.'],
        ['Un agent par participant', 'Chaque entreprise a son agent Simpl, le socle logiciel européen des data spaces (connecteur EDC, cadre de confiance Gaia-X). La donnée ne quitte son serveur qu’à la demande.'],
        ['Des règles sur chaque élément', 'Qui le voit, qui y accède, pour quel usage. L’autorité de gouvernance tient les adhésions, le catalogue fédéré et le vocabulaire commun.'],
        ['Un contrat avant tout accès restreint', 'Le fournisseur fixe un parcours de négociation ; le demandeur le suit et obtient un contrat d’accès (DAC), signé des deux côtés et journalisé.'],
        ['Une panne reste locale', 'Si un agent ne répond pas, seul son bloc attend. Il montre sa dernière valeur connue, datée ; le reste du passeport est à jour.']]
        .map(([t, d], i) => <div key={t}><span className="nn">{i + 1}</span><h3>{t}</h3><p>{d}</p></div>)}</section>
      <div className="nope"><Icon n="database-zap" /><div><h3>Ce qui n&apos;existe pas : une base de données centrale</h3><p>Le réseau DataWood-X ne garde aucune copie des données. Son autorité de gouvernance tient l&apos;annuaire des participants et le catalogue ; le service de négociation délivre les contrats ; chaque agent trace les accès. DataBuilding-X suit les mêmes règles : un passeport bois peut citer une preuve de la filière bâtiment, et inversement.</p>
        <p style={{ marginTop: 8 }}>Architecture étudiée avec IMT Transfert (Data Space Lab) : Simpl-Open, le socle logiciel open source de la Commission européenne pour les data spaces, étendu d&apos;un service de négociation de contrats. Dans cette maquette, ces briques sont simulées dans le navigateur.</p></div></div>
    </main>
  </div>;
}
