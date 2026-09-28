'use client';
/* Données sous contrat (vue consommateur) : chaque élément restreint se négocie selon le parcours fixé par le fabricant,
   et la négociation aboutit à un contrat d'accès (DAC) daté. Architecture cible : Simpl-Open étendu d'un service de négociation. */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Org, Sheet, SheetClose } from '@/components/ui/kit';
import { NEGOTIATION, issuer } from '@/lib/data';
import { PROFILE_LABEL, PROFILE_ORG, useStore } from '@/lib/store';
import { asset as assetUrl } from '@/lib/asset';
import type { DataAsset, NegotiationWorkflow, Profile } from '@/lib/types';
import { usePassport, useProfile } from './context';

/** Une attestation convient-elle à l'étape ? « Déconstructeur agréé » exige ce rôle ; sinon toute attestation pro. */
function attestationOk(param: string, profile: Profile) {
  if (profile === 'public') return false;
  if (/Déconstructeur/.test(param)) return profile === 'deconstructor';
  return true;
}

/** Élément visible côté passeport : son parcours existe, et le plan de dépose n'apparaît qu'une fois la version 2.2 publiée. */
export function useAssets() {
  const { p } = usePassport();
  const wfs = useStore(s => s.admin.workflows);
  const published = useStore(s => s.admin.published);
  return (p.assets ?? []).filter(a => wfs.some(w => w.id === a.workflow) && (a.block !== 'depose' || published));
}

export function AssetRow({ a }: { a: DataAsset }) {
  const { p, openNegotiation } = usePassport();
  const profile = useProfile();
  const dac = useStore(s => s.dacs.find(d => d.gtin === p.gtin && d.asset === a.id && d.party === PROFILE_ORG[profile]));
  return (
    <div className="asset" id={`asset-${a.id}`}>
      <span className="tile"><Icon n={a.icon} /></span>
      <div className="grow">
        <div className="q">{a.label}</div>
        <div className="a">{a.format} · {a.size}</div>
        <div className="conds" aria-label="Conditions fixées par le fabricant">{a.conditions.map(c => <span key={c}><Icon n="check" className="ic-s" />{c}</span>)}</div>
        {dac ? <div className="dac-mini"><span className="chip em"><Icon n="file-signature" />Contrat {dac.ref} · jusqu&apos;au {dac.until}</span>
            <a className="btn sm" href={assetUrl(a.file ?? '/docs/certificat-demo.pdf')} download><Icon n="download" />Télécharger</a></div>
          : <button className="btn sm" id={`a-${a.id}`} onClick={() => openNegotiation(a.id)}><Icon n="file-signature" />Demander l&apos;accès</button>}
      </div>
    </div>
  );
}

export function AssetsBlock() {
  const list = useAssets();
  if (!list.length) return null;
  return (
    <section className="grp" id="assets"><div className="grp-h"><h2>Données sous contrat</h2><Link className="a" href="/catalogue">Catalogue du réseau</Link></div>
      <div className="list">{list.map(a => <AssetRow key={a.id} a={a} />)}</div>
      <p className="assets-note">Le fabricant fixe ses conditions ; vous les remplissez, et un contrat d&apos;accès daté vous ouvre le fichier.</p></section>
  );
}

