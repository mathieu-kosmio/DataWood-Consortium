'use client';
/* Lots et QR codes (spec § 7.5) : chaque étiquette pointe vers le passeport vivant, au format GS1 Digital Link. */
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Icon } from '@/components/ui/Icon';
import { FLEET, HERO_GTIN } from '@/lib/data';
import { BASE } from '@/lib/asset';
import { useStore } from '@/lib/store';
import { zip } from '@/lib/zip';
import { AdminShell } from './Shell';

const TPL: [string, string, string][] = [['palette', 'package', 'Étiquette palette'], ['sac', 'shopping-bag', 'Sac'], ['marquage', 'stamp', 'Marquage produit'], ['bl', 'receipt-text', 'Bon de livraison']];

export function Lots() {
  const s = useStore();
  const [tpl, setTpl] = useState('palette');
  const [origin, setOrigin] = useState('https://datawood.org');
  useEffect(() => setOrigin(location.origin), []);
  const sel = s.admin.selectedLots, gen = s.admin.generatedLots;
  const lots = FLEET.lots;
  const cur = sel[0] ?? '27-0124';
  const url = `${origin}${BASE}/01/${HERO_GTIN}/10/${cur}/`;
  const count = lots.filter(l => sel.includes(l.lot)).reduce((a, l) => a + l.qty, 0);
  const todo = lots.filter(l => !l.printed && !gen.includes(l.lot));
  const allSel = todo.length > 0 && todo.every(l => sel.includes(l.lot));
  const generate = () => {
    const files = sel.map(l => ({ name: `etiquettes-${l}.txt`, text: `DOCUMENT DE DÉMONSTRATION\nLot ${l} · Panneau CLT 5 plis 140 mm\nGabarit : ${TPL.find(t => t[0] === tpl)![2]}\nQR : ${origin}${BASE}/01/${HERO_GTIN}/10/${l}/\n` }));
    const blob = zip(files);
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `etiquettes-${sel.join('-')}.zip`; a.click(); URL.revokeObjectURL(a.href);
    s.toast(`${count} étiquettes envoyées à l'imprimerie · ZIP téléchargé`, 'printer');
    s.generateLots();
  };
  return (
    <AdminShell cur="lots" crumb="Lots et QR codes">
      <div className="pg-h"><div><h1>Lots et QR codes</h1><div className="d">Chaque étiquette pointe vers le passeport vivant du produit, au format GS1 Digital Link</div></div>
        <button className="btn sm" onClick={() => s.toast('lots-octobre.csv : 3 lots reconnus, déjà présents', 'file-up')}><Icon n="file-up" />Importer un fichier CSV</button></div>
      <div className="g16" style={{ gridTemplateColumns: 'minmax(0,1fr) 380px', marginTop: 16, alignItems: 'start' }}>
        <section className="panel"><div className="toolbar"><span className="search"><Icon n="search" />Lot, produit</span><div className="segs"><button aria-pressed="true">Tous<span className="c">{lots.length}</span></button><button aria-pressed="false">À étiqueter<span className="c">{todo.length}</span></button></div><span style={{ flex: 1 }} />
          <span style={{ fontSize: 12.5, color: 'var(--s600)' }}><b style={{ color: 'var(--s900)' }}>{sel.length} lot{sel.length > 1 ? 's' : ''}</b> sélectionné{sel.length > 1 ? 's' : ''}</span></div>
          <table className="tb"><caption className="sr">Lots de fabrication du panneau CLT 5 plis 140 mm</caption>
            <thead><tr><th scope="col" style={{ width: 36 }}><button className={`cb${allSel ? ' on' : ''}`} aria-label="Tout sélectionner" onClick={() => todo.forEach(l => (allSel ? sel.includes(l.lot) : !sel.includes(l.lot)) && s.toggleLot(l.lot))}>{allSel && <Icon n="check" />}</button></th>
              <th scope="col">Lot</th><th scope="col" className="col-opt">Produit</th><th scope="col" className="r">Panneaux</th><th scope="col">Fabriqué le</th><th scope="col">Passeport</th><th scope="col">Étiquettes</th></tr></thead>
            <tbody>{lots.map(l => { const on = sel.includes(l.lot), done = l.printed || gen.includes(l.lot);
              return <tr key={l.lot} className={on ? 'sel' : ''} onClick={() => !done && s.toggleLot(l.lot)}>
                <td><button className={`cb${on ? ' on' : ''}`} id={`lot-${l.lot}`} disabled={done} aria-label={`Sélectionner le lot ${l.lot}`} aria-pressed={on} onClick={e => { e.stopPropagation(); s.toggleLot(l.lot); }}>{on && <Icon n="check" />}</button></td>
                <td className="mono" style={{ fontWeight: 500 }}>{l.lot}</td><td className="pn col-opt">Panneau CLT 5 plis 140 mm</td><td className="r">{l.qty}</td><td className="m">{l.date}</td><td><span className="tag">v2.1</span></td>
                <td>{done ? <span className="pp-ok"><Icon n="circle-check" />{gen.includes(l.lot) ? 'Envoyées' : 'Imprimées'}</span> : <span className="pp-no"><Icon n="circle-dashed" />À générer</span>}</td></tr>; })}</tbody></table></section>
        <section className="panel" style={{ padding: 16 }}><h2 style={{ fontSize: 14.5, fontWeight: 600 }}>Aperçu de l&apos;étiquette</h2><div className="mut" style={{ fontSize: 12.5, marginTop: 2 }}>Lot {cur} · 1 étiquette par panneau</div>
          <div className="tpl" role="group" aria-label="Gabarit" style={{ marginTop: 12 }}>{TPL.map(([k, i, l]) => <button key={k} aria-pressed={tpl === k} onClick={() => setTpl(k)}><Icon n={i} />{l}</button>)}</div>
          <div className="lbl-prev"><div className="q"><QRCodeSVG value={url} level="Q" style={{ width: '100%', height: '100%' }} /></div><div><div className="pn">Panneau CLT 5 plis 140 mm</div>
            <div className="kv">(01) {HERO_GTIN}<br />(10) {cur}<br />3,50 × 12,00 m · 5,88 m³</div><div className="cta"><Icon n="scan-line" className="ic-s" />Scannez : passeport produit</div>
            <div className="mk"><span className="logo">D</span>Lamellé-Collé du Val · DataWood-X</div></div></div>
          <a className="dl" href={url} target="_blank" rel="noopener" style={{ display: 'block' }}>{url}</a>
          <p className="mut" style={{ fontSize: 12, marginTop: 8, lineHeight: 1.5 }}>Ce lien ouvre vraiment le passeport du lot dans cette maquette. Il restera valide si le passeport change de version.</p>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
            <div style={{ fontSize: 12.5, color: 'var(--s600)', marginBottom: 10 }}>{sel.length ? <><b style={{ color: 'var(--s900)', fontSize: 14 }}>{count}</b> étiquettes pour {sel.length} lot{sel.length > 1 ? 's' : ''} · PDF prêt à imprimer et fichier ZIP</> : 'Cochez au moins un lot à étiqueter.'}</div>
            <button className="btn p w" id="a-generer" disabled={!sel.length} onClick={generate}><Icon n="printer" />Générer et envoyer à l&apos;imprimerie</button></div></section>
      </div>
    </AdminShell>
  );
}
