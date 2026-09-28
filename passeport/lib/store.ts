'use client';
/* État global : profil, attestation, nœuds simulés, récit, espace fabricant.
   Persisté dans localStorage, réhydraté après le montage pour éviter tout écart avec le HTML statique. */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DataAccessContract, NegotiationWorkflow, Profile } from './types';
import { ACTS, ISSUERS, NEGOTIATION, STEPS, TEMPLATES } from './data';
import { invalidate } from './dataspace';

export type Attestation = 'prescriber' | 'contractor' | 'auditor' | 'deconstructor';
export type Access = 'y' | 'c' | 'n';
type Nodes = Record<string, { online: boolean; latency: number }>;

interface Recit { on: boolean; step: number; done: string[]; intro: boolean; finished: boolean; collapsed: boolean; gestures: number }
interface Admin {
  pefcApplied: boolean;
  placed: string[];
  visibility: Record<string, string>;
  policies: Record<string, { discovery?: string; access?: string; usage?: string; workflow?: string | null }>;
  workflows: NegotiationWorkflow[];
  selectedLots: string[];
  generatedLots: string[];
  published: boolean;
  access: Record<string, string>;
  contracts: { id: string; initials: string; party: string; scope: string; duration: string }[];
}
interface Toast { id: number; msg: string; icon: string }

/** Organisation fictive qui porte chaque attestation (pour les contrats d'accès). */
export const PROFILE_ORG: Record<Profile, string> = {
  public: 'Particulier', prescriber: 'BET Structures Sud', contractor: 'Horizon Bois Construction', owner: 'Foncière des Arceaux',
  auditor: 'Contrôle Sud Structures', authority: 'Autorité de contrôle', deconstructor: 'Déconstruction Méditerranée', manufacturer: 'Lamellé-Collé du Val',
};
const UNTIL: Record<string, string> = { bim: '31/12/2027', depose: '30/06/2027', pro: '26/09/2027' };

export const PROFILE_LABEL: Record<Profile, string> = {
  public: 'Grand public', prescriber: 'Prescripteur', contractor: 'Entreprise de pose', owner: 'Gestionnaire du bâtiment',
  auditor: 'Contrôleur technique', authority: 'Autorité de contrôle', deconstructor: 'Déconstructeur agréé', manufacturer: 'Fabricant',
};

const initialNodes = (): Nodes => Object.fromEntries(ISSUERS.map(i => [i.id, { online: true, latency: i.connector.latencyMs }]));
const initialAdmin = (): Admin => ({
  pefcApplied: false, placed: [...TEMPLATES.placed], visibility: {}, policies: {}, workflows: NEGOTIATION.workflows.map(w => ({ ...w, steps: [...w.steps], assets: [...w.assets] })),
  selectedLots: [], generatedLots: [], published: false,
  access: {}, contracts: [],
});
const initialRecit = (): Recit => ({ on: false, step: 1, done: [], intro: true, finished: false, collapsed: false, gestures: 0 });

interface State {
  hydrated: boolean;
  profile: Profile;
  attestation: Attestation | null;
  unlockedAt: number;
  nodes: Nodes;
  recit: Recit;
  admin: Admin;
  toasts: Toast[];
  debug: boolean;
  lastScan: number;
  dacs: DataAccessContract[];
  setHydrated: () => void;
  negotiate: (c: { gtin: string; asset: string; assetLabel: string; workflow: string }) => DataAccessContract | null;
  createWorkflow: (w: NegotiationWorkflow) => void;
  updateWorkflow: (id: string, patch: Partial<NegotiationWorkflow>) => void;
  setPolicy: (block: string, patch: { discovery?: string; access?: string; usage?: string; workflow?: string | null }) => void;
  setProfile: (p: Profile) => void;
  present: (a: Attestation) => void;
  signOut: () => void;
  setNode: (id: string, online: boolean) => void;
  setLatency: (id: string, ms: number) => void;
  resetNodes: () => void;
  emit: (evt: string) => void;
  recitStart: () => void;
  recitBegin: () => void;
  recitNext: () => void;
  recitPrev: () => void;
  recitSkip: () => void;
  recitGoto: (n: number) => void;
  recitStop: () => void;
  recitCollapse: (c: boolean) => void;
  toast: (msg: string, icon?: string) => void;
  dismiss: (id: number) => void;
  setDebug: (d: boolean) => void;
  scanned: () => void;
  applyPefc: () => void;
  placeBlock: (id: string, index: number) => void;
  setVisibility: (id: string, v: string) => void;
  toggleLot: (lot: string) => void;
  generateLots: () => void;
  publish: () => void;
  setAccess: (key: string, v: string) => void;
  addContract: (c: Admin['contracts'][number]) => void;
  resetAll: () => void;
}

