---
title: "Passeport produit et data space : ce que la maquette DataWood-X rend visible"
password: datawood-partenaires
date: 2026-09-17T09:00:00
author: DataWood Consortium
image: /img/dwx-maquette-chaine-origine.png
description: "Une maquette cliquable d'un outil de filière, jouée sur la chaîne bois construction. Elle sert de support pédagogique à une question plus large que le passeport produit : qu'est-ce qu'un data space permet exactement, que ni un portail ni un échange de fichiers ne permettent."
tags: ["Maquette", "Passeport produit", "DPP", "Data space", "Gaia-X", "RDUE", "RPC", "Architecture"]
---

# Passeport produit et data space : ce que la maquette DataWood-X rend visible

Le passeport numérique produit est devenu une échéance datée pour la filière forêt-bois. Le règlement européen sur les produits de construction, applicable depuis janvier 2026, inscrit un passeport dédié dans le droit. Le règlement contre la déforestation impose, depuis le 30 décembre 2026 pour les grands et moyens opérateurs, de relier chaque mise en marché à des parcelles de récolte géolocalisées. Le règlement sur l'écoconception place le mobilier parmi les familles prioritaires de son plan de travail, avec un acte délégué attendu à la fin de la décennie.

La question n'est donc plus de savoir si ces obligations arrivent, mais comment une filière composée à plus de 90 % de petites entreprises va les produire. Et la réponse dépend d'un choix d'infrastructure que la plupart des acteurs n'ont pas eu l'occasion d'examiner concrètement, faute d'avoir eu quelque chose à manipuler.

C'est l'objet de la maquette présentée ici. Elle rejoue, écran par écran, un scénario de chaîne bois construction : une scierie déclare ses lots, un fabricant de lamellé-collé en hérite l'origine, un constructeur reçoit le passeport produit et vérifie les preuves. Neuf étapes, trois entreprises fictives, aucune donnée réelle. Elle démontre un cas d'usage, mais elle sert surtout à rendre tangible une chose plus abstraite : ce qu'un data space permet, exactement, que ni un portail centralisé ni un échange de fichiers ne permettent.

> **Tester la maquette maintenant.** Elle s'ouvre dans le navigateur, sans compte ni installation. Le mode guidé s'adresse à quelqu'un qui ne connaît ni le passeport produit ni le data space. Il commence par le résultat, scanner l'étiquette d'une poutre, puis déroule neuf étapes : chaque instruction est posée à côté du bouton qui la réalise, chaque mot nouveau est expliqué au passage, et un volet « Sous le capot » dit, pour qui veut le savoir, ce que fait le data space à cet instant.
>
> [Ouvrir la maquette DataWood-X](/maquette/)

## Le point de départ : quatre documents, une seule réalité physique

Un fabricant de lamellé-collé qui livre un chantier bois doit produire quatre documents à partir des mêmes caractéristiques produit. Une déclaration de performance au titre du règlement produits de construction. Un passeport produit numérique. Une fiche de déclaration environnementale et sanitaire pour le calcul réglementaire du bâtiment. Un objet BIM pour la maquette numérique du projet. Quatre saisies, dans quatre outils, à partir d'une seule poutre.

S'y ajoute une information qu'il ne détient pas : l'origine du bois. Les parcelles de récolte, leur géolocalisation, la certification forestière et la diligence raisonnée existent chez le gestionnaire forestier et la scierie, deux à trois maillons en amont. Aujourd'hui elles remontent par courriel, par tableur, ou pas du tout.

