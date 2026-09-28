'use client';
/* Carte de preuve et présentation d'attestation (spec § 6 et § 7.3). */
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Icon } from '@/components/ui/Icon';
import { NetworkTag, Sheet, SheetClose, StatusPill } from '@/components/ui/kit';
import { STATUS, TODAY, issuer } from '@/lib/data';
import { date, value } from '@/lib/format';
import { useNode } from '@/lib/hooks';
import { useStore, type Attestation } from '@/lib/store';
import { asset } from '@/lib/asset';
import type { Product } from '@/lib/types';
import { dpOf } from './context';

function lifePct(from: string, to?: string) {
  if (!to) return 0;
  const a = Date.parse(from), b = Date.parse(to), t = Date.parse(TODAY);
  return Math.max(2, Math.min(100, Math.round(((t - a) / (b - a)) * 100)));
}

export function ProofSheet({ p, k, onClose }: { p: Product; k: string | null; onClose: () => void }) {
  const d = k ? dpOf(p, k) : undefined;
  const src = d ? issuer(d.provenance.sourceNodeId) : undefined;
  const st = useNode(d?.provenance.sourceNodeId ?? 'lcv');
  const emit = useStore(s => s.emit);
  useEffect(() => { if (d) emit('proof:' + d.key); }, [d, emit]);
  if (!d || !src) return null;
  const pv = d.provenance, ver = pv.verifierId ? issuer(pv.verifierId) : undefined;
  const [num, ...u] = [value(d.value), d.unit ?? ''];
  return (
    <Sheet open={!!d} onClose={onClose} label={`Carte de preuve : ${d.label}`}>
      <div className="sheet-h"><div><div className="eyebrow">Carte de preuve</div><h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-.01em', marginTop: 2 }}>{d.label}</h3></div><SheetClose /></div>
      <div className="sheet-b">
        <div className="pv-v"><span className="n num">{num}</span><span className="u">{u}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}><StatusPill s={pv.status} /><span className="mut" style={{ fontSize: 12.5, lineHeight: 1.4 }}>{STATUS[pv.status].def}</span></div>
        <div className="pv-sec">
          <div className="pv-row"><Icon n="server" /><div className="grow"><div className="k">Source</div><div className="x">{src.name}</div>
            <div className="y">{st === 'offline' ? 'Source momentanément indisponible · dernière valeur du 26/09 à 10:42' : <>Lue à l&apos;instant chez l&apos;émetteur · <NetworkTag id={src.id} /> · {src.connector.latencyMs} ms</>}</div></div></div>
          {pv.documentRef && <div className="pv-row"><Icon n="file-text" /><div className="grow"><div className="k">Document</div><div className="x">{pv.documentRef}</div>
            {pv.documentUrl && <div className="y"><a className="link" href={asset(pv.documentUrl)} target="_blank" rel="noopener">Ouvrir le PDF</a></div>}</div></div>}
          {(pv.standard || d.method) && <div className="pv-row"><Icon n="ruler" /><div className="grow"><div className="k">Méthode</div><div className="x">{pv.standard ?? d.method}</div></div></div>}
          <div className="pv-row"><Icon n="badge-check" /><div className="grow"><div className="k">{ver ? 'Vérifiée par' : 'Vérification'}</div><div className="x">{ver ? ver.name : 'Aucun tiers'}</div>
            <div className="y">{ver ? 'Organisme indépendant du fabricant' : 'Donnée sous la seule responsabilité de son émetteur'}</div></div></div>
          <div className="pv-row"><Icon n="calendar-range" /><div className="grow"><div className="k">Validité</div><div className="x num">{pv.validUntil ? `Du ${date(pv.issuedAt)} au ${date(pv.validUntil)}` : `Émise le ${date(pv.issuedAt)}, sans échéance`}</div>
            {pv.validUntil && <div className="life" style={{ marginTop: 8 }}><div className="bar"><i style={{ width: `${lifePct(pv.issuedAt, pv.validUntil)}%` }} /></div></div>}</div></div>
          {pv.signature && <div className="pv-row"><Icon n="shield-check" /><div className="grow"><div className="k">Signature</div><div className="x" style={{ color: 'var(--em8)' }}>Signature vérifiée</div><div className="y mono">{pv.signature.did.slice(0, 24)}…</div></div></div>}
        </div>
        {(pv.covers || pv.notCovers) && <div className="cov">
          {pv.covers && <div className="yes"><b><Icon n="check" />Ce qu&apos;elle couvre</b>{pv.covers}</div>}
          {pv.notCovers && <div className="no"><b><Icon n="minus" />Ce qu&apos;elle ne couvre pas</b>{pv.notCovers}</div>}
        </div>}
        <details className="vc"><summary><Icon n="braces" />Voir la donnée signée, celle que lisent les logiciels</summary><pre>{JSON.stringify({
          type: ['VerifiableCredential'], issuer: pv.signature?.did, validFrom: pv.issuedAt,
          credentialSubject: { gtin: p.gtin, [d.key]: { value: d.value, unit: d.unit } }, proof: { type: 'DataIntegrityProof', proofValue: 'z-demo…' },
        }, null, 2)}</pre></details>
      </div>
    </Sheet>
  );
}

