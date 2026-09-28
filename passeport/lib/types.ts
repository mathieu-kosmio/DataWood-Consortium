/* Modèle de données normatif (spec § 5). Aucune valeur n'est affichée sans sa provenance. */

export type VerificationStatus =
  | 'declared'              // Déclaré
  | 'documented'            // Documenté
  | 'controlled'            // Contrôlé
  | 'third_party_verified'  // Vérifié par un tiers
  | 'unverified';           // Non vérifié
export type Visibility = 'public' | 'professional' | 'authority';
export type Granularity = 'model' | 'batch' | 'item';
export type Network = 'DataWood-X' | 'DataBuilding-X';
export type Profile =
  | 'public' | 'prescriber' | 'contractor' | 'owner'
  | 'auditor' | 'authority' | 'deconstructor' | 'manufacturer';
export type Rubrique = 'identite' | 'conformite' | 'impact' | 'origine' | 'usage' | 'fin-de-vie' | 'preuves' | 'historique';

export interface Provenance {
  sourceNodeId: string;
  documentRef?: string;
  documentUrl?: string;
  standard?: string;
  status: VerificationStatus;
  verifierId?: string;
  issuedAt: string;
  validUntil?: string;
  covers?: string;
  notCovers?: string;
  signature?: { type: 'W3C-VC'; did: string; valid: boolean };
}

export interface DataPoint<T = number | string | boolean> {
  key: string;
  label: string;
  value: T;
  unit?: string;
  group?: string;
  method?: string;
  icon?: string;
  visibility: Visibility;
  granularity: Granularity;
  provenance: Provenance;
  benchmark?: { familyLabel: string; n: number; p10: number; median: number; p90: number };
  equivalent?: string;
}

export interface Certificate {
  id: string;
  kind: 'DoP' | 'CE' | 'product_standard' | 'certification' | 'management_system' | 'substances' | 'health_label';
  group: 'Réglementaire' | 'Produit' | 'Substances' | 'Santé' | 'Système de management';
  title: string;
  number: string;
  issuerId: string;
  scope: 'product' | 'site' | 'organisation';
  issuedAt: string;
  validUntil?: string;
  documentUrl: string;
  signature: { type: 'W3C-VC'; did: string; valid: boolean };
  visibility: Visibility;
  followUp?: string;
}

export interface SupplyChainStep {
  order: number;
  label: string;
  icon: string;
  place: string;
  lat: number;
  lng: number;
  actorId: string;
  date?: string;
  distanceKmFromPrevious?: number;
  certificates: string[];
  sourceNodeId: string;
  detail?: string;
  proof?: { title: string; number: string; validUntil: string; holderId: string };
}

export interface LifecycleEvent {
  date: string;
  type: 'manufactured' | 'delivered' | 'installed' | 'maintained' | 'replaced' | 'removed' | 'reused' | 'recycled' | 'passport_updated' | 'inventory' | 'handover';
  label: string;
  detail?: string;
  actorId: string;
  buildingId?: string;
}

export interface Impact {
  modules: { m: string; label: string; value: number; outOfCycle?: boolean }[];
  storedCO2?: number;
  lifecycleTotal: number;
  biobased: number;
  biobasedDetail: string;
  recycled: number;
  water: string;
}

/* Produit de données (Gaia-X) et éléments (assets, EDC) : chaque élément porte trois règles. */
export type Discovery = 'public' | 'members' | 'authority';
export type Access = 'open' | 'contract' | 'closed';
export type Usage = 'consultation' | 'reuse' | 'project';
export interface DataAsset {
  id: string;
  label: string;
  icon: string;
  format: string;
  size: string;
  discovery: Discovery;
  access: Access;
  usage: string;
  workflow: string;
  conditions: string[];
  block: string;
  file?: string;
}
export type StepType = 'attestation' | 'projet' | 'accord' | 'declaration' | 'validation';
export interface NegotiationWorkflow {
  id: string;
  name: string;
  assets: string[];
  usage: string;
  duration: string;
  steps: { type: StepType; param: string }[];
}
/** Contrat d'accès aux données (DAC) issu d'une négociation. */
export interface DataAccessContract {
  ref: string;
  gtin: string;
  asset: string;
  assetLabel: string;
  workflow: string;
  party: string;
  role: string;
  usage: string;
  until: string;
  signedAt: string;
}

export interface Product {
  gtin: string;
  batch?: string;
  name: string;
  manufacturerId: string;
  family: string;
  granularity: Granularity;
  image: string;
  imagePosition?: string;
  functionalUnit: string;
  passportVersion: string;
  passportStatus: 'draft' | 'published' | 'superseded' | 'withdrawn';
  newerVersion?: { version: string; date: string };
  updatedAt: string;
  description: string;
  intendedUse: string[];
  keyIndicators: string[];
  summaries: Record<Exclude<Rubrique, 'preuves' | 'historique'>, string>;
  data: DataPoint[];
  certificates: Certificate[];
  supplyChain: SupplyChainStep[];
  impact: Impact;
  usage: {
    installGuideUrl: string;
    maintenancePlan: { every: string; task: string }[];
    compatibleWith: string[];
    warrantyYears: number;
    pro: { label: string; value: string }[];
  };
  endOfLife: {
    dismantlability: 'easy' | 'medium' | 'hard';
    dismantlabilityNote: string;
    reusePotential: 'high' | 'medium' | 'low';
    reuseNote: string;
    steps: { icon: string; text: string }[];
    outlets: { name: string; type: 'reuse' | 'recycling' | 'energy'; lat: number; lng: number; distanceKm: number; place: string }[];
    eprScheme?: string;
    eprIssuerId?: string;
  };
  events: LifecycleEvent[];
  buildings: string[];
  versions: { version: string; date: string; author: string; changes: string[] }[];
  assets?: DataAsset[];
}

export type MaterialFamily = 'min' | 'met' | 'bois' | 'pla' | 'ver' | 'aut';

export interface BuildingComponent {
  productName: string;
  gtin?: string;
  lot: 'Enveloppe' | 'Structure' | 'Systèmes' | 'Second œuvre';
  quantity: string;
  massTonnes: number;
  mainMaterial: string;
  family: MaterialFamily;
  installedAt?: string;
  installedBy?: string;
  where?: string;
  materials: { family: MaterialFamily; tonnes: number }[];
}

export interface Building {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  typology: string;
  yearBuilt: number;
  usage: string;
  floorAreaM2: number;
  climateZone: string;
  image: string;
  ownerId: string;
  network: Network;
  carbonTonnes: number;
  reuseShare: number;
  components: BuildingComponent[];
  events: (LifecycleEvent & { icon: string })[];
  alerts: { level: 'info' | 'warning' | 'critical'; title: string; text: string; gtin?: string }[];
}

export interface Issuer {
  id: string;
  name: string;
  initials: string;
  role: 'manufacturer' | 'supplier' | 'forest_owner' | 'certifier' | 'epr_scheme' | 'building_owner';
  roleLabel: string;
  place: string;
  did: string;
  network: Network;
  connector: { nodeId: string; latencyMs: number; online: boolean };
}

export interface Act { n: 1 | 2 | 3 | 4; title: string; who: string; role: string; org: string; initials: string; profile: Profile; pitch: string }

export interface RecitStep {
  n: number;
  act: 1 | 2 | 3 | 4;
  title: string;
  route: string;
  objective: string;
  todo: string[];
  gain: string;
  plain?: [string, string];
  underTheHood?: string;
  demoAction?: string;
  target: (string | null)[];
  completeOn: string[];
}
