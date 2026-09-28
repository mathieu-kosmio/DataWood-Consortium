'use client';
/* Sankey matières → composants → bâtiment (spec § 7.4). Couleur par famille, petits composants regroupés,
   survol = masse et part, clic sur un composant = son passeport. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { sankey, sankeyJustify, sankeyLinkHorizontal, type SankeyLink, type SankeyNode } from 'd3-sankey';
import { Icon } from '@/components/ui/Icon';
import { MATERIALS } from '@/lib/data';
import { num } from '@/lib/format';
import type { Building, BuildingComponent, MaterialFamily } from '@/lib/types';

type N = { id: string; name: string; kind: 'mat' | 'comp' | 'bld'; fam?: MaterialFamily; comp?: BuildingComponent };
type L = { source: number; target: number; value: number; fam?: MaterialFamily };
type SN = SankeyNode<N, L>;
type SL = SankeyLink<N, L>;

export function MaterialSankey({ b, comps, onOpen, focus }: { b: Building; comps: BuildingComponent[]; onOpen: (c: BuildingComponent) => void; focus?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(1000);
  const [hover, setHover] = useState<{ x: number; y: number; html: React.ReactNode } | null>(null);
  const [sel, setSel] = useState<string | undefined>(focus);
  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(520, Math.round(e.contentRect.width))));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  const total = comps.reduce((s, c) => s + c.massTonnes, 0);
  const H = 400;
  const g = useMemo(() => {
    const small = total * 0.01;
    const groupName = (c: BuildingComponent) => (c.massTonnes < small ? `${comps.filter(x => x.massTonnes < small).length} autres composants` : c.productName);
    const nodes: N[] = [], idx: Record<string, number> = {};
    const node = (id: string, n: Omit<N, 'id'>) => { if (!(id in idx)) { idx[id] = nodes.length; nodes.push({ id, ...n }); } return idx[id]; };
    const fams = (Object.keys(MATERIALS) as MaterialFamily[]).map(f => ({ f, t: comps.reduce((s, c) => s + c.materials.filter(m => m.family === f).reduce((a, m) => a + m.tonnes, 0), 0) })).filter(x => x.t > 0).sort((a, c) => c.t - a.t);
    fams.forEach(x => node('m:' + x.f, { name: MATERIALS[x.f].label, kind: 'mat', fam: x.f }));
    const links: L[] = [];
    comps.forEach(c => c.materials.forEach(m => {
      const s = idx['m:' + m.family], name = groupName(c), t = node('c:' + name, { name, kind: 'comp', comp: c.massTonnes < small ? undefined : c });
      const ex = links.find(l => l.source === s && l.target === t);
      if (ex) ex.value += m.tonnes; else links.push({ source: s, target: t, value: m.tonnes, fam: m.family });
    }));
    const bld = node('b', { name: b.name, kind: 'bld' });
    nodes.filter(n => n.kind === 'comp').forEach(n => links.push({ source: idx[n.id], target: bld, value: links.filter(l => l.target === idx[n.id]).reduce((s, l) => s + l.value, 0) }));
    return sankey<N, L>().nodeWidth(10).nodePadding(9).nodeAlign(sankeyJustify).extent([[150, 6], [W - 170, H - 6]])({ nodes: nodes.map(d => ({ ...d })), links: links.map(d => ({ ...d })) });
  }, [comps, total, b.name, W]);

  const col = (n: SN) => (n.kind === 'mat' ? MATERIALS[n.fam!].hex : n.kind === 'bld' ? '#1f2a37' : '#8b95a3');
  const hit = (l: SL) => !!sel && ((l.target as SN).name === sel || (l.source as SN).name === sel);
  const tipNode = (n: SN, e: React.MouseEvent) => {
    const r = box.current!.getBoundingClientRect();
    setHover({ x: e.clientX - r.left + 14, y: e.clientY - r.top - 10, html: <><div className="t">{n.name}</div><div className="r"><span>Masse</span><b>{num(Math.round(n.value ?? 0), { dec: 0 })} t</b></div><div className="r"><span>Part du bâtiment</span><b>{num(((n.value ?? 0) / total) * 100, { dec: 1 })} %</b></div>
      {n.comp?.gtin ? <div className="r"><span>Passeport</span><b>Disponible · cliquez</b></div> : n.kind === 'comp' ? <div className="r"><span>Passeport</span><b>Manquant</b></div> : null}</> });
  };
  const tipLink = (l: SL, e: React.MouseEvent) => {
    const r = box.current!.getBoundingClientRect(), s = l.source as SN, t = l.target as SN;
    setHover({ x: e.clientX - r.left + 14, y: e.clientY - r.top - 10, html: <><div className="t">{s.name} → {t.name}</div><div className="r"><span>Flux</span><b>{num(l.value, { sig: 3 })} t</b></div><div className="r"><span>Part du bâtiment</span><b>{num((l.value / total) * 100, { dec: 1 })} %</b></div></> });
  };
  const click = (n: SN) => { if (n.comp) { setSel(n.name); onOpen(n.comp); } };

  return (
    <div className={`sankey${sel ? ' focus' : ''}`} ref={box} onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Diagramme des flux de matière vers les composants, puis vers le bâtiment">
        <g>{(g.links as SL[]).map((l, k) => <path key={k} className={`lnk${hit(l) ? ' on' : ''}`} d={sankeyLinkHorizontal()(l) ?? ''} stroke={l.fam ? MATERIALS[l.fam].hex : '#8b95a3'} strokeWidth={Math.max(1, l.width ?? 1)}
          onMouseMove={e => tipLink(l, e)} onClick={() => click(l.target as SN)} style={{ cursor: (l.target as SN).comp ? 'pointer' : 'default' }} />)}</g>
        <g>{(g.nodes as SN[]).map(n => {
          const id = n.comp?.gtin === '03760000000011' ? 'sankey-clt' : undefined;
          return <g key={n.id} className="node" id={id} onMouseMove={e => tipNode(n, e)} onClick={() => click(n)} style={{ cursor: n.comp ? 'pointer' : 'default' }}
            role={n.comp ? 'button' : undefined} tabIndex={n.comp ? 0 : undefined} aria-label={n.comp ? `${n.name}, ${Math.round(n.value ?? 0)} tonnes, ouvrir le passeport` : undefined}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), click(n))}>
            <rect x={n.x0} y={n.y0} width={(n.x1 ?? 0) - (n.x0 ?? 0)} height={Math.max(1, (n.y1 ?? 0) - (n.y0 ?? 0))} rx={2} fill={col(n)} />
            {n.comp && <rect x={(n.x0 ?? 0) - 4} y={(n.y0 ?? 0) - 3} width={((n.x1 ?? 0) - (n.x0 ?? 0)) + 190} height={Math.max(14, (n.y1 ?? 0) - (n.y0 ?? 0)) + 6} fill="transparent" />}
            <text className="lab" x={n.kind === 'mat' ? (n.x0 ?? 0) - 8 : (n.x1 ?? 0) + 8} y={((n.y0 ?? 0) + (n.y1 ?? 0)) / 2} dy="0.35em" textAnchor={n.kind === 'mat' ? 'end' : 'start'}>
              <tspan>{n.name}</tspan><tspan className="q">{'  ' + num(Math.round(n.value ?? 0), { dec: 0 })} t</tspan>{n.comp?.gtin ? <tspan dx={6} style={{ fill: "var(--em7)" }}>●</tspan> : null}</text>
          </g>;
        })}</g>
      </svg>
      {hover && <div className="tip" style={{ left: Math.min(hover.x, W - 240), top: hover.y, pointerEvents: "none" }} role="tooltip">{hover.html}</div>}
      <p className="mut" style={{ fontSize: 12, margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}><Icon n="info" className="ic-s" /><span style={{ color: 'var(--em7)' }}>●</span> passeport disponible. Cliquez un composant pour l&apos;ouvrir sans quitter le carnet.</p>
    </div>
  );
}
