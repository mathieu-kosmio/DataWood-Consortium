---
title: "eMOBOIS : élargir le standard d'interopérabilité amont qui existe déjà"
password: datawood-partenaires
date: 2026-04-14T08:30:00
author: DataWood Team
image: /img/dataspace-foret-bois-kos.png
description: >
  Entre exploitants forestiers, transporteurs et scieries, les échanges
  d'informations d'approvisionnement passent déjà par eMOBOIS. Plutôt
  que d'inventer un nouveau format, le DataWood Consortium peut s'appuyer
  sur ce standard éprouvé, l'étendre aux nouvelles obligations (RDUE,
  certifications, carbone) et lever le blocage politique qui freine sa
  généralisation. Quatrième cas d'usage.
tags:
  - Cas d'usage
  - eMOBOIS
  - papiNet
  - Interopérabilité
  - Standards
  - Scieries
  - Exploitants forestiers
  - Approvisionnement
  - RDUE
  - Amont
  - DataWood Consortium
---

> **Cette fiche est l'un des cinq cas d'usage « mature » qui émergent des échanges conduits dans le cadre du DataWood Consortium. Elle n'est pas un projet figé : c'est une piste de travail partagée, ouverte à contribution pour préciser le besoin, chiffrer l'effort et construire un dépôt collectif.**
>
> *Version 2.1 — 15 avril 2026. Positionnement GIP ATGeRi consolidé en co-lead métier filière & opérateur amont (en articulation avec CU1), FNB et coopératives (David Portron) explicités en co-leads métier filière (PME scieries + acteurs forestiers), FCBA recadré en appui technique et scientifique.*

## Pitch exécutif

**Problème filière.** Le coût de la donnée amont n'est pas dans la donnée elle-même — elle existe — mais dans les ressaisies, erreurs et pertes d'information au passage d'un maillon à l'autre (bord de route → camion → cour à bois → scierie → client). Le standard eMOBOIS résout ce problème, mais son adoption est bloquée non par la technique, mais par un défaut d'alignement politique collectif.

**Ce que le Dataspace apporte.** Un cadre fédéré qui **élargit eMOBOIS** (géolocalisation RDUE, certifications, carbone, lien DPP) et qui **lève le blocage politique** — en mutualisant la charge d'amorçage et en garantissant la neutralité d'arbitrage. Le consensus constaté en réunion ONF du 11/03/2026 est net : *l'enjeu n'est pas technique mais stratégique et politique*.

**Bénéficiaires principaux.** Petites scieries et PME d'exploitation (gain de ressaisie, outillage RDUE mutualisé), coopératives forestières, transporteurs, éditeurs d'ERP scieries, donneurs d'ordre industriels.

**Briques existantes mobilisables.** eMOBOIS (standard filière historique), papiNet (standard international forêt-bois-papier), FORETDATA (démonstration opérationnelle eMOBOIS en Nouvelle-Aquitaine via Chaîne numérique), chaînes de certification PEFC / FSC.

**Moteur réglementaire.** RDUE au 30/12/2026 impose géolocalisation et attestation — eMOBOIS est le candidat naturel pour transporter cette information sans reconstruction ad hoc.

## Le constat qui fait consensus

À la charnière forêt / première transformation, les flux d'approvisionnement mobilisent chaque jour contrats, bons de livraison, mesures (volume, essence, qualité), informations de traçabilité (origine parcelle, lot, certification) et données de transport. Chaque acteur — exploitant, transporteur, scierie, coopérative, donneur d'ordre industriel — a historiquement structuré ces informations à sa manière : tableurs internes, ERP propriétaires, formats PDF transmis par mail, ressaisies à chaque étape.

Le coût n'est pas dans la donnée elle-même — elle existe — mais dans les **ressaisies, erreurs et pertes d'information** au passage d'un maillon à l'autre. Cette perte pèse directement sur la **conformité RDUE**, les **certifications PEFC/FSC**, et la capacité à documenter l'**impact carbone réel**.

## L'existant : ce qui fonctionne déjà

- **eMOBOIS** — standard d'échange approvisionnement bois, historique filière, implanté chez plusieurs éditeurs d'ERP scierie et chez les grands donneurs d'ordre. Couvre les cas d'usage contractuels, logistiques et de mesure.
- **papiNet** — standard international forêt-bois-papier intégré dans l'extension FORETDATA / Chaîne numérique ; complète eMOBOIS côté échange machines forestières et flux papier/pâte.
- **FORETDATA / Chaîne numérique** (cf. CU1) — intègre déjà eMOBOIS pour l'approvisionnement, démonstration opérationnelle en Nouvelle-Aquitaine. Prouve que l'articulation eMOBOIS ↔ plateforme filière ↔ observatoire public fonctionne.
- **Chaînes de certification PEFC / FSC** — reposent sur des chaînes de contrôle qui peuvent être alimentées par les mêmes flux, sous réserve d'extension des champs.
- **Observatoires forestiers** — IGN, ONF, Observatoire des forêts françaises, dispositifs régionaux — gagneraient à un flux eMOBOIS consolidé pour des indicateurs de sortie de forêt à jour.

