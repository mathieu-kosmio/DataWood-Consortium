---
title: "La maquette DataWood-X : deux applications posées sur l'infrastructure d'un data space existant"
password: datawood-partenaires
date: 2026-09-17T09:00:00
author: DataWood Consortium
image: /img/dwx-maquette-chaine-origine.png
description: "Une maquette cliquable des deux outils du consortium, Passeport côté détenteur de données et Portail côté donneur d'ordre, jouée sur la chaîne bois construction. Elle rend visibles les choix d'architecture arrêtés en septembre 2026 : un modèle de données unique, deux applications seulement, et une infrastructure de data space empruntée plutôt que reconstruite."
tags: ["Maquette", "Passeport produit", "DPP", "Data space", "Gaia-X", "Building Data X", "RDUE", "RPC", "Architecture"]
---

# La maquette DataWood-X : deux applications posées sur l'infrastructure d'un data space existant

Depuis juin, les échanges du consortium portaient sur des documents : cartographie des initiatives, livre blanc sur le passeport numérique produit, business plans par cas d'usage, note de stratégie produit. Ces documents décrivent une architecture. Ils ne la font pas voir.

La maquette présentée ici comble ce manque. Elle rejoue, écran par écran, le scénario de la chaîne bois construction : une scierie déclare ses lots, un fabricant de lamellé-collé en hérite l'origine, un constructeur reçoit le passeport produit et vérifie les preuves. Douze étapes, trois entreprises fictives, aucune donnée réelle. Elle répond à une demande formulée lors du point du 14 septembre : disposer de maquettes d'écrans « jour 1 » qui montrent ce que les adhérents manipuleront, et non ce que l'infrastructure fait en dessous.

Cet article explique ce que la maquette illustre, et surtout pourquoi les écrans ont cette forme. Chaque choix d'interface traduit une décision d'architecture prise en amont.

> **Tester la maquette maintenant.** Elle s'ouvre dans le navigateur, sans compte ni installation. Le mode guidé propose les douze étapes du scénario, chaque instruction étant posée à côté du bouton qui la réalise.
>
> [Ouvrir la maquette DataWood-X](/maquette/)

## Le problème que la filière nous décrit, tel quel

Un fabricant de lamellé-collé qui livre un chantier bois doit produire aujourd'hui quatre documents à partir des mêmes caractéristiques produit : une déclaration de performance au titre du règlement produits de construction, un passeport produit numérique, une fiche de déclaration environnementale et sanitaire, un objet BIM pour la maquette numérique du projet. Quatre saisies, dans quatre outils, à partir d'une seule réalité physique.

À cela s'ajoute une obligation nouvelle : depuis le 30 décembre 2026 pour les grands et moyens opérateurs, le règlement européen contre la déforestation impose de relier chaque mise en marché à des parcelles de récolte géolocalisées. Cette information existe, mais à l'autre bout de la chaîne, chez le gestionnaire forestier et la scierie. Aujourd'hui elle remonte par courriel, par tableur, ou pas du tout.

![Écran des livrables du Passeport, avant toute génération](/img/dwx-maquette-01-probleme.png)

Le premier écran de la maquette part de là. La colonne de droite est vide, aucun livrable n'est généré, et le produit est au niveau de traçabilité le plus faible. C'est l'état réel de la plupart des fiches produit de la filière.

## Le choix d'architecture : emprunter l'infrastructure, apporter le métier

Un data space est souvent présenté comme une plateforme. C'est l'inverse : il n'y a pas de base centrale, chaque acteur garde ses données chez lui, et ce qui est partagé, ce sont les règles qui permettent à deux systèmes de se faire confiance sans intermédiaire. Identité vérifiable des participants, description des données disponibles, contrat d'accès négocié machine à machine, journal des échanges.

Construire cette couche coûte cher et ne différencie personne. Le 6e atelier technique du Hub France Gaia-X, en juin, a confirmé qu'une autre voie existe : le **modèle d'extension de domaine**. Un domaine sectoriel ne rebâtit pas l'infrastructure, il vient s'appuyer sur celle d'un écosystème déjà opérationnel et n'y ajoute que ce qui lui est propre, en gardant la maîtrise de ses règles métier. Le rôle de dépositaire de domaine, tenu par la gouvernance de filière, consiste à définir ces règles et à émettre les attestations correspondantes.

