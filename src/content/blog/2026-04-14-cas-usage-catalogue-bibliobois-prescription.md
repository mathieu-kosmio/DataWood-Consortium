---
title: "Catalogue Bois Construction, Bibliobois, DE Bois : industrialiser la prescription bois"
password: datawood-partenaires
date: 2026-04-14T08:20:00
author: DataWood Team
image: /img/dataspace-foret-bois.png
description: >
  Un architecte qui veut prescrire du bois passe aujourd'hui par plusieurs
  bibliothèques, plusieurs référentiels et plusieurs formats incompatibles.
  Catalogue Bois Construction, Bibliobois et les DE Bois existent — ce qui
  manque, c'est leur articulation. Troisième cas d'usage du DataWood
  Consortium, construit en complémentarité avec le passeport produit BIM (CU2).
tags:
  - Cas d'usage
  - Catalogue Bois Construction
  - Bibliobois
  - DE Bois
  - DTA
  - ATEx
  - Prescription
  - FCBA
  - CODIFAB
  - CSTB
  - FBF
  - DataWood Consortium
---

> **Cette fiche est l'un des cinq cas d'usage « mature » qui émergent des échanges conduits dans le cadre du DataWood Consortium. Elle n'est pas un projet figé : c'est une piste de travail partagée, ouverte à contribution pour préciser le besoin, chiffrer l'effort et construire un dépôt collectif.**
>
> *Version 2.0 — 15 avril 2026. Structurée selon la trame commune DataWood.*

## Pitch exécutif

**Problème filière.** La prescription bois coûte plus cher en temps qu'une prescription béton ou acier équivalente. Ce surcoût pèse directement sur la pénétration du bois dans la construction — alors même que les ressources existent.

**Ce que le Dataspace apporte.** Un cadre d'interopérabilité entre **Catalogue Bois Construction**, **Bibliobois**, **DE Bois / DTA / ATEx** et les bibliothèques BIM — sans créer un n-ième portail, mais en rendant les trois faces d'un même dispositif cohérentes et consultables depuis les outils métier des concepteurs.

**Bénéficiaires principaux.** Architectes, économistes de la construction, bureaux d'études bois, éditeurs CAO/BIM, industriels contributeurs de FDES.

**Briques existantes mobilisables.** Catalogue Bois Construction (FCBA / CODIFAB / FBF), Bibliobois, DE Bois / DTA / ATEx (CSTB / FCBA), BIM 2023, FDES / INIES, bibliothèques éditeurs.

**Prochain jalon.** Précision du périmètre de convergence (articulation vs fusion) au T3 2026, en articulation avec le CU2 Passeport produit & BIM.

## Le constat qui fait consensus

Côté prescription, le bois a un paradoxe : il n'a jamais eu autant de ressources disponibles — référentiels techniques, solutions constructives documentées, FDES, bibliothèques BIM — et pourtant un architecte, un économiste de la construction ou un bureau d'études qui veut prescrire une solution bois doit composer avec :

- Plusieurs bibliothèques (Bibliobois côté produits bois, Catalogue Bois Construction côté solutions constructives, bibliothèques éditeurs côté objets BIM, bases marques de massif côté origine).
- Plusieurs formats et plusieurs niveaux de maturité numérique.
- Des documents d'évaluation technique (DE Bois, DTA, ATEx) encore largement consultés au format PDF, peu exploitables directement en phase de conception.
- Des FDES et données environnementales disponibles, mais pas toujours reliées aux objets BIM ni à la prescription courante.

Conséquence : la prescription bois coûte plus cher en temps qu'une prescription béton ou acier équivalente, ce qui pèse directement sur la pénétration du bois dans la construction.

## L'existant : ce qui fonctionne déjà

Ce cas d'usage est mature parce que les composants sont là :