export function NegotiationSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { p, openWallet } = usePassport();
  const profile = useProfile();
  const a = (p.assets ?? []).find(x => x.id === id);
  const wf = useStore(s => s.admin.workflows.find(w => w.id === a?.workflow)) as NegotiationWorkflow | undefined;
  const { emit, negotiate, toast } = useStore.getState();
  const dac = useStore(s => a && s.dacs.find(d => d.gtin === p.gtin && d.asset === a.id && d.party === PROFILE_ORG[profile]));
  const [busy, setBusy] = useState(false);
  const [project, setProject] = useState('Bureaux Les Arceaux, Montpellier');
  useEffect(() => { if (a) emit('nego:open:' + a.id); }, [a, emit]);
  if (!a || !wf) return null;
  const att = wf.steps.find(s => s.type === 'attestation');
  const attOk = !att || attestationOk(att.param, profile);
  const conclude = () => {
    setBusy(true);
    setTimeout(() => { const c = negotiate({ gtin: p.gtin, asset: a.id, assetLabel: a.label, workflow: wf.id }); setBusy(false); if (c) toast(`Contrat d'accès ${c.ref} signé par les deux parties`, 'file-signature'); }, 700);
  };
  const lastAction = wf.steps.some(s => s.type === 'accord') ? 'Signer l’accord et obtenir le contrat' : wf.steps.some(s => s.type === 'declaration') ? 'Déclarer le chantier et obtenir le contrat' : 'Obtenir le contrat';
  return (
    <Sheet open={!!id} onClose={onClose} label={`Accès sous contrat : ${a.label}`}>
      <div className="sheet-h"><div><div className="eyebrow">Accès sous contrat</div><h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-.015em', marginTop: 2 }}>{a.label}</h3>
        <div className="mut" style={{ fontSize: 12.5, marginTop: 2 }}>{a.format} · {a.size}</div></div><SheetClose /></div>
      <div className="sheet-b">
        <div className="ng-by"><Org id={p.manufacturerId} size="sm" /><div><div className="t">Conditions fixées par {issuer(p.manufacturerId).name}</div><div className="d">Parcours « {wf.name} » · {wf.steps.length} étape{wf.steps.length > 1 ? 's' : ''}</div></div></div>

        {dac ? (
          <div className="dac" role="status">
            <div className="dac-h"><Icon n="file-signature" /><div><div className="t">Contrat d&apos;accès délivré</div><div className="d mono">{dac.ref}</div></div><span className="chip em"><Icon n="circle-check" />Signé des deux parties</span></div>
            <dl>
              <div><dt>Fournisseur</dt><dd>{issuer(p.manufacturerId).name}</dd></div>
              <div><dt>Bénéficiaire</dt><dd>{dac.party} · {dac.role}</dd></div>
              <div><dt>Élément</dt><dd>{a.label}</dd></div>
              <div><dt>Usage autorisé</dt><dd>{dac.usage}</dd></div>
              <div><dt>Valable jusqu&apos;au</dt><dd className="num">{dac.until}</dd></div>
              <div><dt>Signé le</dt><dd className="num">{dac.signedAt}</dd></div>
            </dl>
            <a className="btn p w lg" href={assetUrl(a.file ?? '/docs/certificat-demo.pdf')} download onClick={() => toast('Fichier transmis par le serveur du fabricant', 'download')}><Icon n="download" />Télécharger · {a.size}</a>
            <p className="ng-note"><Icon n="cpu" />La négociation passe par le service commun du réseau ; le fichier part directement de l&apos;agent Simpl du fabricant vers le vôtre. Chaque téléchargement est journalisé sous ce contrat.</p>
          </div>
        ) : <>
          <ol className="ng-steps">{wf.steps.map((st, k) => {
            const T = NEGOTIATION.stepTypes[st.type];
            const done = st.type === 'attestation' ? attOk : st.type === 'projet' ? attOk : false;
            return <li key={k} className={done ? 'done' : !attOk && st.type !== 'attestation' ? 'wait' : 'todo'}>
              <span className="nb">{done ? <Icon n="check" /> : k + 1}</span>
              <div className="grow"><div className="t"><Icon n={T.icon} className="ic-s" />{T.label}</div><div className="d">{st.param} · {T.hint}</div>
                {st.type === 'attestation' && (attOk ? <div className="ok">{PROFILE_LABEL[profile]} · {PROFILE_ORG[profile]} · vérifiée</div>
                  : <button className="btn sm" style={{ marginTop: 8 }} onClick={() => { onClose(); setTimeout(openWallet, 120); }}><Icon n="wallet" />Présenter mon attestation</button>)}
                {st.type === 'projet' && attOk && <select className="ng-select" value={project} onChange={e => setProject(e.target.value)} aria-label="Projet désigné"><option>Bureaux Les Arceaux, Montpellier</option><option>Groupe scolaire Jean-Moulin, Nîmes</option></select>}
                {st.type === 'accord' && <ul className="nda">{NEGOTIATION.nda.map(c => <li key={c}>{c}</li>)}</ul>}
                {st.type === 'declaration' && attOk && <div className="ok" style={{ color: 'var(--s600)' }}>Bureaux Les Arceaux, 34000 Montpellier · déconstruction sélective</div>}
                {st.type === 'validation' && <div className="d">Réponse du fabricant sous 48 heures</div>}
              </div></li>;
          })}</ol>
          <div className="ng-usage"><div><span className="k">Usage autorisé</span>{wf.usage}</div><div><span className="k">Durée</span>{wf.duration}</div></div>
          <button className="btn p w lg" id="nego-signer" disabled={!attOk || busy} onClick={conclude}><Icon n={busy ? 'hourglass' : 'file-signature'} />{busy ? 'Signature en cours…' : lastAction}</button>
          {!attOk && <p className="priv"><Icon n="info" />Ce parcours demande d&apos;abord une attestation : {att?.param.toLowerCase()}.</p>}
        </>}
      </div>
    </Sheet>
  );
}