C'est la position retenue pour DataWood-X, et actée le 14 septembre : l'intégration se fait sur l'infrastructure **Building Data X**, le data space du bâtiment et de la construction, pour mutualiser les coûts fixes. Aucun label Gaia-X n'est exigé pour cela, ce qui se joue est une relation de confiance entre deux domaines.

Concrètement, voici ce que le consortium ne développe pas.

| Brique d'infrastructure | Fournie par le data space hôte |
|---|---|
| Fournisseur de services de confiance | Émission et vérification des signatures |
| Portefeuille d'entreprise | Détention des attestations côté participant |
| Registre des identités et des vérificateurs | Qui est qui, et qui peut vérifier quoi |
| Catalogue et description des produits de données | Ce qui est disponible, et sous quelles conditions |
| Notaire de contrat et accords d'usage | Le contrat d'accès et sa trace opposable |
| Connecteur et protocole d'échange | Le transport effectif de la donnée |
| Journal de preuve | Qui a consulté quoi, quand, sous quel contrat |
| Moteur de conformité et extension de domaine | L'exécution des règles propres à un domaine |
| Protocole de confiance inter-écosystèmes | La reconnaissance entre domaines voisins |

Et voici ce qu'il apporte en propre : un modèle de données du bois, quatre types d'attestations spécifiques à la filière, un générateur de livrables réglementaires, et deux applications. Rien d'autre. Sur les neuf types d'attestations mobilisés par le scénario, cinq sont des credentials communs déjà définis par le cadre Gaia-X ; quatre seulement relèvent du domaine bois : l'adhésion, la qualité d'acteur, la diligence raisonnée et la marque collective d'origine prouvée.

Cette asymétrie est le cœur de l'argument économique du consortium. La conformité au passeport produit est une obligation individuelle, l'infrastructure qui la rend praticable est un bien collectif. Un fabricant seul ne peut pas amortir un data space ; une filière peut amortir une extension de domaine posée sur une infrastructure partagée.

## Un modèle de données minimal : Lot, Produit, Livrable

Les trois cas d'usage des business plans du 11 septembre semblaient appeler trois outils différents : le passeport produit pour l'ameublement, le passeport produit pour le bois construction, la preuve d'origine du contreplaqué. Leur analyse a montré qu'ils partagent la même structure. Un **lot d'origine** décrit la matière telle que l'amont la connaît. Un **produit** décrit ce que le fabricant met en marché. Un **livrable** est un document réglementaire engendré à partir des deux.

Toute la difficulté tient dans un seul attribut : la précision de l'origine. La maquette l'exprime par trois niveaux.

| Niveau | Ce qu'il porte | Ce qu'il permet |
|---|---|---|
| N1 | Parcelle géolocalisée, identifiée individuellement | Le plus exigeant, attendu sur les flux à risque |
| N2 | Lot agrégé par massif, bilan massique | Suffisant pour le passeport produit et la FDES configurée |
| N3 | Déclaration du fournisseur, sans géolocalisation | Ne permet ni le passeport RPC ni la FDES |

Ce n'est pas une classification théorique. Dans la maquette, le niveau conditionne ce qui est générable, et le blocage est affiché comme tel plutôt que contourné : un champ manquant bloque le rendu qui l'exige.

## Ce que la maquette fait voir

### L'amont déclare une fois, et la filière capitalise

La scierie importe son tableau d'approvisionnement. Douze lots, seize colonnes reconnues sur dix-huit, le prix d'achat et le commentaire interne explicitement écartés du partage.

![Import des lots et reconnaissance des fournisseurs dans le référentiel partagé](/img/dwx-maquette-02-import.png)

Trois fournisseurs sur quatre sont déjà connus du référentiel partagé, parce qu'un autre adhérent les a déclarés avant. C'est le premier effet de la mutualisation, et il est immédiatement lisible : chaque adhérent ne redécrit pas la forêt de ses voisins. Le quatrième est créé, et servira au suivant.

