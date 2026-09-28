'use client';
/* Enveloppe cliente : réhydrate l'état, installe le récit, le panneau de démonstration (touche D) et les notifications. */
import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Toaster } from '@/components/ui/kit';
import { RecitHost } from '@/components/recit/RecitHost';
import { ISSUERS, STEPS } from '@/lib/data';
import { PROFILE_LABEL, useStore } from '@/lib/store';
import type { Profile } from '@/lib/types';

function DebugPanel() {
  const s = useStore();
  const router = useRouter();
  if (!s.debug) return null;
  return (
    <section className="dbg" aria-label="Panneau de démonstration">
      <h2><span>Panneau de démonstration</span><button className="icon-btn" aria-label="Fermer" onClick={() => s.setDebug(false)}><Icon n="x" /></button></h2>
      <h3>Nœuds du data space</h3>
      {ISSUERS.map(i => {
        const n = s.nodes[i.id];
        return <div className="nd" key={i.id}>
          <div><div className="n">{i.name}</div><div className="m">{i.network} · {n.latency} ms</div></div>
          <button className="sw" role="switch" aria-checked={n.online} aria-label={`${i.name} en ligne`} onClick={() => s.setNode(i.id, !n.online)} />
          <input type="range" min={150} max={1200} step={10} value={n.latency} aria-label={`Latence de ${i.name}`} onChange={e => s.setLatency(i.id, +e.target.value)} style={{ gridColumn: '1 / -1' }} />
        </div>;
      })}
      <h3>Profil</h3>
      <select value={s.profile} onChange={e => s.setProfile(e.target.value as Profile)} aria-label="Profil actif">
        {(Object.keys(PROFILE_LABEL) as Profile[]).map(p => <option key={p} value={p}>{PROFILE_LABEL[p]}</option>)}
      </select>
      <h3>Récit</h3>
      <select value={s.recit.step} onChange={e => { const n = +e.target.value; s.recitGoto(n); router.push(STEPS[n - 1].route); }} aria-label="Aller à l'étape">
        {STEPS.map(st => <option key={st.n} value={st.n}>{st.n}. {st.title}</option>)}
      </select>
      <div className="row2" style={{ marginTop: 10 }}>
        <button className="btn sm" onClick={() => { s.recitStart(); router.push('/scan'); }}><Icon n="play" />Relancer</button>
        <button className="btn sm" onClick={s.recitStop}>Arrêter</button>
        <button className="btn sm" onClick={() => { s.resetAll(); s.toast('Démonstration remise à zéro', 'rotate-ccw'); }}><Icon n="rotate-ccw" />Tout remettre à zéro</button>
      </div>
    </section>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const setDebug = useStore(s => s.setDebug);
  const [framed, setFramed] = useState(false);
  useEffect(() => {
    setFramed(window.self !== window.top);
    Promise.resolve(useStore.persist.rehydrate()).then(() => useStore.getState().setHydrated());
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;
      if ((e.key === 'd' || e.key === 'D') && !e.metaKey && !e.ctrlKey && !e.altKey) setDebug(!useStore.getState().debug);
    };
    const onStorage = (e: StorageEvent) => { if (e.key === 'dwx-passeport') useStore.persist.rehydrate(); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('storage', onStorage);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('storage', onStorage); };
  }, [setDebug]);
  if (framed) return <>{children}<Toaster /></>;
  return <>
    {children}
    <RecitHost />
    <DebugPanel />
    <button className="dbg-fab" aria-label="Panneau de démonstration (touche D)" title="Panneau de démonstration · touche D" onClick={() => setDebug(!useStore.getState().debug)}><Icon n="sliders-horizontal" /></button>
    <Toaster />
  </>;
}
