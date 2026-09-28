'use client';
/* Studio (spec § 7.5, architecture IMT / Simpl) : le passeport est un produit de données fait d'éléments.
   Chaque élément porte trois règles (qui le voit, qui y accède, pour quel usage). Un élément « sous contrat »
   doit être rattaché à un parcours de négociation, sinon la version ne se publie pas. */
import { useState } from 'react';
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, pointerWithin, rectIntersection, useDraggable, useDroppable, useSensor, useSensors, type CollisionDetection, type DragEndEvent, type DragOverEvent, type DragStartEvent } from '@dnd-kit/core';
import { Icon } from '@/components/ui/Icon';
import { Sheet, SheetClose } from '@/components/ui/kit';
import { HERO_GTIN, NEGOTIATION, TEMPLATES } from '@/lib/data';
import { asset } from '@/lib/asset';
import { useStore } from '@/lib/store';
import type { NegotiationWorkflow, StepType } from '@/lib/types';
import { AdminShell } from './Shell';

type Cfg = { source: string; sourceLabel: string; regulatory: boolean; discovery: string; access: string; usage: string; workflow: string | null };
const CFG = TEMPLATES.blocks as unknown as Record<string, Cfg>;
const META: Record<string, [string, string]> = Object.fromEntries(TEMPLATES.catalog.flatMap(g => g.blocks.map(b => [b[0], [b[1], b[2]] as [string, string]])));
const DISC: Record<string, [string, string]> = { public: ['globe', 'Tout public'], members: ['users', 'Membres du réseau'], authority: ['landmark', 'Autorités'] };
const ACC: Record<string, [string, string]> = { open: ['lock-open', 'Libre'], contract: ['file-signature', 'Sous contrat'], closed: ['lock', 'Fermé'] };
const USE: Record<string, string> = { consultation: 'Consultation', reuse: 'Réutilisation', project: 'Projet désigné' };
const SOURCES: [string, string, string][] = [['manual', 'Saisie manuelle', 'Vous tapez les valeurs'], ['erp', 'ERP, PIM ou CAO', 'Synchronisé depuis vos logiciels'], ['fdes', 'Import FDES XML', 'Indicateurs lus automatiquement'], ['supplier', 'Connecteur fournisseur', 'La donnée reste chez lui']];
const DURATIONS = ['3 mois', '12 mois', "Jusqu'à la réception de l'ouvrage", 'Durée du chantier de déconstruction'];

/** Le dépôt suit le pointeur ; à défaut (clavier), la plus grande intersection. */
const collide: CollisionDetection = args => { const p = pointerWithin(args); return p.length ? p : rectIntersection(args); };

function CatalogItem({ id, placed }: { id: string; placed: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: 'cat:' + id, disabled: placed });
  const placeBlock = useStore(s => s.placeBlock);
  const n = useStore(s => s.admin.placed.length);
  const req = TEMPLATES.requirements.some(r => r.blockId === id);
  return <div className={`blk${placed ? ' used' : req ? ' miss' : ''}`} id={`blk-${id}`} style={{ opacity: isDragging ? 0.4 : 1 }}>
    <span ref={setNodeRef} className="drag" {...listeners} {...attributes} aria-label={placed ? `${META[id][1]} : déjà dans le passeport` : `${META[id][1]} : glisser dans le passeport`}>
      <Icon n={META[id][0]} />{META[id][1]}</span>
    <span className="st">{placed ? <Icon n="check" /> : req ? <Icon n="circle-alert" /> : null}</span>
    {!placed && <button className="add" onClick={() => placeBlock(id, n)} aria-label={`Ajouter ${META[id][1]} à la fin du passeport`} title="Ajouter à la fin"><Icon n="plus" /></button>}
  </div>;
}

function Slot({ index, over, children }: { index: number; over: boolean; children?: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id: 'slot:' + index });
  return <div ref={setNodeRef}>{over && <div className="drop" aria-hidden="true" />}{children}</div>;
}

