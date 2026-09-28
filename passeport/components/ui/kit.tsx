'use client';
/* Petits composants partagés : statut, validité, avatar d'organisation, réseau, feuille, squelette. */
import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { STATUS, issuer } from '@/lib/data';
import type { VerificationStatus } from '@/lib/types';
import { useStore } from '@/lib/store';

export function StatusPill({ s, onClick, id, off, className }: { s: VerificationStatus; onClick?: () => void; id?: string; off?: boolean; className?: string }) {
  const d = STATUS[s];
  const cls = `stt ${off ? 'off' : d.cls}${className ? ' ' + className : ''}`;
  const body = <><Icon n={off ? 'cloud-off' : d.icon} />{d.label}</>;
  return onClick
    ? <button type="button" id={id} className={cls} onClick={onClick} aria-haspopup="dialog" aria-label={`${d.label} : voir la preuve`}>{body}</button>
    : <span id={id} className={cls}>{body}</span>;
}

const VAL_ICON = { ok: 'circle-check', warn: 'clock-alert', crit: 'octagon-x', off: 'cloud-off' } as const;
export function Validity({ st, children }: { st: keyof typeof VAL_ICON; children: ReactNode }) {
  return <span className={`val ${st}`}><Icon n={VAL_ICON[st]} />{children}</span>;
}

export function Org({ id, size = '' }: { id: string; size?: '' | 'sm' | 'xs' }) {
  return <span className={`av ${size}`} aria-hidden="true">{issuer(id).initials}</span>;
}

export function NetworkTag({ id }: { id: string }) {
  const n = issuer(id).network;
  return <span className={`net${n === 'DataBuilding-X' ? ' dbx' : ''}`}>{n}</span>;
}

export function DemoStrip() {
  return <div className="demo-strip" role="note"><Icon n="flask-conical" />Données de démonstration fictives</div>;
}

export function Sk({ w = '100%', h = 14, m = '0', r }: { w?: string; h?: number; m?: string; r?: number }) {
  return <div className="sk" style={{ width: w, height: h, margin: m, borderRadius: r }} aria-hidden="true" />;
}

/** Feuille : en bas sur téléphone, panneau latéral de 440 px sur ordinateur. */
export function Sheet({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  return (
    <Dialog.Root open={open} onOpenChange={o => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="scrim" />
        <Dialog.Content className="sheet" aria-describedby={undefined}>
          <Dialog.Title className="sr">{label}</Dialog.Title>
          <div className="grab" />
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export const SheetClose = ({ label = 'Fermer' }: { label?: string }) => (
  <Dialog.Close className="icon-btn" aria-label={label}><Icon n="x" /></Dialog.Close>
);

export function Toaster() {
  const toasts = useStore(s => s.toasts);
  const recitOn = useStore(s => s.recit.on);
  return <>{toasts.slice(-1).map(t => <div key={t.id} className={`toast${recitOn ? ' on-dock' : ''}`} role="status"><Icon n={t.icon} />{t.msg}</div>)}</>;
}

/** Télécharge un document de démonstration. */
export function DocLink({ href, children, className = 'btn sm' }: { href: string; children: ReactNode; className?: string }) {
  return <a className={className} href={(process.env.NEXT_PUBLIC_BASE_PATH ?? '') + href} target="_blank" rel="noopener">{children}</a>;
}