![Dossier produit avant que l'origine ne remonte : le diagnostic nomme ce qui est couvert et ce qui manque](/img/dwx-maquette-01-probleme.png)

Le dossier produit de la maquette part de cet état de fait. Il n'affiche pas un pourcentage de complétude : il nomme onze exigences couvertes, deux manquantes, une valeur à valider, et pose sur chaque ligne le bouton qui y remédie. L'origine des lamelles est bloquante, et tant qu'elle manque le passeport ne peut pas être publié. C'est la situation ordinaire d'une fiche produit dans la filière, et c'est de là que le scénario redémarre.

## Ce qu'un data space fait, et qu'un portail ne fait pas

Le mot est employé partout, souvent comme synonyme de plateforme sectorielle. C'est l'inverse d'une plateforme. Un data space ne centralise pas les données : il définit les règles qui permettent à deux systèmes appartenant à deux organisations différentes de se faire confiance et d'échanger directement, sans qu'un tiers détienne l'information au passage.

Cinq mécanismes le constituent. Ils reviennent tous dans la maquette, et chacun répond à un problème que la filière connaît de longue date.

**L'identité vérifiable.** Chaque participant détient des attestations signées cryptographiquement : son existence légale, sa qualité d'acteur, ses certifications. On les appelle des credentials vérifiables. Elles ne sont pas stockées par un opérateur central, mais détenues par l'entreprise elle-même, dans un portefeuille, et présentées de façon sélective selon l'interlocuteur. Un client ne reçoit que ce que le contrat justifie.

**La donnée reste chez son détenteur.** Ce qui circule, ce n'est pas une copie de la base, c'est une référence et un droit d'accès. Conséquence directe et vérifiable dans la maquette : quand l'amont corrige un lot, l'aval est prévenu et ses documents dérivés se marquent comme périmés. Avec des copies transmises par fichier, la correction ne remonte jamais et trois versions divergentes cohabitent.

**Le contrat d'accès et la politique d'usage.** L'accès se négocie entre deux systèmes, avec une finalité, une durée, un périmètre de rediffusion. Ce n'est pas une case à cocher, c'est un contrat dont la trace est opposable. Le détenteur choisit champ par champ ce qu'il transmet, et le motif d'exclusion est visible par celui qui reçoit.

**La preuve vérifiable hors ligne.** Une attestation signée se contrôle sans appeler celui qui l'a émise : la signature, l'émetteur, la portée et la validité se vérifient sur le document lui-même. Seule la révocation exige un accès réseau. Cette propriété a une conséquence pratique considérable pour un audit ou un contrôle douanier : la preuve reste contrôlable des années plus tard, indépendamment de la survie de la plateforme qui l'a produite.

**Le journal de preuve.** Chaque accès laisse une trace tenue par l'infrastructure, pas par l'application. C'est ce qui permet de dire à un adhérent, non pas que ses données sont protégées, mais de lui montrer qui les a consultées, quand et sous quel contrat.

| | Portail sectoriel classique | Data space |
|---|---|---|
| Où vit la donnée | Dans la base du portail | Chez chaque détenteur |
| Qui garantit l'identité | L'opérateur, par des comptes | Des attestations signées, vérifiables par tous |
| Ce que reçoit un client | Une copie, figée | Une référence, actualisée et révocable |
| Conditions d'usage | Conditions générales acceptées en bloc | Contrat négocié, finalité et durée explicites |
| Preuve en cas d'audit | Dépend de l'opérateur | Vérifiable sur la pièce elle-même |
| Si l'opérateur disparaît | Les données partent avec lui | Les données n'ont jamais quitté leurs détenteurs |

Cette différence n'est pas théorique pour une filière où la donnée d'approvisionnement est une information commercialement sensible. La question que pose un dirigeant de scierie n'est pas « quel outil ? », elle est « qui voit mes fournisseurs et mes volumes ? ». Un data space est la seule réponse qui permette de partager la conformité sans partager le carnet d'adresses.

## Où poser cette couche de confiance : une question encore ouverte

Cette couche coûte cher à construire, et elle ne différencie personne. Aucune filière n'a d'intérêt propre à écrire son registre d'identités ou son protocole d'échange. La question posée au consortium n'est donc pas de savoir si ces briques sont nécessaires, mais qui les opère.

Deux voies restent sur la table, et le choix n'est pas arbitré à ce stade.

La première consiste à **poser les briques d'une infrastructure propre à la filière**, dimensionnée pour ses besoins, avec la maîtrise complète du calendrier et des conditions d'exploitation. Elle coûte plus cher à l'amorçage et demande de porter dans la durée des composants que d'autres opèrent déjà.

La seconde consiste à **s'appuyer sur une infrastructure de data space déjà opérationnelle**, en n'ajoutant que ce qui est propre au bois. Elle mutualise les coûts fixes et raccourcit le délai de mise en service, au prix d'une dépendance à l'égard d'un opérateur tiers et de son propre calendrier.

Un point ne dépend pas de cet arbitrage, et c'est le plus important : **la gouvernance de la filière et le domaine de données restent distincts de l'infrastructure**. Les travaux européens formalisent ce principe sous le nom de modèle d'extension de domaine. Un dépositaire de domaine, tenu par la gouvernance sectorielle, définit les règles métier, décide qui entre, et émet les attestations propres au secteur. Celui qui opère la plomberie ne gouverne pas le domaine, ne fixe pas ses règles et ne détient pas les données de ses participants. La filière peut donc changer d'hébergement sans changer de règles, et c'est cette réversibilité qui rend la question technique moins engageante qu'il n'y paraît.

Voici, dans les deux cas, les briques que la filière doit se procurer plutôt que réinventer produit par produit.

| Brique d'infrastructure | Ce qu'elle assure |
|---|---|
| Fournisseur de services de confiance | Émission et vérification des signatures |
| Portefeuille d'entreprise | Détention des attestations côté participant |
| Registre des identités et des vérificateurs | Qui est qui, et qui peut vérifier quoi |
| Catalogue et description des produits de données | Ce qui est disponible, et à quelles conditions |
| Notaire de contrat et accords d'usage | Le contrat d'accès et sa trace opposable |
| Connecteur et protocole d'échange | Le transport effectif de la donnée |
| Journal de preuve | Qui a consulté quoi, quand, sous quel contrat |
| Moteur de conformité et extension de domaine | L'exécution des règles propres à un domaine |
| Protocole de confiance inter-écosystèmes | La reconnaissance entre domaines voisins |

Et voici ce que la filière apporte en propre, quelle que soit la voie retenue : un modèle de données du bois, quatre attestations spécifiques, un générateur de documents réglementaires, et une application, celle que montre la maquette. Rien d'autre. Sur les neuf types d'attestations que mobilise le scénario, cinq sont des credentials communs, déjà définis par le cadre européen et reconnus au-delà de la filière. Quatre seulement relèvent du domaine bois : l'adhésion, la qualité d'acteur, la diligence raisonnée et la marque collective d'origine prouvée.

Cette répartition est le cœur de l'argument collectif. Se conformer au passeport produit est une obligation individuelle ; l'infrastructure qui rend cette conformité praticable est un bien commun. Un fabricant seul ne peut amortir ni une infrastructure ni un domaine ; une filière peut amortir les deux, et n'a besoin d'arbitrer l'hébergement qu'une fois ses règles posées.

## Un modèle de données volontairement minimal

Trois besoins apparemment distincts, le passeport produit du meuble, celui du bois construction et la preuve d'origine des panneaux, partagent la même structure. Un **lot d'origine** décrit la matière telle que l'amont la connaît. Un **produit** décrit ce que le fabricant met en marché. Un **livrable** est un document réglementaire engendré à partir des deux. Trois objets, et des profils sectoriels qui n'ajoutent que les attributs propres à chaque famille de produits.

Toute la difficulté se concentre dans un seul attribut : la précision de l'origine. Elle s'exprime en trois niveaux.

| Niveau | Ce qu'il porte | Ce qu'il permet |
|---|---|---|
| N1 | Parcelle géolocalisée, identifiée individuellement | Le plus exigeant, attendu sur les flux à risque |
| N2 | Lot agrégé par massif, bilan massique | Suffisant pour le passeport produit et la fiche environnementale configurée |
| N3 | Déclaration du fournisseur, sans géolocalisation | Ne permet ni le passeport ni la fiche environnementale |

Ce n'est pas une classification décorative. Dans la maquette, le niveau conditionne ce qui est générable, et un champ manquant bloque le document qui l'exige, au lieu d'être comblé par une valeur par défaut. Un générateur qui invente est un générateur qui expose son utilisateur.

## Le parcours, et le mécanisme derrière chaque écran

### Déclarer une fois, à l'endroit où l'information existe

La scierie importe son tableau d'approvisionnement : douze lots, seize colonnes reconnues sur dix-huit, le prix d'achat et le commentaire interne explicitement écartés du partage.

![Import des lots et reconnaissance des fournisseurs dans le référentiel partagé](/img/dwx-maquette-02-import.png)

Trois fournisseurs sur quatre sont déjà connus du référentiel partagé, parce qu'un autre adhérent les a déclarés avant. Le quatrième est créé, et servira au suivant. C'est l'effet le plus immédiat de la mutualisation : personne ne redécrit la forêt de ses voisins. Le mécanisme sous-jacent est celui du référentiel commun, la couche la moins spectaculaire d'un data space et souvent la plus rentable.

### Hériter de l'origine au lieu de la ressaisir

Le fabricant voit son produit en niveau N3 : composition déclarée, aucune géolocalisation. Il demande l'accès aux lots de la scierie. La maquette déroule les trois temps de l'échange, demande transmise, conditions de la scierie acceptées, accès ouvert, puis rattache les lots au composant lamelles. Le contrat s'accepte en un clic parce que la scierie avait publié ses conditions d'avance ; une demande hors catalogue repasserait par des personnes.

![Composition du produit après rattachement des lots, passage au niveau N2](/img/dwx-maquette-03-composition-n2.png)

Le niveau passe de N3 à N2 sans qu'une seule coordonnée ait été saisie par le fabricant. C'est le mécanisme de la référence qui opère : le rattachement crée un lien vers le lot de la scierie, pas une copie. Si la scierie corrige son lot, le fabricant est prévenu et ses documents basculent en « à régénérer ». Personne n'a besoin de se souvenir de prévenir qui que ce soit.

Tous les fournisseurs n'ont pas d'outil, et la maquette le prend au sérieux. La fiche de sécurité de la colle est demandée à une petite entreprise qui n'adhère à rien : elle reçoit un lien, lit sur une seule page qui demande, pour quoi faire, qui verra sa pièce et pendant combien de temps, puis la dépose. Sans compte ni abonnement, et avec une case de réutilisation qui n'est jamais cochée d'avance. C'est la marche la plus basse du réseau, et sans doute la plus importante pour une filière de petites entreprises.

### Une saisie, quatre documents, et une correction qui se propage

Une fois l'origine justifiée, le passeport devient publiable. Publier génère d'un seul geste les quatre documents que le chantier réclame, depuis la même fiche, chacun signé et horodaté. Une valeur lue automatiquement dans un PDF attend auparavant qu'une personne la valide : la lecture est assistée, la décision reste humaine.

![Génération séquentielle des quatre livrables réglementaires](/img/dwx-maquette-04-livrables.png)

Le passeport, lui, est une page à part entière, celle qu'ouvre le QR code de l'étiquette, sans application ni compte. Elle répond à trois questions, qu'est-ce que c'est, d'où ça vient, qu'est-ce que j'en fais, et se lit par intention : vérifier l'origine, poser et entretenir, démonter et réemployer, télécharger le dossier technique. Trois lecteurs y trouvent trois vues, le public, le professionnel identifié et l'autorité de contrôle. Chaque affirmation porte l'un de cinq statuts, déclaré, documenté, contrôlé, vérifié par un tiers ou non vérifié, et ouvre sa carte de preuve : qui déclare, quelle pièce, ce qu'elle couvre et ne couvre pas, jusqu'à quand. Le contenu réglementaire du passeport des produits de construction n'étant pas encore fixé, cette page illustre un principe, pas un gabarit officiel.

![Le passeport consultable, ouvert par le QR code : vue publique, rubrique origine dépliée](/img/dwx-maquette-06-passeport.png)

La démonstration la plus parlante vient une fois le dossier du donneur d'ordre envoyé. Un certificat de chaîne de contrôle arrive à échéance dans cinquante-cinq jours. Avec des fichiers éparpillés, personne ne saurait où il a servi. Ici la preuve sait qui la cite : quatre produits, un passeport publié, un dossier transmis, un client à prévenir. On dépose le certificat renouvelé une fois, et tout ce qui le cite se met à jour, jusque chez le client. Une correction se propage, au lieu de créer quatre versions divergentes dans quatre outils, chez cinq destinataires.

![Une preuve qui expire, et la liste de tout ce qui la cite](/img/dwx-maquette-08-impact.png)

### Contrôler une preuve sans appeler celui qui l'a émise

Côté donneur d'ordre, l'attestation de diligence raisonnée attachée au lot se vérifie en cinq contrôles.

![Vérification d'une attestation, cinq contrôles dont un seul en ligne](/img/dwx-maquette-05-verification.png)

La signature, l'émetteur reconnu par le domaine, la portée, la validité, la révocation. Quatre se font hors ligne, sur la pièce elle-même. Seule la révocation demande un accès réseau, et la maquette l'affiche comme telle plutôt que de laisser croire à une vérification complète en cas d'indisponibilité. Un émetteur inconnu du domaine est d'ailleurs signalé comme inconnu, pas comme invalide : la nuance compte pour qui doit motiver un refus.

### Transmettre moins, et le dire

C'est l'objection la plus fréquente dans la filière : « je ne veux pas donner mes données à une plateforme ». La maquette y répond par un écran plutôt que par un discours.

Chaque détenteur règle ce qui lui appartient. Les polygones des parcelles sont à la scierie : c'est elle qui coupe leur rediffusion au-delà de son client direct, et le fabricant ne peut pas élargir ce que l'amont a restreint. Cette information est facultative pour le donneur d'ordre : la conformité est satisfaite par l'attestation de diligence raisonnée, dont le numéro de référence, lui, est transmis. De la même façon, l'identité du scieur et celle des exploitants forestiers sont exclues par défaut : le chantier reçoit la preuve que chaque maillon est adhérent et certifié, pas le carnet d'adresses de son fournisseur.

![Le tableau « qui voit quoi » de la scierie : cinq niveaux de diffusion, un réglage par donnée qui lui appartient](/img/dwx-maquette-09-partages.png)

![Chaîne d'origine dans le dossier reçu par le donneur d'ordre, avec un champ exclu et son motif affiché](/img/dwx-maquette-chaine-origine.png)

Côté client, le champ n'est pas masqué : il n'est pas transmis, et le motif est affiché. La différence est essentielle. Une donnée cachée laisse un doute sur ce qui circule réellement ; une donnée non transmise avec son motif rend la politique d'usage lisible par les deux parties, et négociable.

Chaque information du passeport dit par ailleurs qui s'engage : déclarée par l'entreprise, documentée par une pièce, contrôlée automatiquement, ou vérifiée par un tiers identifié, comme l'organisme notifié. Une signature prouve qui déclare, pas que la déclaration est exacte, et la maquette ne prétend pas le contraire. Un donneur d'ordre sait ainsi ce sur quoi il peut fonder sa propre conformité, et ce qui relève de la parole de son fournisseur. Aucun document classique ne porte cette distinction.

### Rendre la souveraineté vérifiable plutôt que de l'affirmer

![Journal des accès, en lecture seule, fourni par l'infrastructure](/img/dwx-maquette-07-journal.png)

Le dernier écran est en lecture seule et alimenté par l'infrastructure, non par l'application. C'est la condition pour qu'un journal ait une valeur : celui qui est surveillé ne tient pas le registre. Un accès hors contrat ne peut pas y apparaître, et s'il apparaissait, ce serait un incident signalé comme tel.

## Pourquoi l'infrastructure vaut plus que le cas d'usage qui la finance

Le passeport produit est le cas d'usage qui justifie l'investissement, parce qu'il est réglementaire et daté. Il serait dommage de s'y arrêter, car les mêmes mécanismes servent des besoins que la filière porte depuis longtemps sans solution.

La preuve d'origine et la diligence raisonnée exigées par le règlement déforestation reposent exactement sur la même chaîne d'héritage, avec la même attestation vérifiable. Les fiches environnementales configurées, qui conditionnent la performance carbone d'un bâtiment, demandent la même donnée de composition et d'origine. La prescription et les marques collectives de massif ont besoin d'une origine prouvée plutôt que déclarée. Les acheteurs publics qui veulent du bois local ont besoin d'une preuve opposable, pas d'une déclaration sur l'honneur. Les rapports de durabilité des donneurs d'ordre réclament des données amont vérifiables.

Chacun de ces besoins, pris isolément, ne justifie pas de construire une infrastructure de confiance. Ensemble, ils la rentabilisent plusieurs fois. C'est la logique du commun : le coût est fixe et partagé, la valeur croît avec le nombre d'usages et d'adhérents. Un profil sectoriel supplémentaire ne coûte alors que son paramétrage, pas un nouvel outil.

L'ouverture inter-domaines prolonge ce raisonnement. Une attestation forestière reconnue par le domaine bois peut être acceptée par le domaine bâtiment sur une portée nommée, sans que les deux gouvernances fusionnent. C'est ainsi qu'un écosystème de données s'étend : par accords de reconnaissance, pas par absorption.

## Ce que la maquette ne prouve pas

Une démonstration convainc d'autant mieux qu'elle énonce ses limites.

Le modèle de données, la saisie, la composition, les attestations, la vérification et les gabarits de documents correspondent à des mécanismes spécifiés et réalisables avec les composants existants. La publication au catalogue et les échanges entre domaines sont maquettés : leur mise en œuvre réelle suppose l'accès à un environnement d'infrastructure opérationnel.

Quatre chantiers restent ouverts, et il vaut mieux les nommer.

Le premier est l'arbitrage décrit plus haut : infrastructure propre à la filière ou adossement à une infrastructure existante. Il se tranchera sur des critères de coût, de calendrier et de réversibilité, une fois les règles du domaine stabilisées.

L'entrée des petites entreprises est le véritable goulot d'étranglement. Une identité numérique d'entreprise fiable conditionne l'accès à un data space, et l'outillage public disponible ne couvre pas encore le mandat donné à un salarié par une société privée. Le portefeuille européen d'identité arrive pour les personnes, le portefeuille d'entreprise viendra ensuite. Entre les deux, il faut une solution de transition, et c'est autant un sujet de politique publique qu'un sujet technique.

Le générateur de documents réglementaires ne doit pas être écrit de zéro si des projets européens produisent déjà cette brique. Mieux vaut instruire l'existant avant de développer.

Enfin, la maquette montre des interfaces. Elle ne dit rien des règles qui feront qu'un acteur accepte de publier un lot : qui arbitre les décisions du domaine, comment on y entre et comment on en sort, qui porte la responsabilité en cas de litige sur une donnée héritée. Ce chantier est celui de la gouvernance, et aucun outil ne le remplacera.

## Ce que nous attendons de vous

La maquette est faite pour être critiquée. Les vocabulaires, les enchaînements et les informations affichées viennent du terrain, pas d'une intuition de concepteur. Ce sont vos corrections qui les rendront justes.

Trois questions nous sont particulièrement utiles. Un écran manque-t-il à votre métier ? Un champ affiché est-il commercialement inacceptable dans votre contexte ? Le niveau de traçabilité que vous pouvez réellement atteindre correspond-il à celui que la maquette suppose ?

> **Ouvrir la maquette et nous dire ce qui cloche.** Neuf étapes guidées, environ six minutes, sur un navigateur récent. Le mode guidé se coupe à tout moment pour explorer les écrans librement.
>
> [Ouvrir la maquette DataWood-X](/maquette/) · [Nous écrire](#/rejoindre)

Pour le cadre général, le [livre blanc sur le passeport numérique produit et le data space de la filière bois](/docs/livre-blanc-dpp-dataspace-filiere-bois-2026.pdf) et l'article [pourquoi le passeport numérique produit a besoin d'un data space](#/blog/2026-08-27-pourquoi-le-passeport-numerique-produit-a-besoin-dun-dataspace) développent le raisonnement qui précède ces choix d'architecture.
