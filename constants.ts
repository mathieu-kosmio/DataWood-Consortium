
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
      { title: 'Comment contribuer', path: '/contributing' },
      { title: 'Guide éditorial', path: '/contribute/editorial-guide' },
    ]
  }
];

export const PAGES: Record<string, DocPage & { file: string }> = {
  '/': {
    id: 'home',
    path: '/',
    file: '/docs/home.md',
    metadata: {
      title: 'DataWood Consortium',
      description: 'Référence officielle du commun numérique pour la filière forêt-bois.',
      status: 'stable',
      version: '1.0',
      lastUpdated: '2024-05-20',
      contributors: ['DataWood Core Team']
    },
    content: '' // Loaded dynamically
  },
  '/manifesto': {
    id: 'manifesto',
    path: '/manifesto',
    file: '/docs/manifesto.md',
    metadata: {
      title: 'Manifeste du Consortium',
      description: 'Vision et raison d’être du projet.',
      status: 'stable',
      version: '1.0',
      lastUpdated: '2024-05-20',
      contributors: ['DataWood Core Team']
    },
    content: ''
  },
  '/governance': {
    id: 'gov-index',
    path: '/governance',
    file: '/docs/gov-index.md',
    metadata: {
      title: 'Gouvernance',
      description: 'Cadre collaboratif du consortium.',
      status: 'stable',
      version: '1.0',
      lastUpdated: '2024-05-20',
      contributors: ['Gouvernance Circle']
    },
    content: ''
  },
  '/architecture': {
    id: 'arch-index',
    path: '/architecture',
    file: '/docs/arch-index.md',
    metadata: {
      title: 'Architecture Technique',
      description: 'Fondations techniques du système.',
      status: 'draft',
      version: '0.9',
      lastUpdated: '2024-05-22',
      contributors: ['Tech Working Group']
    },
    content: ''
  },
  '/contributing': {
    id: 'contributing',
    path: '/contributing',
    file: '/docs/gov-index.md', // Placeholder/Reuse for demo if no specific file yet
    metadata: {
      title: 'Comment contribuer',
      description: 'Guide du contributeur.',
      status: 'stable',
      version: '1.0',
      lastUpdated: '2024-05-20',
      contributors: ['Community']
    },
    content: ''
  }
};