## L'apport du Dataspace à ce sujet ⭐

### 1. Souveraineté & neutralité

eMOBOIS est aujourd'hui maintenu par une gouvernance filière qu'il ne s'agit pas de reprendre. Ce qu'un dataspace ajoute, c'est une **couche de gouvernance pour les extensions** (RDUE, certifications, carbone, lien DPP) — arbitrages multi-acteurs, neutralité vis-à-vis des éditeurs d'ERP, garantie que les petites scieries et coopératives peuvent peser autant que les grands donneurs d'ordre. Sans cette neutralité, les extensions risquent d'être captées par les acteurs ayant les moyens techniques immédiats.

### 2. Interopérabilité fédérée

Le dataspace apporte deux briques manquantes :
- **La fédération entre eMOBOIS et papiNet**, standards historiquement distincts mais dont les cas d'usage convergent (échanges machines forestières, scieries industrielles, filière pâte à papier).
- **La connexion eMOBOIS → aval** (FDES, BIM/DPP via CU2, observatoires publics, registre RDUE) — aujourd'hui chaque connexion se négocie bilatéralement, demain elle se contractualise via le cadre dataspace.

C'est précisément cette capacité de fédération qui change le ratio coût / bénéfice pour les petites scieries : elles implémentent une fois, et accèdent à tous les débouchés.

### 3. Conformité réglementaire embarquée

**RDUE au 30/12/2026** impose la géolocalisation parcelle et l'attestation de diligence raisonnée. Deux réponses possibles : (i) chaque opérateur développe sa propre solution — coût prohibitif pour les PME, risque élevé de non-conformité ; (ii) la filière étend eMOBOIS avec un champ géolocalisation + un connecteur vers un registre RDUE mutualisé, opérable par un tiers de confiance. Le Dataspace est le cadre qui permet (ii).

Au-delà de RDUE, les mêmes flux eMOBOIS étendus alimentent : certifications PEFC/FSC (extension des champs chaîne de contrôle), calcul carbone (lien avec données transport et machines), passeport produit aval (cf. CU2).

## Ce que les autres acteurs en disent

**ONF (réunion Christophe Ginet, 11/03/2026).** Explicitement favorable à positionner eMOBOIS comme cas d'usage dataspace. *Consensus : l'enjeu n'est pas technique mais stratégique et politique* — les entreprises ne voient pas aujourd'hui de bénéfice commercial suffisant pour mobiliser eMOBOIS comme standard commun. Un consortium à financement collectif est précisément l'outil pour lever ce type de blocage. Action en cours : tenir Christophe Ginet informé de l'intégration d'eMOBOIS dans le dispositif.

**GIP ATGeRi (co-lead métier filière & opérateur amont pressenti).** Le GIP ATGeRi est aujourd'hui l'acteur qui a **intégré eMOBOIS en production** dans FORETDATA et qui opère depuis plus de quinze ans une plateforme mutualisée d'échange amont. Il est en position naturelle de **co-lead métier filière** sur le volet extension eMOBOIS et d'opérateur amont du dataspace — avec une possibilité de prise de leadership opérationnel élargi selon le modèle d'extension retenu, en cohérence avec son rôle pivot sur CU1.

**FNB et coopératives forestières (co-leads métier filière).** La **FNB** (industriels scieries, seconde transformation) et les **coopératives forestières** (via **David Portron**, contact à ouvrir en articulation avec les notes ONF) sont en position naturelle de **co-lead métier filière** : ce sont les acteurs qui portent l'usage opérationnel du standard côté producteurs et transformateurs, et qui mobilisent les PME ayant aujourd'hui le ratio coût/bénéfice le plus défavorable. Sans leur portage, l'extension eMOBOIS reste théorique.

**FCBA (appui technique et scientifique).** Porteur du programme *Chaîne numérique d'informations pour la compétitivité des entreprises* (18RD1023), le FCBA apporte l'ingénierie sémantique et syntaxique nécessaire aux extensions eMOBOIS. Cadrage à préciser suite au RDV du 20/04/2026.

**Éditeurs d'ERP scieries et donneurs d'ordre industriels.** Co-contributeurs naturels des extensions ; à associer sans captation.

## Gouvernance proposée