function Seg({ label, value, options, onChange, locked }: { label: string; value: string; options: [string, string, string][]; onChange: (v: string) => void; locked?: boolean }) {
  return <div className="rule"><div className="rule-l">{label}{locked && <Icon n="lock" className="ic-s" />}</div>
    <div className="vis3" role="group" aria-label={label}>{options.map(([v, i, l]) => <button key={v} aria-pressed={value === v} disabled={locked && value !== v} onClick={() => onChange(v)}><Icon n={i} />{l}</button>)}</div></div>;
}

export function Studio() {
  const s = useStore();
  const placed = s.admin.placed;
  const wfs = s.admin.workflows;
  const [tab, setTab] = useState<'elements' | 'nego'>('elements');
  const [sel, setSel] = useState('bim');
  const [wsel, setWsel] = useState('bim');
  const [src, setSrc] = useState<Record<string, string>>({});
  const [drag, setDrag] = useState<string | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(KeyboardSensor));

  const pol = (id: string): Cfg => { const p = { ...CFG[id], ...s.admin.policies[id] } as Cfg; if (p.workflow && !wfs.some(w => w.id === p.workflow)) p.workflow = null; return p; };
  const reqs = TEMPLATES.requirements;
  const missing = reqs.filter(r => !placed.includes(r.blockId));
  const contractEls = placed.filter(id => pol(id).access === 'contract');
  const orphans = contractEls.filter(id => !pol(id).workflow);
  const canPublish = !missing.length && !orphans.length;
  const cfg = pol(sel);
  const wf = wfs.find(w => w.id === wsel) ?? wfs[0];

  const goNego = () => { setTab('nego'); s.emit('studio:tab:nego'); };
  const publish = () => { if (canPublish) { setBlocked(false); s.publish(); } else setBlocked(true); };
  const onStart = (e: DragStartEvent) => setDrag(String(e.active.id).slice(4));
  const onOver = (e: DragOverEvent) => setOver(e.over ? +String(e.over.id).slice(5) : null);
  const onEnd = (e: DragEndEvent) => {
    const id = String(e.active.id).slice(4);
    if (e.over) { s.placeBlock(id, +String(e.over.id).slice(5)); setSel(id); s.toast(`Élément « ${META[id][1]} » ajouté`, 'check'); }
    setDrag(null); setOver(null);
  };
  const createProposal = () => { const p = NEGOTIATION.proposal; s.createWorkflow({ ...p, steps: [...p.steps], assets: [...p.assets] }); setWsel(p.id); setBlocked(false); s.toast(`Parcours « ${p.name} » créé et rattaché au plan de dépose`, 'file-signature'); };
  const newBlank = () => { const id = 'wf-' + (wfs.length + 1); s.createWorkflow({ id, name: 'Nouveau parcours', assets: [], usage: 'Consultation, sans rediffusion', duration: '12 mois', steps: [{ type: 'attestation', param: 'Attestation professionnelle' }] }); setWsel(id); };
  const upd = (patch: Partial<NegotiationWorkflow>) => s.updateWorkflow(wf.id, patch);
  const attach = (el: string, on: boolean) => {
    upd({ assets: on ? [...new Set([...wf.assets, el])] : wf.assets.filter(a => a !== el) });
    s.setPolicy(el, { workflow: on ? wf.id : null });
  };
  const chip = (id: string) => {
    const p = pol(id), w = wfs.find(x => x.id === p.workflow);
    if (p.access === 'contract') return w ? <span className="acc c"><Icon n="file-signature" />Sous contrat · {w.name}</span> : <span className="acc warn"><Icon n="triangle-alert" />Sous contrat · aucun parcours</span>;
    return p.access === 'closed' ? <span className="acc n"><Icon n="lock" />Fermé</span> : <span className="acc y"><Icon n="lock-open" />Libre</span>;
  };
  const dacsOf = s.dacs.filter(d => d.workflow === wf.id);

  return (
    <AdminShell cur="studio" crumb="Studio">
      <div className="pg-h"><div><h1>Studio · Panneau CLT 5 plis 140 mm</h1><div className="d">Produit de données « passeport », gabarit {TEMPLATES.template.name.toLowerCase()}, version de travail {TEMPLATES.template.version}</div></div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}><span className="mut" style={{ fontSize: 12.5 }}>Prévisualiser en tant que</span>
          <div className="segs" role="group" aria-label="Prévisualiser en tant que">{[['public', 'user', 'Particulier'], ['prescriber', 'drafting-compass', 'Prescripteur'], ['authority', 'landmark', 'Autorité']].map(([v, i, l]) =>
            <button key={v} aria-pressed={preview === v} onClick={() => setPreview(v)}><Icon n={i} className="ic-s" />{l}</button>)}</div>
          <button className="btn p sm" id="a-publier" disabled={s.admin.published} onClick={publish}><Icon n="send" />{s.admin.published ? 'Version 2.2 publiée' : 'Publier la version 2.2'}</button></div></div>

      {blocked && !s.admin.published && <div className="pub-block" role="alert"><Icon n="octagon-alert" /><div className="grow">
        <div className="t">Publication impossible pour l&apos;instant</div>
        {orphans.map(id => <div key={id}>« {META[id][1]} » est sous contrat, mais aucun parcours de négociation ne lui est rattaché. Un élément restreint ne se publie pas sans ses conditions.</div>)}
        {missing.map(r => <div key={r.id}>Exigence réglementaire manquante : {r.label.toLowerCase()}.</div>)}</div>
        {orphans.length > 0 && <button className="btn sm" onClick={goNego}>Définir sa négociation<Icon n="arrow-right" /></button>}</div>}

      <nav className="ptabs" aria-label="Sections du Studio" style={{ marginTop: 14 }}>
        <a href="#elements" id="tab-elements" aria-current={tab === 'elements' ? 'page' : undefined} onClick={e => { e.preventDefault(); setTab('elements'); }}><Icon n="layers" />Éléments du produit de données<span className="n">{placed.length}</span></a>
        <a href="#negociation" id="tab-nego" aria-current={tab === 'nego' ? 'page' : undefined} onClick={e => { e.preventDefault(); goNego(); }}><Icon n="file-signature" />Négociation<span className="n">{wfs.length}</span>{orphans.length > 0 && <span className="dot" style={{ background: 'var(--amber500)', marginLeft: 2 }} role="img" aria-label="Un élément attend son parcours" />}</a>
        <span className="sp" /><span className="mut" style={{ fontSize: 12.5 }}>{canPublish ? 'Prêt à publier' : `${missing.length + orphans.length} point${missing.length + orphans.length > 1 ? 's' : ''} avant publication`}</span></nav>

      {tab === 'elements' ? (
        <DndContext id="studio-dnd" sensors={sensors} collisionDetection={collide} onDragStart={onStart} onDragOver={onOver} onDragEnd={onEnd} onDragCancel={() => { setDrag(null); setOver(null); }}>
          <div className="studio" style={{ position: 'relative' }}>
            <section className="cat" aria-label="Catalogue d'éléments"><span className="search" style={{ minWidth: 0, width: '100%', height: 32 }}><Icon n="search" className="ic-s" />Filtrer les éléments</span>
              {TEMPLATES.catalog.map(g => <div key={g.group}><h3>{g.group}</h3>{g.blocks.map(b => <CatalogItem key={b[0]} id={b[0]} placed={placed.includes(b[0])} />)}</div>)}</section>
            <section className="canvas" aria-label="Produit de données en construction"><div className="canvas-h"><div><div className="t">Éléments du passeport · {placed.length}</div><div className="d">Glissez un élément du catalogue ; chacun porte ses règles d&apos;accès</div></div><span className="mut" style={{ fontSize: 12 }}>Enregistré</span></div>
              <div className="placed">{placed.map((id, i) => <Slot key={id} index={i} over={!!drag && over === i}>
                <button className={`pb${sel === id ? ' sel' : ''}`} style={{ width: '100%', textAlign: 'left' }} onClick={() => setSel(id)} aria-pressed={sel === id}>
                  <span className="grip"><Icon n="grip-vertical" /></span><span className="ico"><Icon n={META[id][0]} /></span>
                  <div className="grow"><div className="n">{META[id][1]}{CFG[id]?.regulatory ? <> <Icon n="lock" className="ic-s lock" /></> : null}</div><div className="s">{CFG[id]?.sourceLabel}</div></div>
                  <div className="vis"><span className="disc" title={DISC[pol(id).discovery][1]}><Icon n={DISC[pol(id).discovery][0]} /></span>{chip(id)}</div></button></Slot>)}
                <Slot index={placed.length} over={!!drag && over === placed.length}><div className="drop-end">Déposer ici</div></Slot>
              </div>
            </section>
            <section className="insp" aria-label="Règles de l'élément">
              <div className="blkname"><span className="av sm" style={{ background: 'var(--s50)' }}><Icon n={META[sel][0]} className="ic-s" /></span><div><div style={{ fontSize: 14, fontWeight: 600 }}>{META[sel][1]}</div><div className="mut" style={{ fontSize: 12 }}>{cfg.regulatory ? 'Élément exigé par le règlement' : 'Élément facultatif'}</div></div></div>
              <h3>Source de la donnée</h3>
              <div role="radiogroup" aria-label="Source de la donnée">{SOURCES.map(([k, t, d]) => { const cur = src[sel] ?? (cfg.source === 'import' ? 'erp' : cfg.source), on = cur === k;
                return <button key={k} role="radio" aria-checked={on} className={`src-opt${on ? ' on' : ''}`} style={{ width: '100%', textAlign: 'left' }} onClick={() => setSrc({ ...src, [sel]: k })}><span className="rd" /><div><div className="t">{t}</div><div className="d">{on && !src[sel] ? cfg.sourceLabel : d}</div></div></button>; })}</div>
              <h3>Règles de l&apos;élément</h3>
              <Seg label="Qui le voit" value={cfg.discovery} locked={cfg.regulatory} options={[['public', 'globe', 'Tout public'], ['members', 'users', 'Membres'], ['authority', 'landmark', 'Autorités']]} onChange={v => s.setPolicy(sel, { discovery: v })} />
              <Seg label="Qui y accède" value={cfg.access} locked={cfg.regulatory} options={Object.entries(ACC).map(([k, [i, l]]) => [k, i, l])} onChange={v => s.setPolicy(sel, { access: v })} />
              <Seg label="Pour quel usage" value={cfg.usage} options={[['consultation', 'eye', 'Consultation'], ['reuse', 'repeat', 'Réutilisation'], ['project', 'building-2', 'Projet']]} onChange={v => s.setPolicy(sel, { usage: v })} />
              <p className="mut" style={{ fontSize: 12, margin: '-2px 2px 8px' }}>Usage retenu : {USE[cfg.usage].toLowerCase()}{cfg.usage === 'project' ? ' (le contrat ne vaut que pour le projet désigné)' : ''}.</p>
              {cfg.regulatory && <div className="hint-lock"><Icon n="lock" /><span>Exigence réglementaire : cet élément reste visible et accessible par tous. Il ne peut être ni restreint, ni masqué.</span></div>}
              {cfg.access === 'contract' && <div className="wf-pick"><div className="rule-l">Parcours de négociation</div>
                <select className="sel3" style={{ width: '100%' }} value={cfg.workflow ?? ''} aria-label="Parcours de négociation" onChange={e => { const v = e.target.value || null; s.setPolicy(sel, { workflow: v }); if (v) { const w = wfs.find(x => x.id === v)!; s.updateWorkflow(v, { assets: [...new Set([...w.assets, sel])] }); } }}>
                  <option value="">Aucun parcours</option>{wfs.map(w => <option key={w.id} value={w.id}>{w.name} · {w.steps.length} étape{w.steps.length > 1 ? 's' : ''}</option>)}</select>
                {!cfg.workflow && <div className="warnbox" style={{ marginTop: 8 }}><Icon n="triangle-alert" /><span>Sans parcours, cet élément bloque la publication. <button className="link" onClick={goNego}>Composer un parcours</button></span></div>}</div>}
              <h3 style={{ display: 'flex', justifyContent: 'space-between' }}><span>Avant de publier</span><span style={{ color: canPublish ? 'var(--em8)' : 'var(--amber800)' }}>{reqs.length - missing.length + contractEls.length - orphans.length} sur {reqs.length + contractEls.length}</span></h3>
              <ul className="req">{reqs.map(r => { const c = placed.includes(r.blockId);
                return <li key={r.id} className={c ? '' : 'miss'}><Icon n={c ? 'circle-check' : 'circle-alert'} />{r.label}{c ? '' : ' : glissez l’élément'}</li>; })}
                {contractEls.map(id => { const w = wfs.find(x => x.id === pol(id).workflow);
                  return <li key={id} className={w ? '' : 'miss'}><Icon n={w ? 'circle-check' : 'circle-alert'} />{META[id][1]} : {w ? `parcours « ${w.name} »` : 'aucun parcours'}</li>; })}</ul>
            </section>
          </div>
          <DragOverlay>{drag ? <div className="ghost-blk" style={{ position: 'static' }}><Icon n="grip-vertical" /><Icon n={META[drag][0]} />{META[drag][1]}</div> : null}</DragOverlay>
        </DndContext>
      ) : (
        <div className="studio nego" style={{ position: 'relative' }}>
          <section className="cat" aria-label="Parcours de négociation"><h3 style={{ marginTop: 4 }}>Parcours</h3>
            {wfs.map(w => { const n = s.dacs.filter(d => d.workflow === w.id).length;
              return <button key={w.id} className={`wf-card${w.id === wf.id ? ' on' : ''}`} onClick={() => setWsel(w.id)} aria-pressed={w.id === wf.id}>
                <div className="t">{w.name}</div><div className="d">{w.steps.length} étape{w.steps.length > 1 ? 's' : ''} · {w.assets.length} élément{w.assets.length > 1 ? 's' : ''} · {n} contrat{n > 1 ? 's' : ''}</div></button>; })}
            <button className="btn sm w" style={{ marginTop: 6 }} onClick={newBlank}><Icon n="plus" />Nouveau parcours</button>
            <p className="mut" style={{ fontSize: 12, lineHeight: 1.5, margin: '14px 4px 0' }}>Les parcours sont enregistrés dans le service de négociation du réseau. Celui qui trouve un élément dans le catalogue voit ses étapes avant de demander.</p></section>
          <section className="canvas" aria-label="Étapes du parcours">
            {orphans.map(id => <div key={id} className="suggest"><Icon n="sparkle" /><div className="grow"><div className="t">« {META[id][1]} » attend son parcours</div>
              <div className="d">{id === 'depose' ? `Proposé : ${NEGOTIATION.proposal.steps.map(st => `${NEGOTIATION.stepTypes[st.type].label.toLowerCase()} (${st.param.toLowerCase()})`).join(', puis ')}.` : 'Composez un parcours ou rattachez-le à un parcours existant.'}</div></div>
              {id === 'depose' && <button className="btn p sm" id="a-nego-creer" onClick={createProposal}><Icon n="plus" />Créer le parcours proposé</button>}</div>)}
            <div className="canvas-h"><div className="grow"><input className="wf-name" value={wf.name} aria-label="Nom du parcours" onChange={e => upd({ name: e.target.value })} /><div className="d">Le demandeur franchit ces étapes dans l&apos;ordre ; la dernière déclenche le contrat d&apos;accès.</div></div></div>
            <ol className="wf-steps">{wf.steps.map((st, k) => { const T = NEGOTIATION.stepTypes[st.type];
              return <li key={k}><span className="n">{k + 1}</span><span className="ico"><Icon n={T.icon} /></span>
                <div className="grow"><div className="t">{T.label}</div><input value={st.param} aria-label={`Précision de l'étape ${k + 1}`} onChange={e => upd({ steps: wf.steps.map((x, j) => (j === k ? { ...x, param: e.target.value } : x)) })} /><div className="d">{T.hint}</div></div>
                <button className="btn g sm ic" aria-label={`Retirer l'étape ${k + 1}`} disabled={wf.steps.length === 1} onClick={() => upd({ steps: wf.steps.filter((_, j) => j !== k) })}><Icon n="x" /></button></li>; })}
              <li className="dac-step"><span className="n"><Icon n="file-signature" /></span><div className="grow"><div className="t">Contrat d&apos;accès délivré</div><div className="d">Signé par les deux parties, journalisé, révocable</div></div></li></ol>
            <div className="wf-add"><span className="mut" style={{ fontSize: 12.5 }}>Ajouter une étape</span>{(Object.keys(NEGOTIATION.stepTypes) as StepType[]).map(t => <button key={t} className="chip" onClick={() => upd({ steps: [...wf.steps, { type: t, param: NEGOTIATION.stepTypes[t].label }] })}><Icon n={NEGOTIATION.stepTypes[t].icon} />{NEGOTIATION.stepTypes[t].label}</button>)}</div>
          </section>
          <section className="insp" aria-label="Rattachement et contrats">
            <h3 style={{ marginTop: 4 }}>Éléments rattachés</h3>
            {contractEls.map(id => { const on = pol(id).workflow === wf.id, other = wfs.find(x => x.id === pol(id).workflow);
              return <button key={id} role="checkbox" aria-checked={on} className={`src-opt${on ? ' on' : ''}`} style={{ width: '100%', textAlign: 'left' }} onClick={() => attach(id, !on)}><span className="rd" style={{ borderRadius: 4 }} /><div><div className="t">{META[id][1]}</div><div className="d">{on ? 'Rattaché à ce parcours' : other ? `Rattaché à « ${other.name} »` : 'Aucun parcours'}</div></div></button>; })}
            <h3>Contrat délivré</h3>
            <div className="rule"><div className="rule-l">Usage autorisé</div><input className="wf-in" value={wf.usage} aria-label="Usage autorisé" onChange={e => upd({ usage: e.target.value })} /></div>
            <div className="rule"><div className="rule-l">Durée</div><select className="sel3" style={{ width: '100%' }} value={wf.duration} aria-label="Durée du contrat" onChange={e => upd({ duration: e.target.value })}>{[...new Set([wf.duration, ...DURATIONS])].map(d => <option key={d}>{d}</option>)}</select></div>
            <h3>Contrats délivrés par ce parcours</h3>
            {dacsOf.length ? <ul className="req">{dacsOf.map(d => <li key={d.ref}><Icon n="file-signature" /><span><b style={{ fontWeight: 600 }}>{d.party}</b> · {d.assetLabel.toLowerCase()} · jusqu&apos;au {d.until}<br /><span className="mono mut">{d.ref}</span></span></li>)}</ul>
              : <p className="mut" style={{ fontSize: 12.5, margin: '0 4px' }}>Aucun contrat pour l&apos;instant.</p>}
          </section>
        </div>
      )}

      <Sheet open={!!preview} onClose={() => setPreview(null)} label="Aperçu mobile du passeport">
        <div className="sheet-h" style={{ paddingTop: 16 }}><div><div className="eyebrow">Aperçu mobile</div><h3 style={{ fontSize: 16, fontWeight: 600 }}>Vu par : {preview === 'public' ? 'un particulier' : preview === 'prescriber' ? 'un prescripteur' : 'une autorité'}</h3></div><SheetClose /></div>
        <div className="sheet-b"><iframe title="Aperçu du passeport" src={asset(`/p/${HERO_GTIN}/?vue=${preview}`)} style={{ width: 375, maxWidth: '100%', height: 700, border: '1px solid var(--line)', borderRadius: 24, display: 'block', margin: '0 auto', background: 'var(--paper)' }} /></div>
      </Sheet>
    </AdminShell>
  );
}
