
import { NavItem, DocPage } from './types';

export const NAVIGATION: NavItem[] = [
  { title: 'Accueil', path: '/' },
  { title: 'Manifeste', path: '/manifesto' },
  {
    title: 'Gouvernance',
    children: [
      { title: 'Présentation', path: '/governance' },
      { title: 'Rôles & Responsabilités', path: '/governance/roles' },
      { title: 'Processus de décision', path: '/governance/decision-process' },
      { title: 'Licences & Propriété', path: '/governance/licensing' },
    ]
  },
  {
    title: 'Architecture',
    children: [
      { title: 'Vue d\'ensemble', path: '/architecture' },
      { title: 'Modèle de données', path: '/architecture/data-model' },
      { title: 'Interopérabilité', path: '/architecture/interoperability' },
      { title: 'Sécurité', path: '/architecture/security' },
    ]
  },
  {
    title: 'Références',
    children: [
      { title: 'Glossaire', path: '/references/glossary' },
      { title: 'Standards', path: '/references/standards' },
    ]
  },
  {
    title: 'Contribuer',
    children: [
      { title: 'Comment contribuer', path: '/contribute' },
      { title: 'Guide éditorial', path: '/contribute/editorial-guide' },
    ]
  }
];

export const PAGES: Record<string, DocPage> = {
  '/': {
    id: 'home',
    path: '/',
    metadata: {
      title: 'DataWood Consortium',
      description: 'Référence officielle du commun numérique pour la filière forêt-bois.',
      status: 'stable',
      version: '1.0',
      lastUpdated: '2024-05-20',
      contributors: ['DataWood Core Team']
    },
    content: `
# Bienvenue sur le portail de documentation du DataWood Consortium

Le **DataWood Consortium** est un commun numérique dédié à la traçabilité, l'interopérabilité et la valorisation des données de la filière forêt-bois.

## Notre Vision
Face aux enjeux climatiques et de souveraineté industrielle, la filière forêt-bois doit se doter d'outils de partage de données robustes, ouverts et pérennes. 

## Structure de la documentation
- **Manifeste** : Notre raison d'être et nos principes fondateurs.
- **Gouvernance** : Comment nous collaborons et décidons ensemble.
- **Architecture** : Spécifications techniques et modèles de données.
- **Références** : Glossaires et standards du secteur.
- **Contribuer** : Rejoignez le mouvement et aidez-nous à enrichir ce commun.
    `
  },
  '/manifesto': {
    id: 'manifesto',
    path: '/manifesto',
    metadata: {
      title: 'Manifeste du Consortium',
      description: 'Vision et raison d’être du projet.',
      status: 'stable',
      version: '1.0',
      lastUpdated: '2024-05-20',
      contributors: ['DataWood Core Team']
    },
    content: `
# Manifeste du DataWood Consortium

Nous croyons que la donnée est un levier majeur de transformation pour la filière forêt-bois, à condition qu'elle soit gérée comme un **commun**.

## Nos Principes
1. **Ouverture** : La documentation et les standards sont accessibles à tous.
2. **Interopérabilité** : Nous favorisons les échanges fluides entre les acteurs.
3. **Neutralité** : Le consortium est une entité neutre servant l'intérêt général.
4. **Souveraineté** : Les acteurs gardent le contrôle de leurs données stratégiques.

## Engagement Long Terme
Le consortium s'engage à maintenir ces ressources sur le long terme pour garantir la stabilité des systèmes d'information de la filière.
    `
  },
  '/governance': {
    id: 'gov-index',
    path: '/governance',
    metadata: {
      title: 'Gouvernance',
      description: 'Cadre collaboratif du consortium.',
      status: 'stable',
      version: '1.0',
      lastUpdated: '2024-05-20',
      contributors: ['Gouvernance Circle']
    },
    content: `
# Gouvernance du Consortium

La gouvernance du DataWood Consortium repose sur les principes de la sociocratie et des communs numériques.

## Instances
- **Cercle de Pilotage** : Orientation stratégique.
- **Groupes de Travail (GT)** : Production technique et thématique.
- **Assemblée des Communs** : Consultation large des contributeurs.

Consultez les pages dédiées pour plus de détails sur les rôles et les processus de décision.
    `
  },
  '/architecture': {
    id: 'arch-index',
    path: '/architecture',
    metadata: {
      title: 'Architecture Technique',
      description: 'Fondations techniques du système.',
      status: 'draft',
      version: '0.9',
      lastUpdated: '2024-05-22',
      contributors: ['Tech Working Group']
    },
    content: `
# Architecture et Standardisation

L'architecture du DataWood Consortium vise à créer une couche d'abstraction permettant l'échange de données de traçabilité.

## Principes Directeurs
- **Decoupled by Design** : Séparation stricte entre transport et format.
- **API-First** : Toute fonctionnalité est exposée via une interface standardisée.
- **Linked Data** : Utilisation des technologies du Web Sémantique (RDF/JSON-LD).
    `
  }
};
