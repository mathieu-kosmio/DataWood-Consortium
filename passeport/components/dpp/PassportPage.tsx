'use client';
/* Orchestration du passeport : carte d'identité, rubrique, feuilles ; mobile d'abord, deux colonnes à partir de 1024 px. */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DemoStrip } from '@/components/ui/kit';
import { product } from '@/lib/data';
import { useIsDesktop } from '@/lib/hooks';
import { useStore } from '@/lib/store';
import type { Profile, Rubrique } from '@/lib/types';
import { PassportCtx } from './context';
import { Actions, BuildingLink, CarbonKpi, ComplianceBadges, Footer, Hero, ProBlock, Questions, Retenir, StateBanner, TopBar, TrustBanner } from './parts';
import { RENDER, SubHeader, useRubEvent } from './rubriques';
import { ProofSheet, WalletSheet } from './sheets';
import { AssetsBlock, NegotiationSheet } from './negotiation';
import { RUBRIQUES } from '@/lib/data';

export function PassportPage({ gtin, rub }: { gtin: string; rub?: Rubrique }) {
  const p = product(gtin)!;
  const desk = useIsDesktop();
  const router = useRouter();
  const emit = useStore(s => s.emit);
  const hydrated = useStore(s => s.hydrated);
  const [proof, setProof] = useState<string | null>(null);
  const [wallet, setWallet] = useState(false);
  const [nego, setNego] = useState<string | null>(null);
  const [lot, setLot] = useState<string | undefined>();
  const [viewAs, setViewAs] = useState<Profile | undefined>();

  useEffect(() => { const q = new URLSearchParams(location.search); const l = q.get('lot'); if (l) setLot(l); const v = q.get('vue'); if (v) setViewAs(v as Profile); }, []);
  useEffect(() => { if (hydrated) { emit('passport:open:' + gtin); useStore.getState().scanned(); } }, [hydrated, gtin, emit]);
  useRubEvent(rub);

  const goRub = useCallback((r: string) => {
    if (desk) {
      const el = document.getElementById(r);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 118, behavior: 'smooth' });
      emit('rub:' + r);
    } else router.push(`/p/${gtin}/${r}`);
  }, [desk, emit, gtin, router]);

  useEffect(() => {
    if (desk && rub && rub !== 'identite') {
      const t = setTimeout(() => { const el = document.getElementById(rub); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 118 }); }, 60);
      return () => clearTimeout(t);
    }
  }, [desk, rub]);

  const ctx = useMemo(() => ({ p, desk, goRub, viewAs, openProof: (k: string) => setProof(k), openWallet: () => setWallet(true), openNegotiation: (a: string) => setNego(a) }), [p, desk, goRub, viewAs]);

  const card = <>
    <StateBanner /><Hero lot={lot} /><TrustBanner /><CarbonKpi /><Retenir /><ComplianceBadges />
    {!desk && <Questions />}<ProBlock /><AssetsBlock /><BuildingLink /><Actions />{!desk && <Footer />}
  </>;

  let body;
  if (desk) body = (
    <div className="desk">
      <aside className="side pp" aria-label="Carte d'identité du produit">{card}</aside>
      <main className="main"><SubHeader r={rub ?? 'identite'} />
        {RUBRIQUES.map(r => { const R = RENDER[r.key]; return <section key={r.key} id={r.key}><R /></section>; })}
        <Footer /></main>
    </div>
  );
  else if (rub) { const R = RENDER[rub]; body = <main className="pp"><SubHeader r={rub} /><R /><div style={{ height: 28 }} /></main>; }
  else body = <main className="pp">{card}</main>;

  return (
    <PassportCtx.Provider value={ctx}>
      <DemoStrip />
      <TopBar />
      {body}
      <ProofSheet p={p} k={proof} onClose={() => setProof(null)} />
      <WalletSheet open={wallet} onClose={() => setWallet(false)} />
      <NegotiationSheet id={nego} onClose={() => setNego(null)} />
    </PassportCtx.Provider>
  );
}
