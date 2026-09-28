'use client';
import { createContext, useContext } from 'react';
import type { Product, Profile } from '@/lib/types';
import { useStore } from '@/lib/store';

export interface PassportUI {
  p: Product;
  openProof: (key: string) => void;
  openWallet: () => void;
  openNegotiation: (assetId: string) => void;
  goRub: (r: string) => void;
  desk: boolean;
  viewAs?: Profile;
}
export const PassportCtx = createContext<PassportUI | null>(null);
export function usePassport() {
  const c = useContext(PassportCtx);
  if (!c) throw new Error('PassportCtx manquant');
  return c;
}
export const dpOf = (p: Product, key: string) => p.data.find(d => d.key === key);

/** Profil actif, ou profil forcé par l'aperçu du Studio (?vue=). */
export function useProfile(): Profile {
  const c = useContext(PassportCtx);
  const p = useStore(s => s.profile);
  return c?.viewAs ?? p;
}
