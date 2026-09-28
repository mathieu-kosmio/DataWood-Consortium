
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
Coolify construit l'image à partir du `Dockerfile` (port 80) :
- **Site** (Vite) : `npm ci && npm run build`, sortie `dist/` ;
- **Maquette « Passeport produit bâtiment »** (Next.js, export statique) : `passeport/`, sortie `passeport/out/`, servie sous `/passeport/` (voir `passeport/README.md`) ;
- **Serveur** : nginx, configuré par `nginx.conf` (compression, cache des fichiers versionnés de la maquette).

## Arborescence du Savoir
- `manifesto.md` : Vision & raison d’être.
- `governance/` : Cadre collaboratif.
- `architecture/` : Spécifications techniques.
- `references/` : Glossaire et standards.
- `contribute/` : Guides pour les nouveaux membres.

---
*Ce projet est distribué sous licence CC BY-SA 4.0.*