- **Catalogue Bois Construction** (FCBA, financé par FBF et CODIFAB) — couverture croissante des solutions techniques, progression vers une logique BIM, gouvernance FCBA/CODIFAB/FBF installée.
- **Bibliobois** — historique côté produit, naturellement complémentaire du Catalogue côté « produit ».
- **DE Bois, DTA, ATEx** — corpus précieux produit par le CSTB et le FCBA, aujourd'hui encore très peu exploité numériquement malgré une forte valeur ajoutée pour les BE et les assureurs.
- **Bibliothèques BIM** — Catalogue Bois Construction, BIM 2023 (CODIFAB/FCBA/EnerBIM/Axiocode, plugin Revit gratuit), bibliothèques marques de massif en cours, bibliothèques éditeurs.
- **FDES et base INIES** — corpus existant, gouvernance publique, reliable aux objets via identifiants normalisés.
- **Économistes de la construction et BE bois** — demandeurs explicites d'un accès unifié, aujourd'hui contraints de naviguer entre plusieurs sources.

Point-clé : **il ne manque pas de contenu, il manque de l'articulation**. Le Dataspace ne recrée pas un portail, il définit le cadre qui fait que les briques existantes se branchent entre elles.

## L'apport du Dataspace à ce sujet ⭐

### 1. Souveraineté & neutralité

Catalogue Bois Construction, Bibliobois, DE Bois et FDES sont des **ressources publiques ou para-publiques** financées collectivement (FBF, CODIFAB, État, CSTB). L'enjeu politique est d'éviter qu'une de ces ressources soit captée, sous couvert de « portail unique », par un acteur propriétaire — éditeur de logiciel, centrale d'achat, plateforme SaaS. Un dataspace garantit que chaque producteur de contenu (FCBA, CSTB, industriels) reste propriétaire de son contenu et contrôle les usages, tout en permettant son exposition numérique opposable.

### 2. Interopérabilité fédérée

Le verrou n'est pas technique (l'enrichissement BIM fonctionne déjà côté BIM Bois Box, et les FDES sont structurées dans INIES) — il est dans **l'absence d'un identifiant commun** entre produits, solutions constructives, documents d'évaluation et FDES. Un dataspace apporte : (i) un schéma d'identifiants partagé, (ii) une ontologie filière minimaliste, (iii) une API de fédération permettant à un logiciel CAO/BIM de requêter l'ensemble via une même logique — sans que chaque brique ait à négocier avec chaque éditeur.

### 3. Conformité réglementaire embarquée

La prescription bois est tirée par **RE2020** (donnée carbone produit opposable), renforcée par le **CPR révisé** (déclaration de performance) et le **DPP** à venir. Ces obligations rendent la mise en cohérence Catalogue / Bibliobois / DE Bois / FDES non plus optionnelle mais **nécessaire**. Sans cadre commun, chaque bureau d'études subit individuellement le coût de la réconciliation ; avec un dataspace, la filière le mutualise.

## Ce que les autres acteurs en disent

**FCBA.** Opérateur historique du Catalogue Bois Construction et partie prenante des DE Bois ; position centrale pour orchestrer la convergence. La lecture FCBA (cf. CU1 et CU2) privilégie VEM et INIES comme piliers « économie-environnement » — cette lecture est **complémentaire** et non concurrente : INIES est le pilier environnemental aval, le Dataspace permet de l'articuler avec les référentiels techniques (Catalogue, DE) et l'amont (FORETDATA).

**CSTB.** Producteur des DE Bois, DTA et ATEx ; partenaire nécessaire pour la digitalisation de ces documents d'évaluation — chantier identifié depuis plusieurs années mais à prioriser.

**CODIFAB.** Co-financeur historique, ancrage industriels transformation ; participation essentielle à la gouvernance pour éviter tout doublon avec les bibliothèques éditeurs.

**Économistes de la construction et BE bois.** Demande explicite d'un accès unifié, aujourd'hui très peu représentés dans la gouvernance des ressources filière — à intégrer dans le comité de pilotage.