### L'origine remonte par héritage, pas par ressaisie

Le fabricant voit son produit en niveau N3 : composition déclarée, aucune géolocalisation. Il demande l'accès aux lots de la scierie. La maquette déroule les trois temps de la négociation, demande transmise, contrat signé, données transférées, puis rattache les lots au composant lamelles.

![Composition du produit après rattachement des lots, passage au niveau N2](/img/dwx-maquette-03-composition-n2.png)

Le niveau passe de N3 à N2. Aucune coordonnée n'a été saisie par le fabricant. Le rattachement crée une référence vers le lot de la scierie, pas une copie : si la scierie corrige son lot, le fabricant est prévenu et ses rendus basculent en « à régénérer ». C'est la première des trois séquences d'échange spécifiées, celle de l'héritage d'origine. Les deux autres, la campagne de collecte et la reconnaissance inter-domaines sur portées nommées, sont également jouées dans le scénario.

### Une saisie, quatre documents

Le niveau N2 débloque ce qui était refusé. Les quatre livrables se génèrent depuis la même fiche, chacun signé et horodaté.

![Génération séquentielle des quatre livrables réglementaires](/img/dwx-maquette-04-livrables.png)

La démonstration la plus parlante vient ensuite : le fabricant modifie sa classe de résistance. Les deux rendus qui dépendent de cette valeur basculent en « à régénérer », et le client sous contrat actif est notifié sans qu'on ait à l'appeler. Une correction se propage, au lieu de créer quatre versions divergentes dans quatre outils.

### La preuve se vérifie sans appeler celui qui l'a émise

Côté Portail, le donneur d'ordre contrôle l'attestation de diligence raisonnée attachée au lot.