const ATT_PROFILE: Record<Attestation, Profile> = { prescriber: 'prescriber', contractor: 'contractor', auditor: 'auditor', deconstructor: 'deconstructor' };
let toastId = 1;

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      hydrated: false,
      profile: 'public',
      attestation: null,
      unlockedAt: 0,
      nodes: initialNodes(),
      recit: initialRecit(),
      admin: initialAdmin(),
      toasts: [],
      debug: false,
      lastScan: 0,
      dacs: [],

      negotiate: ({ gtin, asset, assetLabel, workflow }) => {
        const st = get(), wf = st.admin.workflows.find(w => w.id === workflow);
        if (!wf || st.profile === 'public') return null;
        const dac: DataAccessContract = {
          ref: `DAC-2026-${String(931 + st.dacs.length).padStart(4, '0')}`, gtin, asset, assetLabel, workflow,
          party: PROFILE_ORG[st.profile], role: PROFILE_LABEL[st.profile], usage: wf.usage, until: UNTIL[workflow] ?? '26/09/2027', signedAt: '26/09/2026',
        };
        set(s2 => ({ dacs: [...s2.dacs.filter(d => !(d.asset === asset && d.gtin === gtin && d.party === dac.party)), dac] }));
        get().emit(`nego:dac:${asset}`);
        return dac;
      },
      createWorkflow: w => {
        set(s2 => ({ admin: { ...s2.admin, workflows: [...s2.admin.workflows.filter(x => x.id !== w.id), w],
          policies: { ...s2.admin.policies, ...Object.fromEntries(w.assets.map(a => [a, { ...s2.admin.policies[a], workflow: w.id }])) } } }));
        get().emit('nego:created:' + w.id);
      },
      updateWorkflow: (id, patch) => set(s2 => ({ admin: { ...s2.admin, workflows: s2.admin.workflows.map(w => (w.id === id ? { ...w, ...patch } : w)) } })),
      setPolicy: (block, patch) => set(s2 => ({ admin: { ...s2.admin, policies: { ...s2.admin.policies, [block]: { ...s2.admin.policies[block], ...patch } } } })),

      setHydrated: () => set({ hydrated: true }),
      setProfile: p => set({ profile: p, attestation: null }),
      present: a => {
        set({ profile: ATT_PROFILE[a], attestation: a, unlockedAt: Date.now() });
        get().emit('wallet:verified:' + a);
      },
      signOut: () => set({ profile: 'public', attestation: null }),

      setNode: (id, online) => {
        invalidate(id);
        set(s => ({ nodes: { ...s.nodes, [id]: { ...s.nodes[id], online } } }));
        get().emit(`node:${id}:${online ? 'on' : 'off'}`);
      },
      setLatency: (id, ms) => { invalidate(id); set(s => ({ nodes: { ...s.nodes, [id]: { ...s.nodes[id], latency: ms } } })); },
      resetNodes: () => { ISSUERS.forEach(i => invalidate(i.id)); set({ nodes: initialNodes() }); },

      /* Le récit avance quand l'événement attendu par le geste courant arrive, dans l'ordre. */
      emit: evt => set(s => {
        const r = s.recit;
        if (!r.on || r.finished) return {};
        const st = STEPS[r.step - 1];
        if (!st || st.completeOn[r.done.length] !== evt) return {};
        return { recit: { ...r, done: [...r.done, evt], intro: false, gestures: r.gestures + 1 } };
      }),

      recitStart: () => {
        ISSUERS.forEach(i => invalidate(i.id));
        set({ recit: { ...initialRecit(), on: true }, profile: 'public', attestation: null, nodes: initialNodes(), admin: initialAdmin(), dacs: [] });
      },
      recitBegin: () => set(s => ({ recit: { ...s.recit, intro: false } })),
      recitNext: () => set(s => {
        const r = s.recit;
        if (r.step >= STEPS.length) return { recit: { ...r, finished: true } };
        const next = STEPS[r.step];
        const actChange = next.act !== STEPS[r.step - 1].act;
        const act = ACTS[next.act - 1];
        const profile = actChange && next.act >= 3 ? act.profile : s.profile;
        return { recit: { ...r, step: r.step + 1, done: [], intro: actChange }, profile, attestation: actChange && next.act >= 3 ? null : s.attestation };
      }),
      recitPrev: () => set(s => ({ recit: { ...s.recit, step: Math.max(1, s.recit.step - 1), done: [], intro: false, finished: false } })),
      recitSkip: () => {
        const r = get().recit, st = STEPS[r.step - 1], g = get();
        if (st.n === 4) g.present('auditor');
        if (st.n === 5) { if (g.profile === 'public') g.present('auditor'); g.negotiate({ gtin: '03760000000011', asset: 'bim', assetLabel: 'Maquette numérique du panneau', workflow: 'bim' }); }
        if (st.n === 6 && !g.nodes.iqc.online) g.setNode('iqc', true);
        if (st.n === 10) { if (!g.admin.pefcApplied) g.applyPefc(); if (!get().admin.placed.includes('demontage')) get().placeBlock('demontage', 6); }
        if (st.n === 11) { if (!get().admin.workflows.some(w => w.id === 'depose')) get().createWorkflow({ ...NEGOTIATION.proposal, steps: [...NEGOTIATION.proposal.steps], assets: [...NEGOTIATION.proposal.assets] }); if (!get().admin.placed.includes('demontage')) get().placeBlock('demontage', 6); if (!get().admin.published) get().publish(); }
        if (st.n === 12) { if (!get().admin.selectedLots.includes('27-0124')) get().toggleLot('27-0124'); get().generateLots(); }
        set(s => ({ recit: { ...s.recit, done: [...st.completeOn], intro: false } }));
      },
      recitGoto: n => set(s => ({ recit: { ...s.recit, on: true, step: n, done: [], intro: true, finished: false }, profile: STEPS[n - 1].act >= 3 ? ACTS[STEPS[n - 1].act - 1].profile : s.profile })),
      recitStop: () => set(s => ({ recit: { ...s.recit, on: false } })),
      recitCollapse: c => set(s => ({ recit: { ...s.recit, collapsed: c } })),

      toast: (msg, icon = 'circle-check') => {
        const id = toastId++;
        set(s => ({ toasts: [...s.toasts.slice(-1), { id, msg, icon }] }));
        setTimeout(() => get().dismiss(id), 3400);
      },
      dismiss: id => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
      setDebug: d => set({ debug: d }),
      scanned: () => set({ lastScan: Date.now() }),

      applyPefc: () => {
        set(s => ({ admin: { ...s.admin, pefcApplied: true } }));
        get().toast('Certificat appliqué à 6 passeports · versions signées', 'check-check');
        get().emit('admin:pefc');
      },
      placeBlock: (id, index) => {
        set(s => {
          if (s.admin.placed.includes(id)) return {};
          const placed = [...s.admin.placed];
          placed.splice(Math.max(0, Math.min(index, placed.length)), 0, id);
          return { admin: { ...s.admin, placed } };
        });
        get().emit('studio:' + id);
      },
      setVisibility: (id, v) => set(s => ({ admin: { ...s.admin, visibility: { ...s.admin.visibility, [id]: v } } })),
      toggleLot: lot => {
        const on = get().admin.selectedLots.includes(lot);
        set(s => ({ admin: { ...s.admin, selectedLots: on ? s.admin.selectedLots.filter(l => l !== lot) : [...s.admin.selectedLots, lot] } }));
        if (!on) get().emit('lot:' + lot);
      },
      generateLots: () => {
        set(s => ({ admin: { ...s.admin, generatedLots: [...new Set([...s.admin.generatedLots, ...s.admin.selectedLots])], selectedLots: [] } }));
        get().emit('lots:generated');
      },
      publish: () => { set(s => ({ admin: { ...s.admin, published: true } })); get().toast('Version 2.2 publiée et signée', 'send'); get().emit('studio:published'); },
      setAccess: (key, v) => set(s => ({ admin: { ...s.admin, access: { ...s.admin.access, [key]: v } } })),
      addContract: c => set(s => ({ admin: { ...s.admin, contracts: [...s.admin.contracts, c] } })),
      resetAll: () => { ISSUERS.forEach(i => invalidate(i.id)); set({ profile: 'public', attestation: null, nodes: initialNodes(), recit: initialRecit(), admin: initialAdmin(), dacs: [] }); },
    }),
    {
      name: 'dwx-passeport',
      version: 2,
      migrate: () => ({}) as unknown as State,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: s => ({ profile: s.profile, attestation: s.attestation, nodes: s.nodes, recit: s.recit, admin: s.admin, lastScan: s.lastScan, dacs: s.dacs }),
    },
  ),
);

/** Un profil professionnel lit les données « professional » ; seule l'autorité lit « authority ». */
export function canRead(visibility: string, profile: Profile) {
  if (visibility === 'public') return true;
  if (visibility === 'authority') return profile === 'authority';
  return profile !== 'public';
}
