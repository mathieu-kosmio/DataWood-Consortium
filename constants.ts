import { NavItem, DocPage } from './types';

export const NAVIGATION: NavItem[] = [
  { title: 'Accueil', path: '/' },
  { title: 'Le Projet', path: '/le-projet' },
  { title: 'Gouvernance', path: '/le-consortium' },
  // { title: 'Travaux & Livrables', path: '/travaux' },
  { title: 'Feuille de Route', path: '/feuille-de-route' },
  { title: 'Rejoindre', path: '/rejoindre' },
  { title: 'Journal', path: '/blog' },
  { title: 'Ressources', path: '/ressources' },
];

export const PAGES: Record<string, DocPage & { file: string }> = {
  '/': {
    id: 'home',
    path: '/',
    file: '/docs/home.md',
    metadata: {
      title: 'DataWood Consortium',
      description: 'Site institutionnel de commun numérique.',
      status: 'stable',
      version: '2.0',
      lastUpdated: '2024-06-01',
      contributors: []
    },
    content: ''
  },
  '/le-projet': {
    id: 'le-projet',
    path: '/le-projet',
    file: '/docs/le-projet.md',
    metadata: {
      title: 'Le Projet',
      description: 'Contexte, objectifs et missions.',
      status: 'stable',
      version: '1.0',
      lastUpdated: '2024-06-01',
      contributors: []
    },
    content: ''
  },
  '/le-consortium': {
    id: 'le-consortium',
    path: '/le-consortium',
    file: '/docs/le-consortium.md',
    metadata: {
      title: 'Le Consortium',
      description: 'Gouvernance, partenaires et charte.',
      status: 'stable',
      version: '1.0',
      lastUpdated: '2024-06-01',
      contributors: []
    },
    content: ''
  },
  '/travaux': {
    id: 'travaux',
    path: '/travaux',
    file: '/docs/travaux.md',
    metadata: {
      title: 'Travaux & Livrables',
      description: 'État de l\'art, Wiki et Cartographies.',
      status: 'stable',
      version: '1.0',
      lastUpdated: '2024-06-01',
      contributors: []
    },
    content: ''
  },
  '/feuille-de-route': {
    id: 'feuille-de-route',
    path: '/feuille-de-route',
    file: '/docs/feuille-de-route.md',
    metadata: {
      title: 'Feuille de Route',
      description: 'Planning prévisionnel et jalons.',
      status: 'stable',
      version: '1.0',
      lastUpdated: '2024-06-01',
      contributors: []
    },
    content: ''
  },
  '/blog': {
    id: 'blog',
    path: '/blog',
    // file: null, // Dynamic
    metadata: {
      title: 'Le Blog',
      description: 'Actualités et perspectives du consortium.',
      status: 'stable',
      version: '1.0',
      lastUpdated: '2024-06-01',
      contributors: []
    },
    content: ''
  },
  '/rejoindre': {
    id: 'rejoindre',
    path: '/rejoindre',
    file: '/docs/rejoindre.md',
    metadata: {
      title: 'Rejoindre & Contribuer',
      description: 'Comment participer à l\'aventure.',
      status: 'stable',
      version: '1.0',
      lastUpdated: '2024-06-01',
      contributors: []
    },
    content: ''
  },
  '/ressources': {
    id: 'ressources',
    path: '/ressources',
    file: '/docs/ressources.md',
    metadata: {
      title: 'Ressources Documentaires',
      description: 'Documents publics et bibliographie.',
      status: 'stable',
      version: '1.0',
      lastUpdated: '2024-06-01',
      contributors: []
    },
    content: ''
  }
};