- **Gouvernance eMOBOIS existante conservée** : le Dataspace ne reprend pas la gouvernance du standard, il la complète d'une instance d'arbitrage des extensions.
- **Co-lead métier filière & opérateur amont** : **GIP ATGeRi**, en continuité directe de son intégration eMOBOIS dans FORETDATA et en cohérence avec son rôle pivot sur CU1. Le positionnement — de co-lead à chef de file opérationnel du nœud amont — reste à son arbitrage.
- **Co-leads métier filière** : **FNB** (industriels scieries) + **coopératives forestières** (portage David Portron), acteurs qui portent l'usage et la mobilisation des PME.
- **Appui technique et scientifique** : **FCBA** (ingénierie sémantique et syntaxique des extensions, articulation programme 18RD1023).
- **Comité d'extensions multi-acteurs** : représentation filière ≥ 50 % des droits de vote, incluant petites scieries et coopératives (via interprofessions régionales et FNB), grands donneurs d'ordre industriels, éditeurs d'ERP, ONF et CNPF côté forêt publique / privée.
- **Conventions d'usage différenciées** : standard eMOBOIS étendu accessible à tous les acteurs filière ; connecteurs vers services mutualisés (registre RDUE, attestation carbone) avec tarification modulée selon taille d'acteur.
- **Clause d'ouverture** : accès tiers non-membres à conditions transparentes, dans la continuité de la logique standard ouvert.

## Standards & conformité mobilisés

| Standard | Rôle dans le CU4 |
|---|---|
| Gaia-X / DSSC Blueprint | Socle d'architecture dataspace fédérée |
| eMOBOIS | Standard d'échange approvisionnement bois France |
| papiNet | Standard international forêt-bois-papier (machines forestières) |
| RDUE / EUDR | Obligation géolocalisation + attestation (30/12/2026) |
| PEFC / FSC | Chaînes de certification origine |
| DPP / CPR révisé | Passage à l'aval via CU2 |

## Questions ouvertes & appel à contribution

- Quelle gouvernance pour faire évoluer eMOBOIS dans un contexte RDUE et DPP ? Qui est légitime à proposer et valider les extensions ?
- Quels connecteurs prioritaires vers les ERP non encore compatibles (petites scieries, transporteurs, coopératives) ?
- Quelle articulation avec les systèmes de certification (PEFC, FSC) pour éviter les saisies parallèles ?
- Quels outils d'accompagnement pour les PME qui n'ont ni ressources internes ni ERP compatible ?
- Comment relier eMOBOIS aux observatoires publics sans passer par une remontée descendante imposée ?

Si vous êtes exploitant forestier, ETF, transporteur, scierie, coopérative, donneur d'ordre industriel, éditeur d'ERP ou interprofession régionale, **votre regard opérationnel est précieux**. 👉 Contactez l'équipe DataWood Consortium.

---

## Annexe — Matrice consortium *(document de travail partenaires)*

*Pré-matrice d'un dossier de financement consortium (dispositif à arbitrer).*

### Workpackages envisageables

| WP | Intitulé | Livrables attendus | Lead pressenti | Durée |
|----|---|---|---|---|
| WP1 | Cadrage extensions & gouvernance | Schéma des extensions (RDUE, PEFC/FSC, carbone, DPP), statuts comité extensions | GIP ATGeRi + FNB + coopératives (lead métier filière), appui technique FCBA | 6 mois |
| WP2 | Spécifications techniques étendues | Schéma XML étendu eMOBOIS, mapping papiNet, connecteur RDUE, connecteur certifications | GIP ATGeRi (lead opérateur) + éditeurs ERP, appui technique et scientifique FCBA | 9 mois |
| WP3 | Implémentation & connecteurs | Connecteurs ERP scieries (2-3 éditeurs), connecteur registre RDUE mutualisé, connecteur BIM/DPP (articulation CU2) | GIP ATGeRi (lead opérateur) + éditeurs ERP | 9 mois |
| WP4 | Tests pilotes & accompagnement PME | 5-8 acteurs pilotes (petites scieries, coopératives, donneurs d'ordre), kits d'accompagnement PME, formation | FNB + coopératives (lead métier filière), interprofessions régionales | 9 mois |
| WP5 | Pérennisation & passage à l'échelle | Modèle économique, plan de généralisation multi-massifs, articulation CU1 (FORETDATA) et CU2 / CU5 (interconnexion donnée d'impact) | Coordination + GIP ATGeRi | 6 mois |

### Consortium pressenti *(≤ 7 partenaires structurants phase dev)*