![Vérification d'une attestation, cinq contrôles dont un seul en ligne](/img/dwx-maquette-05-verification.png)

Cinq contrôles : la signature, l'émetteur reconnu par le domaine, la portée, la validité, la révocation. Quatre se font hors ligne, sur le document lui-même. Seule la révocation exige un accès réseau. C'est la propriété qui distingue une attestation vérifiable d'un PDF joint à un courriel, et elle a une conséquence pratique : le contrôle reste possible en cas d'audit, des années après, sans dépendre de la survie d'une plateforme.

### Le détenteur garde la main, et cela se voit

C'est l'objection que nous entendons systématiquement en entretien : « je ne veux pas donner mes données à une plateforme ». La maquette y répond par un écran, pas par un discours.

Le fabricant coupe la transmission de la géolocalisation détaillée des parcelles. Cette information est facultative : la conformité est satisfaite par l'attestation de diligence raisonnée, dont le numéro de référence, lui, est transmis.

![Chaîne d'origine côté Portail, avec un champ exclu et son motif affiché](/img/dwx-maquette-chaine-origine.png)

Côté client, le champ n'est pas masqué à l'affichage : il n'est pas transmis, et le motif est visible. La différence est essentielle. Une donnée cachée laisse un doute sur ce qui circule ; une donnée non transmise avec son motif rend la politique d'usage lisible par les deux parties.

Chaque information du passeport porte par ailleurs sa qualification, vérifiée par signature, déclarée par le fabricant, ou héritée d'un maillon amont nommé. Un donneur d'ordre sait donc ce sur quoi il peut s'appuyer pour sa propre conformité, et ce qui relève de la déclaration de son fournisseur.

### Tout accès laisse une trace

![Journal des accès, en lecture seule, fourni par l'infrastructure](/img/dwx-maquette-07-journal.png)

Le dernier écran est celui qui rend la souveraineté vérifiable plutôt qu'affirmée. Qui a consulté quoi, quand, sous quel contrat. Il est en lecture seule et alimenté par l'infrastructure, pas par l'application : c'est précisément ce qu'un journal de preuve doit être pour avoir une valeur. Un accès hors contrat ne peut pas y apparaître, et s'il apparaissait, ce serait un incident signalé comme tel.

## Ce que la maquette ne prouve pas

Une démonstration convainc d'autant mieux qu'elle dit ses limites.

Le modèle de données, la saisie, la composition, les attestations, la vérification et deux gabarits de livrables correspondent à des mécanismes réellement spécifiés, que nous savons exécuter. La publication au catalogue et les échanges inter-domaines sont maquettés : ils dépendent d'un accès à un environnement d'infrastructure, que nous devons obtenir avant fin septembre.

Trois autres points restent ouverts et sont assumés comme tels.

L'enrôlement des petites entreprises est le vrai goulot d'étranglement. Une identité numérique d'entreprise fiable est la condition d'entrée dans un data space, et l'outillage public actuel ne couvre pas encore le mandat privé. Le portefeuille européen d'identité arrive fin 2026 ou début 2027, le portefeuille d'entreprise en 2028 ou 2029. Entre les deux, il faut une solution de transition, et c'est un sujet de dialogue avec la puissance publique autant que de technique.

La brique générateur, celle qui transforme une donnée produit en documents réglementaires, ne doit pas être écrite de zéro si un projet européen la produit déjà. Le projet COMPLIANCE4DPP est en cours d'instruction à cet effet.

Enfin, la maquette montre des interfaces. Elle ne dit rien des conditions de gouvernance qui feront qu'un acteur accepte de publier un lot : qui arbitre les règles du domaine, comment on entre, comment on sort, qui porte la responsabilité en cas de litige sur une donnée héritée. Ce chantier est celui du consortium, pas celui de l'outil.

## Pourquoi cette architecture tient économiquement

Les business plans par cas d'usage du 11 septembre chiffrent trois trajectoires : le passeport produit pour l'ameublement, le passeport produit pour le bois construction, la preuve d'origine du contreplaqué. Le rapprochement de ces trois lignes avec la note de stratégie produit donne le raisonnement qui a conduit à la maquette.

Trois cas d'usage, un seul modèle de données. Deux applications, pas six. Un module de diligence raisonnée partagé entre le bois construction et le contreplaqué. Une infrastructure empruntée au lieu d'être bâtie. Un premier profil sectoriel livré, puis un second qui ne coûte que son paramétrage.

Côté recettes, le principe retenu est celui d'une cotisation accessible, plafonnée à mille euros par an pour une PME et cinq mille pour une ETI, complétée par le financement de l'amorçage. Ce niveau n'est tenable que si les coûts fixes sont mutualisés, ce qui renvoie exactement au choix d'architecture décrit plus haut. Les deux décisions se tiennent l'une l'autre.

## Ce que nous attendons de vous

La maquette est faite pour être critiquée. Les vocabulaires, les enchaînements, les informations affichées et celles qui manquent viennent d'entretiens et de spécifications, pas d'une intuition de concepteur. Ce sont vos corrections qui les rendront justes.

Trois questions nous sont particulièrement utiles. Un écran manque-t-il à votre métier ? Un champ affiché est-il commercialement inacceptable dans votre contexte ? Le niveau de traçabilité que vous pouvez réellement atteindre correspond-il à celui que la maquette suppose ?

> **Ouvrir la maquette et nous dire ce qui cloche.** Douze étapes guidées, environ dix minutes, sur un navigateur récent. Le mode guidé peut être coupé à tout moment pour explorer librement les écrans.
>
> [Ouvrir la maquette DataWood-X](/maquette/) · [Nous écrire](#/rejoindre)

## Documents de référence

Les éléments cités dans cet article proviennent des travaux suivants, disponibles auprès du consortium : les business plans par cas d'usage du 11 septembre 2026, la note de stratégie produit dans sa version 0.2 du 15 septembre, les spécifications fonctionnelles et techniques des deux outils dans leur version 0.1, les présentations du 6e atelier technique du Hub France Gaia-X des 30 juin et 1er juillet 2026, et l'édition 8 du Gaia-X Magazine parue en juin 2026.

Pour le cadre général, le [livre blanc sur le passeport numérique produit et le data space de la filière bois](/docs/livre-blanc-dpp-dataspace-filiere-bois-2026.pdf) et l'article [pourquoi le passeport numérique produit a besoin d'un data space](#/blog/2026-08-27-pourquoi-le-passeport-numerique-produit-a-besoin-dun-dataspace) posent le raisonnement qui précède ces choix d'architecture.
