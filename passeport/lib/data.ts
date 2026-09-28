/* Accès typé aux données de démonstration (fichiers JSON de /data). */
import type { Act, Building, Issuer, NegotiationWorkflow, Product, RecitStep, Rubrique, StepType, VerificationStatus } from './types';
import issuersJson from '@/data/issuers.json';
import clt from '@/data/products/clt.json';
import ciment from '@/data/products/ciment.json';
import isolant from '@/data/products/isolant.json';
import arceaux from '@/data/buildings/arceaux.json';
import recitJson from '@/data/recit.json';
import templatesJson from '@/data/templates.json';
import policiesJson from '@/data/policies.json';
import fleetJson from '@/data/fleet.json';
import negotiationJson from '@/data/negotiation.json';
import catalogJson from '@/data/catalog.json';

export const ISSUERS = issuersJson as unknown as Issuer[];
export const PRODUCTS = [clt, ciment, isolant] as unknown as Product[];
export const BUILDINGS = [arceaux] as unknown as Building[];
export const ACTS = recitJson.acts as unknown as Act[];
export const STEPS = recitJson.steps as unknown as RecitStep[];
export const TEMPLATES = templatesJson;
export const POLICIES = policiesJson;
export const FLEET = fleetJson;
export const NEGOTIATION = negotiationJson as unknown as { stepTypes: Record<StepType, { icon: string; label: string; hint: string }>; workflows: NegotiationWorkflow[]; proposal: NegotiationWorkflow; nda: string[] };
export const CATALOG = catalogJson;

export const HERO_GTIN = '03760000000011';
export const TODAY = '2026-09-26';

export const issuer = (id: string): Issuer =>
  ISSUERS.find(i => i.id === id) ?? { id, name: id, initials: '?', role: 'supplier', roleLabel: '', place: '', did: '', network: 'DataWood-X', connector: { nodeId: id, latencyMs: 300, online: true } };
export const product = (gtin: string) => PRODUCTS.find(p => p.gtin === gtin);
export const building = (id: string) => BUILDINGS.find(b => b.id === id);

export const STATUS: Record<VerificationStatus, { label: string; icon: string; cls: string; def: string }> = {
  third_party_verified: { label: 'Vérifié par un tiers', icon: 'badge-check', cls: 'tiers', def: "Un organisme indépendant, identifié, a contrôlé la donnée et signé son contrôle." },
  controlled: { label: 'Contrôlé', icon: 'circle-check', cls: 'ctrl', def: 'Contrôlée par le fabricant dans son contrôle de production, sans tiers.' },
  documented: { label: 'Documenté', icon: 'file-text', cls: 'doc', def: "Appuyée sur une pièce (norme, fiche, rapport), sans contrôle d'un tiers." },
  declared: { label: 'Déclaré', icon: 'pencil-line', cls: 'decl', def: 'Déclarée par le fabricant, sous sa responsabilité, sans pièce.' },
  unverified: { label: 'Non vérifié', icon: 'circle-alert', cls: 'non', def: "La preuve attendue manque ou n'a pas pu être vérifiée." },
};

export const RUBRIQUES: { key: Rubrique; icon: string; tab: string; question: string }[] = [
  { key: 'identite', icon: 'box', tab: 'Identité', question: "Qu'est-ce que c'est ?" },
  { key: 'conformite', icon: 'shield-check', tab: 'Conformité', question: 'Est-ce conforme ?' },
  { key: 'impact', icon: 'leaf', tab: 'Impact', question: 'Quel impact ?' },
  { key: 'origine', icon: 'map-pin', tab: 'Origine', question: "D'où ça vient ?" },
  { key: 'usage', icon: 'hammer', tab: 'Usage', question: "Comment l'utiliser ?" },
  { key: 'fin-de-vie', icon: 'recycle', tab: 'Fin de vie', question: 'Et après ?' },
  { key: 'preuves', icon: 'badge-check', tab: 'Preuves', question: 'Toutes les preuves' },
  { key: 'historique', icon: 'history', tab: 'Historique', question: 'Historique du passeport' },
];

export const MATERIALS = {
  min: { label: 'Minéraux', hex: '#c98a2e' },
  met: { label: 'Métaux', hex: '#3565a8' },
  bois: { label: 'Bois et biosourcés', hex: '#3f8f4f' },
  pla: { label: 'Plastiques', hex: '#b8558f' },
  ver: { label: 'Verre', hex: '#35a6bd' },
  aut: { label: 'Autres', hex: '#6d62a8' },
} as const;

/** Nombre de jours entre la date de démo et une date ISO. */
export function daysUntil(iso?: string) {
  if (!iso) return Infinity;
  return Math.round((Date.parse(iso) - Date.parse(TODAY)) / 86400000);
}
export type Validity = 'ok' | 'warn' | 'crit';
export function validity(iso?: string): Validity {
  const d = daysUntil(iso);
  return d < 0 ? 'crit' : d <= 60 ? 'warn' : 'ok';
}
export function trust(p: Product) {
  const n = (s: VerificationStatus) => p.data.filter(d => d.provenance.status === s).length;
  return { tiers: n('third_party_verified'), total: p.data.length };
}