| Rôle | Partenaire pressenti | Légitimité / apport | Statut échange |
|---|---|---|---|
| Coordinateur | Xylofutur + Kosmio (appui méthodologique) | Animation filière, méthodologie dataspace, ingénierie de consortium | Opérationnel |
| **Co-lead métier filière & opérateur amont** | **GIP ATGeRi** | Opérateur historique FORETDATA (17 ans), implémentation eMOBOIS dans l'infrastructure amont, expérience de tiers de confiance filière. Positionnement ouvert à une prise de leadership opérationnel élargi sur ce CU, à l'arbitrage du GIP. | À confirmer (articulation CU1) |
| **Co-lead métier filière** | **FNB** (syndicat des scieurs) | Représentativité scieries, aval amont et volumétrie, porte d'entrée industriels de la 1ère transformation | À ouvrir |
| **Co-lead métier filière** | **Coopératives forestières** (via David Portron) | Représentativité amont, acteurs contributeurs directement concernés par la mise en conformité RDUE | À ouvrir |
| **Appui technique et scientifique** | **FCBA** (programme 18RD1023, Chaîne numérique) | Expertise standard eMOBOIS, ingénierie sémantique, articulation avec travaux papiNet | RDV 20/04/2026 |
| Éditeur ERP pilote | 1 éditeur ERP scieries + 1 éditeur ERP coopératives | Connecteurs de référence, industrialisation du standard étendu | À identifier |
| Pilote industriel / logistique | Groupe industriel 1ère transformation ou acteur logistique (ex. Forêt Logistique, Richard Emeyriat) | Terrain d'expérimentation volumétrique, cas d'usage transport amont | À identifier |

Partenaires associés : ONF (Christophe Ginet — information en continu), CNPF / La Forêt Bouge, PEFC France, FSC France, interprofessions régionales, DRAAF, France Bois Forêt, CODIFAB (articulation CU2 aval).

### Modèle économique & route vers pérennité

*À ce stade, aucune décision sur la source de financement. Leviers à instruire.*

- **Phase projet — leviers à instruire** : continuité des financements FBF / CODIFAB / Ministère Agriculture sur Chaîne numérique et FCBA 18RD1023 ; AAP nationaux (hypothèse, à confirmer) ; cofinancements Régions (Nouvelle-Aquitaine, Grand Est, Bourgogne-Franche-Comté notamment) ; contributions en nature GIP ATGeRi et éditeurs ERP pilotes.
- **Phase opérationnelle (auto-financement cible H+36 mois)** : cotisations acteurs filière utilisateurs du standard étendu (modulation selon taille), licences éditeurs ERP, refacturation des services mutualisés (registre RDUE, attestations carbone), continuité du portage filière historique pour la gouvernance eMOBOIS.
- **Hypothèse de seuil** : bascule à ~50 scieries + 10-20 coopératives + 4-6 éditeurs ERP connectés à H+36.
- **Clause d'ouverture** : standard étendu accessible librement (principe standard ouvert), services mutualisés à conditions transparentes.

### Impact filière & KPI quantifiés *(à chiffrer avec les partenaires)*

- **Création / répartition de valeur** : heures de ressaisie évitées par acteur connecté (déjà documenté côté FORETDATA, à généraliser) ; coût évité de mise en conformité RDUE individuelle pour les PME ; ROI PME/ETI/coopératives.
- **Volumes de données partagées** : nombre de flux eMOBOIS étendus échangés, nombre d'attestations RDUE émises, nombre d'acteurs connectés (% PME).
- **Conformité réglementaire** : % d'opérateurs RDUE outillés à H+12 puis H+24, couverture PEFC/FSC numérique, alignement DPP à H+36.
- **Impact environnemental** : kgCO₂eq évités sur logistique amont (effet des données transport + machines), check DNSH.
- **Formation professionnelle** : nombre de personnes formées dans les PME et coopératives, kits d'accompagnement déployés.

### Budget indicatif & calendrier

- **Enveloppe CU4** : **400 à 500 k€** sur 30 mois. CU4 est positionné en milieu de fourchette : le standard existe déjà (donc coût d'amorçage technique limité), mais l'effort d'accompagnement des PME et coopératives (WP4) est significatif — c'est là que se joue le ROI, et c'est la partie qui lève le blocage politique identifié en réunion ONF. Le coût RDUE est mutualisé plutôt qu'individuel, ce qui crée le levier économique pour les PME.
- **Répartition indicative** : WP1 ~15 %, WP2 ~20 %, WP3 ~25 %, WP4 ~30 %, WP5 ~10 %.
- **Durée projet** : 30 mois.
- **Jalon consortium** : précision périmètre et partenaires T3 2026 ; arbitrage vecteur de financement à la même échéance.
- **Articulation CU1** : CU4 partage son opérateur de référence (GIP ATGeRi) avec CU1 — cohérence des interfaces à gérer en phase de cadrage pour éviter le doublon.

---

*Cette fiche sera ajustée après l'échange FCBA du 20/04/2026 et les premiers contacts coopératives (David Portron).*
