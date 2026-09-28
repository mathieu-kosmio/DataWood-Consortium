# Maquette « Passeport produit bâtiment »

Maquette de démonstration cliquable d'un passeport numérique de produit de construction (DPP), relié au carnet numérique du bâtiment et à l'espace du fabricant qui le publie. Toutes les données sont fictives.

- Spécification : `111-DataWood-Consortium/Prototype/spec-maquette-passeport-produit-batiment.md`
- Écrans de référence : `111-DataWood-Consortium/Prototype/2026-09-26-ecrans-passeport-produit-batiment/`
- En ligne : `https://datawood.org/passeport/` (servie par le nginx du site, sous `/passeport/`)

Elle complète la maquette DataWood-X v0.7 (`/maquette/`), qui montre l'amont : comment la donnée se construit entre la scierie, le fabricant et l'acheteur. Celle-ci montre l'aval : le passeport lu sur le chantier, dans le bâtiment, et publié par le fabricant.

## Installation

```bash
cd passeport
npm install
npm run dev        # http://localhost:3100/passeport/
npm run build      # export statique dans out/
npm run lint
```

Next.js 14 (App Router, TypeScript strict), export statique (`output: 'export'`, `basePath: '/passeport'`, `trailingSlash: true`). Node 18.17 minimum.