**Éditeurs CAO/BIM (Autodesk, Graphisoft, CADWork, BIM Bois Box).** Se brancheront à la condition qu'un contrat d'interopérabilité clair et opposable soit publié.

## Gouvernance proposée

- **Tiers de confiance opérateur pressenti** : co-animation FCBA + CODIFAB sur une base juridique à préciser (GIE, association loi 1901, intégration dans une entité existante). À arbitrer.
- **Comité de pilotage multi-acteurs** : représentation filière ≥ 50 % des droits de vote, associant FCBA, CODIFAB, FBF, CSTB, représentants d'architectes (Ordre, UNSFA), économistes de la construction (UNTEC), BE bois.
- **Conventions d'usage différenciées** : accès libre pour la consultation prescripteur ; licence pour les éditeurs CAO/BIM se branchant à l'API de fédération ; contribution industriels (FDES, fiches produits) avec gouvernance partagée.
- **Clause d'ouverture** : accès tiers non-membres à conditions transparentes.

## Standards & conformité mobilisés

| Standard | Rôle dans le CU3 |
|---|---|
| Gaia-X / DSSC Blueprint | Socle d'architecture dataspace fédérée |
| IFC / OpenBTHX | Interopérabilité BIM (articulation avec CU2) |
| Identifiants produits filière | À définir / harmoniser (Catalogue / Bibliobois / FDES) |
| FDES / base INIES | Donnée environnementale produit |
| RE2020 / CPR révisé | Moteurs réglementaires côté prescription aval |
| DPP | Convergence moyen terme vers passeport produit (CU2) |

## Questions ouvertes & appel à contribution

- Quel bon niveau de convergence entre Catalogue Bois Construction et Bibliobois : articulation, fusion fonctionnelle, ou simple référentiel partagé ?
- Comment rendre les DE Bois et documents d'évaluation technique exploitables numériquement sans dévaloriser leur portée réglementaire ?
- Quelle place pour les bibliothèques marques de massif dans ce paysage, et comment éviter les doublons avec les bibliothèques éditeurs ? (Articulation directe avec CU2.)
- Quel modèle économique pour la maintenance et l'enrichissement continu de ces ressources ?
- Comment embarquer les économistes de la construction et les BE, qui sont les vrais utilisateurs finaux au stade prescription ?

Si vous êtes architecte, économiste de la construction, BE bois, éditeur CAO/BIM, industriel contributeur de FDES, ou porteur d'une bibliothèque existante, **votre regard est précieux**. 👉 Contactez l'équipe DataWood Consortium.

---

## Annexe — Matrice consortium *(document de travail partenaires)*

*Pré-matrice d'un dossier de financement consortium (dispositif à arbitrer). Éléments indicatifs.*

### Workpackages envisageables

| WP | Intitulé | Livrables attendus | Lead pressenti | Durée |
|----|---|---|---|---|
| WP1 | Spécification & référentiel commun | Identifiants partagés, mapping Catalogue ↔ Bibliobois ↔ DE Bois ↔ FDES, règles d'alignement | FCBA | 6 mois |
| WP2 | Digitalisation DE Bois / DTA / ATEx | Schéma d'exposition numérique des documents d'évaluation, mapping vers objets BIM | CSTB + FCBA | 9 mois |
| WP3 | API de fédération & connecteurs CAO/BIM | API de requête unifiée, plugin de référence (Revit ou ArchiCAD), documentation éditeurs | CODIFAB + FCBA + éditeur pilote | 9 mois |
| WP4 | Intégration & tests pilotes | 3-5 agences d'architecture et BE pilotes, benchmark temps de prescription | BE pilote + Ordre/UNTEC | 6 mois |
| WP5 | Pérennisation & articulation CU2 | Modèle économique, intégration avec passeport produit BIM (CU2), plan déploiement | Coordination + tiers de confiance | 4 mois |

### Consortium pressenti *(≤ 6 partenaires phase dev)*