const WAL: { a: Attestation; c: string; t: string; d: string; i: string }[] = [
  { a: 'prescriber', c: 'c2', t: "Prescripteur, bureau d'études", d: "Qualification ingénierie · jusqu'en 2027", i: 'drafting-compass' },
  { a: 'contractor', c: 'c1', t: 'Entreprise de pose RGE', d: "Qualification RGE · jusqu'en 2027", i: 'hard-hat' },
  { a: 'auditor', c: 'c3', t: 'Contrôleur technique', d: "Agrément ministériel · jusqu'en 2028", i: 'clipboard-check' },
  { a: 'deconstructor', c: 'c4', t: 'Déconstructeur agréé', d: "Habilitation déconstruction · jusqu'en 2027", i: 'pickaxe' },
];
const ORG: Record<Attestation, string> = { prescriber: 'BET Structures Sud', contractor: 'Horizon Bois Construction', auditor: 'Contrôle Sud Structures', deconstructor: 'Déconstruction Méditerranée' };

export function WalletSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sel, setSel] = useState<Attestation | null>(null);
  const [phase, setPhase] = useState<'choose' | 'verify'>('choose');
  const { present, signOut, emit, toast } = useStore.getState();
  const profile = useStore(s => s.profile);
  useEffect(() => { if (open) { setPhase('choose'); setSel(null); emit('wallet:open'); } }, [open, emit]);
  const go = () => {
    if (!sel) return;
    setPhase('verify');
    setTimeout(() => {
      present(sel); onClose();
      toast(`Attestation vérifiée : ${WAL.find(w => w.a === sel)!.t}`, 'badge-check');
    }, 850);
  };
  return (
    <Sheet open={open} onClose={onClose} label="Présenter une attestation professionnelle">
      {phase === 'verify' ? (
        <div className="verif" role="status"><div className="sp"><svg viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="32" fill="none" stroke="var(--em100)" strokeWidth="4" /><path d="M36 4a32 32 0 0 1 32 32" fill="none" stroke="var(--em7)" strokeWidth="4" strokeLinecap="round" /></svg><Icon n="shield" /></div>
          <h3>Vérification de l&apos;attestation</h3><p>{WAL.find(w => w.a === sel)?.t} · {sel ? ORG[sel] : ''}</p>
          <ul className="vsteps"><li><Icon n="circle-check" />Attestation lue</li><li><Icon n="circle-check" />Émetteur reconnu par le réseau</li><li className="w"><Icon n="circle-dashed" />Droits appliqués au passeport</li></ul></div>
      ) : <>
        <div className="sheet-h"><div><div className="eyebrow">Accès professionnel</div><h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-.015em', marginTop: 2 }}>Présentez votre attestation</h3></div><SheetClose /></div>
        <div className="sheet-b">
          <p style={{ fontSize: 13.5, color: 'var(--s600)', lineHeight: 1.5 }}>Choisissez l&apos;attestation à présenter. Le passeport s&apos;ouvre aux données que votre métier permet de lire.</p>
          <ul className="wal-l" role="radiogroup" aria-label="Attestations disponibles">{WAL.map(w =>
            <li key={w.a}><button className="wal" id={`wal-${w.a}`} role="radio" aria-checked={sel === w.a} onClick={() => setSel(w.a)}>
              <span className={`card3 ${w.c}`}><Icon n={w.i} /></span><div className="grow"><div className="t">{w.t}</div><div className="d">{w.d}</div></div><span className="rd" /></button></li>)}</ul>
          <div className="or">ou</div>
          <div className="eudi"><span className="qr"><QRCodeSVG value="openid4vp://?client_id=datawood.org&request_uri=demo" size={46} level="M" /></span>
            <div><div style={{ fontSize: 14, fontWeight: 600 }}>Scanner avec mon portefeuille européen</div><div className="mut" style={{ fontSize: 12.5, marginTop: 2 }}>Toute application compatible EUDI Wallet</div></div></div>
          <button className="btn p w lg" id="wal-present" style={{ marginTop: 16 }} disabled={!sel} onClick={go}>Présenter l&apos;attestation</button>
          {profile !== 'public' && <button className="btn g w" style={{ marginTop: 6 }} onClick={() => { signOut(); onClose(); toast('Vous lisez le passeport en grand public', 'eye'); }}>Revenir à la vue grand public</button>}
          <p className="priv"><Icon n="eye-off" />Seuls votre métier et la validité de l&apos;attestation sont transmis. Ni compte, ni nom, ni suivi.</p>
        </div>
      </>}
    </Sheet>
  );
}