Pour construire pendant que le serveur de développement tourne, isoler le dossier : `NEXT_DIST_DIR=.next-build npm run build` (l'export est alors dans `.next-build/`).

### Déploiement

Le `Dockerfile` du site construit la maquette dans une étape dédiée et copie `out/` dans `/usr/share/nginx/html/passeport`. La configuration nginx sert les pages exportées, met en cache les fichiers versionnés de `/_next/static/` et compresse les réponses.

## Le récit (démonstration en 12 étapes)

Depuis l'accueil, « Suivre le récit ». Le récit suit un panneau CLT et quatre personnes ; chaque étape dit son objectif, les gestes à faire et ce qu'on y gagne. Sur téléphone, un dock sous le pouce ; sur ordinateur, un rail à droite. Il n'avance qu'au geste attendu (événements dans `data/recit.json`, champ `completeOn`) ; « Passer l'étape » en applique le résultat.

| # | Acte · personnage | Écran | Geste |
| --- | --- | --- | --- |
| 1 | Réceptionner · Sami, chef de chantier | `/scan` | Toucher le produit reconnu (ou un QR de démonstration) |
| 2 | Réceptionner | `/p/03760000000011` | Toucher « Vérifié par un tiers » à côté du carbone |
| 3 | Réceptionner | `…/conformite` | Ouvrir « Est-ce conforme ? », repérer le PEFC qui expire dans 21 jours |
| 4 | Contrôler · Alex, contrôleur technique | passeport | « Je suis un professionnel », attestation Contrôleur technique |
| 5 | Contrôler | passeport | « Demander l'accès » à la maquette BIM, suivre le parcours, signer : contrat d'accès délivré |
| 6 | Contrôler | `…/conformite` | « Simuler la panne » (bouton du récit), puis rétablir |
| 7 | Contrôler | `…/origine` | Ouvrir « D'où ça vient ? », toucher l'étape Scierie |
| 8 | Exploiter · Nour, responsable technique | `/b/arceaux` | « Présent dans 1 bâtiment », lire les alertes |
| 9 | Exploiter | `/b/arceaux/inventaire` | Toucher « Panneaux CLT » dans le Sankey |
| 10 | Publier · Claire, responsable qualité | `/admin`, `/admin/studio/rpc` | Appliquer le PEFC renouvelé, glisser « Instructions de démontage » |
| 11 | Publier | `/admin/studio/rpc` | Onglet Négociation, créer le parcours du plan de dépose, publier la version 2.2 |
| 12 | Publier | `/admin/lots` | Cocher le lot 27-0124, générer les étiquettes |

Épilogue : `/architecture`, « Rejouer un scan ». Le catalogue fédéré (`/catalogue`) s'ouvre depuis l'accueil et depuis le passeport.

## Architecture démontrée : Simpl et contrats d'accès

La maquette suit l'architecture présentée par IMT Transfert (Data Space Lab) : un agent Simpl par participant, une autorité de gouvernance du réseau, un catalogue fédéré et un service commun de négociation qui délivre des contrats d'accès (DAC). Tout est simulé dans le navigateur.

- **Produit de données et éléments** : le passeport est un produit de données ; ses éléments (blocs du Studio, maquette BIM, plan de dépose) portent chacun trois règles : découverte (public, membres du réseau, autorité), accès (libre, sous contrat, fermé) et usage. Types dans `lib/types.ts` (`DataAsset`, `NegotiationWorkflow`, `DataAccessContract`).
- **Parcours de négociation** : le fabricant les compose dans l'onglet Négociation du Studio (attestation, projet, accord de confidentialité, déclaration, validation). Un élément sous contrat sans parcours bloque la publication. Données : `data/negotiation.json`.
- **Négociation côté demandeur** : dans le passeport, « Données sous contrat », puis « Demander l'accès ». Le demandeur franchit les étapes fixées par le fabricant et repart avec un contrat daté, visible aussi dans « Accès aux données » côté fabricant.
- **Catalogue fédéré** : `/catalogue`, produits de DataWood-X et DataBuilding-X, avec pour chaque élément sous contrat les étapes à franchir. Données : `data/catalog.json`.
- **Comment ça marche** : `/architecture` reprend le vocabulaire Simpl (agents, autorité de gouvernance, fournisseur d'application, service de négociation).

## Mode présentateur

- **Touche `D`** (ou le bouton en bas à droite) : panneau de démonstration. Couper ou rétablir chaque nœud du data space, régler sa latence, changer de profil, sauter à une étape du récit, tout remettre à zéro.
- Le certificateur (Institut Qualité Construction) est le nœud à couper : ses preuves passent en « dernière valeur connue », le reste du passeport tient.
- L'état (profil, nœuds, récit, espace fabricant) est gardé dans le navigateur (`localStorage`, clé `dwx-passeport`). Un scan dans un autre onglet rejoue l'animation de « Comment ça marche ».

## Organisation du code

```
app/                      routes (voir la spec § 4.1) ; styles/ : tokens et feuilles repris des écrans
components/dpp/           passeport : carte d'identité, feuilles de preuve, d'attestation et de négociation, rubriques
components/building/      carnet du bâtiment, Sankey
components/admin/         espace fabricant : tableau de bord, Studio, accès, lots
components/recit/         récit intégré (dock, rail, cercle sur l'élément à toucher)
components/demo/          accueil, scan, résolution GS1, panneau de démonstration
components/catalog/       catalogue fédéré
data/                     données fictives en JSON (produits, bâtiment, émetteurs, récit, gabarits, accès, négociation, catalogue)
lib/                      types, store (Zustand), simulateur de connecteurs, formats
public/docs/              PDF et fichier IFC de démonstration
```

## Écarts assumés avec la spécification

- **Pas de Recharts** : les graphiques (barres ACV, anneau, barre de positionnement, courbe) sont en SVG et CSS, comme dans les écrans de référence. Plus léger, et chaque graphique garde sa vue tableau.
- **Pas de shadcn/ui** : les feuilles (preuve, attestation, contrat, passeport latéral) s'appuient directement sur `@radix-ui/react-dialog`, avec les styles des écrans. Tailwind est configuré avec les tokens, sans préflight.
- **Tuiles OpenStreetMap passées en gris** : les tuiles CARTO demandent désormais une clé.
- **Anglais** : le sélecteur FR / EN est présent ; la traduction n'est pas faite (autorisé par la spec pour la carte d'identité, reste à faire).

## Contrôles effectués

- Récit complet joué automatiquement de bout en bout, sur 375 px et sur 1440 px : 12 étapes validées, aucune erreur console.
- 24 pages contrôlées aux deux tailles : aucune erreur, aucun défilement horizontal, aucun tiret cadratin.
- 21 interactions ciblées rejouées (feuilles, négociation avec et sans attestation, parcours, blocage de publication, glisser-déposer, catalogue, panne de nœud) : toutes conformes.
- Lighthouse mobile sur `/p/03760000000011/` : accessibilité 100, bonnes pratiques 100 ; performance 95 à 99 avec étranglement réseau réel (79 en mode simulé sur serveur local, artefact de la simulation quand tout se charge instantanément).