| Rôle | Partenaire pressenti | Légitimité / apport | Statut échange |
|---|---|---|---|
| Coordinateur | Xylofutur + Kosmio (appui méthodologique) | Animation filière, méthodologie dataspace | Opérationnel |
| Référent technique & référentiel | FCBA | Opérateur Catalogue Bois Construction, BIM 2023 | RDV 20/04/2026 |
| Référent documents d'évaluation | CSTB | DE Bois / DTA / ATEx, légitimité réglementaire | À engager |
| Co-animation industrielle | CODIFAB | Co-financeur historique, ancrage industriels | À engager |
| Éditeur CAO/BIM pilote | Autodesk ou Graphisoft (ou BIM Bois Box comme pilote open source) | Implémentation plugin / connecteur | À identifier |
| BE pilote | UNTEC ou Ingénierie Bois (FIBC) | Validation usage prescripteur, benchmark | À identifier |

Partenaires associés : Ordre des architectes, UNSFA, industriels contributeurs FDES, Lisa Degalle (Codifab — études économiques filière, contact ouvert).

### Modèle économique & route vers pérennité

*À ce stade, aucune décision sur la source de financement. Leviers à instruire.*

- **Phase projet — leviers à instruire** : cofinancements FBF / CODIFAB dans la continuité des financements Catalogue Bois Construction et Bibliobois ; AAP nationaux (hypothèse à confirmer) ; contributions en nature CSTB et FCBA ; possibilité d'un adossement au programme FCBA Chaîne numérique 18RD1023.
- **Phase opérationnelle (auto-financement cible H+36 mois)** : licences éditeurs CAO/BIM, refacturation MOA publiques pour services d'intérêt général, contributions industriels, maintien des financements publics pour la partie ressource d'intérêt général (DE Bois, corpus FCBA).
- **Hypothèse de seuil** : bascule à 3-5 éditeurs CAO/BIM connectés + ~200 BE et agences d'architecture utilisateurs actifs.
- **Clause d'ouverture** : consultation prescripteur libre, contributions tiers à conditions transparentes.

### Impact filière & KPI quantifiés *(à chiffrer avec les partenaires)*

- **Création / répartition de valeur** : heures de prescription évitées par projet bois (benchmark avant/après) ; effet sur la pénétration du bois dans la construction neuve RE2020 ; ROI agences d'architecture et BE.
- **Volumes de données partagées** : nombre de solutions constructives accessibles via API unifiée, nombre de DE Bois digitalisés, nombre de projets BIM alimentés.
- **Conformité réglementaire** : couverture RE2020 sur données carbone produit bois ; couverture CPR révisé ; alignement DPP à H+36.
- **Impact environnemental** : part de marché RE2020 captée par des solutions bois grâce à la baisse du coût de prescription, check DNSH.
- **Formation professionnelle** : nombre d'agences et de BE formés à l'usage de l'API et du plugin de référence.

### Budget indicatif & calendrier

- **Enveloppe CU3** : **300 à 400 k€** sur 30 mois. CU3 est positionné en bas de fourchette : périmètre plus étroit (concepteurs amont de l'acte de construire), ROI moins immédiat pour les acteurs économiques (valeur portée par le public et les ressources filière), forte mutualisation possible avec CU2 sur les briques BIM. L'effort principal porte sur le référentiel commun (WP1) et la digitalisation DE Bois (WP2).
- **Répartition indicative** : WP1 ~25 %, WP2 ~30 %, WP3 ~25 %, WP4 ~15 %, WP5 ~5 %.
- **Durée projet** : 30 mois.
- **Jalon consortium** : précision périmètre et partenaires T3 2026 ; arbitrage vecteur de financement à la même échéance.
- **Articulation CU2** : à traiter en interfaces partagées — éviter le doublon en phase de cadrage.

---

*Cette fiche sera ajustée après les échanges FCBA (20/04/2026) et les premiers contacts CSTB.*
