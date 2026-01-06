
# DataWood Consortium - Documentation

Ce projet est la référence officielle du **DataWood Consortium**, un commun numérique dédié à la filière forêt-bois.

## Stack Technique
- **React 18 + TypeScript** (Moteur de rendu du portail)
- **Tailwind CSS** (Design sobre et institutionnel)
- **Sveltia CMS** (Interface de contribution Git-based)
- **Markdown** (Format source de la connaissance)

## Contribution
Le site est conçu comme un commun ouvert. 

### Contribution Non-Technique
Accédez à l'interface `/admin` (configurée via Sveltia CMS) pour éditer les pages directement dans votre navigateur. Les modifications seront soumises via des commits Git sur la branche `main`.

### Contribution Technique
1. Clonez le dépôt.
2. Installez les dépendances : `npm install`.
3. Lancez le serveur de développement : `npm run dev`.

## Déploiement sur Coolify
Ce projet est prêt pour un build statique et un déploiement sur Coolify.

**Configuration recommandée dans Coolify :**
- **Type :** Static Site
- **Build Command :** `npm install && npm run build`
- **Output Directory :** `dist`
- **Port :** 80

## Arborescence du Savoir
- `manifesto.md` : Vision & raison d’être.
- `governance/` : Cadre collaboratif.
- `architecture/` : Spécifications techniques.
- `references/` : Glossaire et standards.
- `contribute/` : Guides pour les nouveaux membres.

---
*Ce projet est distribué sous licence CC BY-SA 4.0.*
