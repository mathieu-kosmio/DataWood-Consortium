'use client';
/* Accès aux données (spec § 7.5) : niveau de diffusion, puis ce que lit chaque profil. Contrats d'usage en 3 étapes. */
import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Sheet, SheetClose } from '@/components/ui/kit';
import { POLICIES } from '@/lib/data';
import { useStore } from '@/lib/store';
import { AdminShell } from './Shell';

const A: Record<string, [string, string]> = { y: ['eye', 'Lisible'], c: ['file-signature', 'Sur contrat'], n: ['eye-off', 'Masqué'] };
const NEXT: Record<string, string> = { y: 'c', c: 'n', n: 'y' };
const DIFF: Record<string, string> = { public: 'Public', restricted: 'Restreint', hidden: 'Masqué' };
const PARTIES = ['BET Structures Sud', 'Contrôle Sud Structures', 'Écobâti', 'Horizon Bois Construction', 'Foncière des Arceaux'];
const DUR = ['3 mois', '12 mois', 'Durée du chantier', 'Sans échéance'];

export function Access() {
  const s = useStore();
  const [tip, setTip] = useState<string | null>(null);
  const [form, setForm] = useState<null | { step: number; party: string; data: string[]; dur: string }>(null);
  const access = (rowId: string, j: number, base: string) => s.admin.access[`${rowId}:${j}`] ?? base;
  const items = POLICIES.rows.flatMap(g => g.items);
  const contracts = [
    ...s.dacs.map(d => ({ id: d.ref, initials: d.party.split(' ').filter(w => w.length > 2).map(w => w[0]).join('').slice(0, 2).toUpperCase(), party: d.party, scope: `${d.assetLabel} · ${d.usage}`, duration: `jusqu'au ${d.until}`, kind: `Négocié · parcours « ${s.admin.workflows.find(w => w.id === d.workflow)?.name ?? d.workflow} » · ${d.ref}` })),
    ...POLICIES.contracts.map(c => ({ ...c, kind: 'Contrat direct' })), ...s.admin.contracts.map(c => ({ ...c, kind: 'Contrat direct' })),
  ];
  const create = () => {
    if (!form) return;
    s.addContract({ id: 'n' + Date.now(), initials: form.party.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(), party: form.party, scope: form.data.map(d => items.find(i => i.id === d)!.label).join(', '), duration: form.dur.toLowerCase() });
    s.toast(`Contrat d'usage signé avec ${form.party}`, 'file-signature'); setForm(null);
  };
  return (
    <AdminShell cur="acces" crumb="Accès aux données">
      <div className="pg-h"><div><h1>Accès aux données</h1><div className="d">Qui lit quoi dans vos passeports. Chaque lecture est journalisée ; vous pouvez retirer un accès à tout moment.</div></div>
        <div style={{ display: 'flex', gap: 8 }}><button className="btn sm" onClick={() => s.toast('Journal des accès : 1 284 lectures ce mois-ci', 'history')}><Icon n="history" />Journal des accès</button>
          <button className="btn p sm" onClick={() => setForm({ step: 1, party: PARTIES[0], data: ['lca'], dur: DUR[1] })}><Icon n="file-signature" />Nouveau contrat d&apos;usage</button></div></div>
      <p className="mut" style={{ fontSize: 13, marginTop: 14 }}>Touchez une cellule pour changer ce que lit un profil. « Sur contrat » : l&apos;accès passe par un parcours de négociation, défini dans le Studio. Les données exigées publiques par le règlement sont verrouillées.</p>
      <section className="panel" style={{ marginTop: 10, overflow: 'visible', position: 'relative' }}>
        <table className="mx"><caption className="sr">Matrice des accès par donnée et par profil</caption>
          <thead><tr><th scope="col" style={{ width: '30%' }}>Donnée</th><th scope="col">Diffusion</th>{POLICIES.profiles.map(([k, i, l]) => <th scope="col" key={k} className="pf"><Icon n={i} />{l}</th>)}</tr></thead>
          <tbody>{POLICIES.rows.map(g => [<tr key={g.group} className="grp"><td colSpan={8}>{g.group}</td></tr>, ...g.items.map(r => <tr key={r.id}>
            <td className="dp">{r.label}{r.regulatory && <Icon n="lock" />}</td>
            <td style={{ position: 'relative' }} onMouseEnter={() => r.regulatory && setTip(r.id)} onMouseLeave={() => setTip(null)}>
              {r.regulatory ? <span className="sel3 locked" tabIndex={0} onFocus={() => setTip(r.id)} onBlur={() => setTip(null)} aria-label={`${DIFF[r.diffusion]}, exigence réglementaire`}>{DIFF[r.diffusion]}<Icon n="lock" /></span>
                : <select className="sel3" defaultValue={r.diffusion} aria-label={`Diffusion de ${r.label}`} onChange={e => s.toast(`${r.label} : diffusion « ${DIFF[e.target.value]} »`, 'check')}>{Object.entries(DIFF).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>}
              {tip === r.id && <span className="tip-lock" style={{ left: 0, top: -34 }} role="tooltip"><Icon n="lock" className="ic-s" /> Exigence réglementaire : cette donnée reste publique</span>}</td>
            {[...r.cells].map((c, j) => { const v = access(r.id, j, c);
              return <td key={j} className="c">{r.regulatory ? <span className={`acc ${v}`}><Icon n={A[v][0]} />{A[v][1]}</span>
                : <button className={`acc ${v}`} onClick={() => { s.setAccess(`${r.id}:${j}`, NEXT[v]); }} aria-label={`${r.label}, ${POLICIES.profiles[j][2]} : ${A[v][1]}. Changer`}><Icon n={A[v][0]} />{A[v][1]}</button>}</td>; })}
          </tr>)])}</tbody></table></section>
      <section className="panel" style={{ marginTop: 16 }}><div className="panel-h"><div><h2>Contrats d&apos;accès en cours</h2><div className="d">Négociés par les parcours du Studio, ou signés en direct. Chacun dit qui lit quoi, pour quel usage, jusqu&apos;à quand.</div></div><Link className="a" href="/admin/studio/rpc">Parcours de négociation</Link></div>
        {contracts.map(c => <div className="ctr" key={c.id}><span className="av sm">{c.initials}</span><div className="grow"><div className="t">{c.party}</div><div className="d">{c.scope} · {c.duration}</div><div className="d" style={{ marginTop: 2 }}><Icon n={c.kind.startsWith('Négocié') ? 'file-signature' : 'pencil-line'} className="ic-s" /> {c.kind}</div></div><span className="chip em"><Icon n="circle-check" />Actif</span>
          <button className="btn g sm" onClick={() => s.toast('Modification du contrat : démonstration', 'pencil-line')}>Modifier</button></div>)}</section>

      <Sheet open={!!form} onClose={() => setForm(null)} label="Nouveau contrat d'usage">
        {form && <><div className="sheet-h" style={{ paddingTop: 16 }}><div><div className="eyebrow">Nouveau contrat d&apos;usage · étape {form.step} sur 3</div><h3 style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>{['Avec qui ?', 'Quelles données ?', 'Pour combien de temps ?'][form.step - 1]}</h3></div><SheetClose /></div>
          <div className="sheet-b">
            <div className="rc-prog" style={{ marginBottom: 14 }}>{[1, 2, 3].map(k => <span key={k} className={k <= form.step ? 'done' : ''} style={{ background: k <= form.step ? 'var(--em7)' : 'var(--s200)' }} />)}</div>
            {form.step === 1 && <div role="radiogroup" aria-label="Partenaire">{PARTIES.map(p => <button key={p} role="radio" aria-checked={form.party === p} className={`src-opt${form.party === p ? ' on' : ''}`} style={{ width: '100%', textAlign: 'left' }} onClick={() => setForm({ ...form, party: p })}><span className="rd" /><div><div className="t">{p}</div></div></button>)}</div>}
            {form.step === 2 && <div>{items.filter(i => !i.regulatory).map(i => { const on = form.data.includes(i.id);
              return <button key={i.id} role="checkbox" aria-checked={on} className={`src-opt${on ? ' on' : ''}`} style={{ width: '100%', textAlign: 'left' }} onClick={() => setForm({ ...form, data: on ? form.data.filter(d => d !== i.id) : [...form.data, i.id] })}><span className="rd" style={{ borderRadius: 4 }} /><div><div className="t">{i.label}</div></div></button>; })}</div>}
            {form.step === 3 && <div role="radiogroup" aria-label="Durée">{DUR.map(d => <button key={d} role="radio" aria-checked={form.dur === d} className={`src-opt${form.dur === d ? ' on' : ''}`} style={{ width: '100%', textAlign: 'left' }} onClick={() => setForm({ ...form, dur: d })}><span className="rd" /><div><div className="t">{d}</div></div></button>)}
              <p className="priv" style={{ marginTop: 10 }}><Icon n="shield-check" />Le contrat est signé par les deux parties et chaque lecture qu&apos;il permet est journalisée.</p></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}><button className="btn g" disabled={form.step === 1} onClick={() => setForm({ ...form, step: form.step - 1 })}><Icon n="arrow-left" />Précédent</button>
              {form.step < 3 ? <button className="btn p" disabled={form.step === 2 && !form.data.length} onClick={() => setForm({ ...form, step: form.step + 1 })}>Suivant<Icon n="arrow-right" /></button>
                : <button className="btn p" onClick={create}><Icon n="file-signature" />Signer le contrat</button>}</div>
          </div></>}
      </Sheet>
    </AdminShell>
  );
}
