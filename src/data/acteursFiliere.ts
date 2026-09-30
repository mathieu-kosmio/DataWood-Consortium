// Acteurs principaux de la filière forêt-bois : les 44 acteurs affichés sur la carte en bulles
// de la cartographie DataWood (https://mappings.kosmio.dev/DataWood/datawood/explorer).
// Instantané du 30/09/2026 : logos copiés dans public/images/acteurs/, rognés et convertis en WebP.
// largeur / hauteur : taille d'affichage en px, calculée pour donner un poids visuel comparable à chaque logo.

export interface ActeurFiliere {
  nom: string;
  logo: string;
  largeur: number;
  hauteur: number;
}

export const ACTEURS_FILIERE: ActeurFiliere[] = [
  { nom: "Alliance Forêts Bois", logo: "/images/acteurs/alliance-forets-bois.webp", largeur: 56, hauteur: 57 },
  { nom: "Ameublement Français", logo: "/images/acteurs/ameublement-francais.webp", largeur: 57, hauteur: 57 },
  { nom: "APEP", logo: "/images/acteurs/apep.webp", largeur: 60, hauteur: 53 },
  { nom: "Bois de France", logo: "/images/acteurs/bois-de-france.webp", largeur: 57, hauteur: 57 },
  { nom: "Bois des Alpes", logo: "/images/acteurs/bois-des-alpes.webp", largeur: 62, hauteur: 51 },
  { nom: "Bois des Pyrénées", logo: "/images/acteurs/bois-des-pyrenees.webp", largeur: 57, hauteur: 57 },
  { nom: "Bois Territoires Massif Central", logo: "/images/acteurs/bois-territoires-massif-central.webp", largeur: 58, hauteur: 55 },
  { nom: "CAPEB", logo: "/images/acteurs/capeb.webp", largeur: 81, hauteur: 39 },
  { nom: "CEPF", logo: "/images/acteurs/cepf.webp", largeur: 89, hauteur: 36 },
  { nom: "CNP", logo: "/images/acteurs/cnp.webp", largeur: 48, hauteur: 58 },
  { nom: "CNPF", logo: "/images/acteurs/cnpf.webp", largeur: 90, hauteur: 35 },
  { nom: "CODIFAB", logo: "/images/acteurs/codifab.webp", largeur: 91, hauteur: 35 },
  { nom: "COPACEL", logo: "/images/acteurs/copacel.webp", largeur: 56, hauteur: 57 },
  { nom: "CRITT Bois", logo: "/images/acteurs/critt-bois.webp", largeur: 57, hauteur: 57 },
  { nom: "CRITT Bois", logo: "/images/acteurs/critt-bois-2.webp", largeur: 57, hauteur: 57 },
  { nom: "CSTB", logo: "/images/acteurs/cstb.webp", largeur: 57, hauteur: 57 },
  { nom: "FBIE", logo: "/images/acteurs/fbie.webp", largeur: 61, hauteur: 53 },
  { nom: "Fibois Auvergne-Rhône-Alpes", logo: "/images/acteurs/fibois-auvergne-rhone-alpes.webp", largeur: 57, hauteur: 57 },
  { nom: "Fibois Bourgogne-Franche-Comté", logo: "/images/acteurs/fibois-bourgogne-franche-comte.webp", largeur: 67, hauteur: 48 },
  { nom: "Fibois France", logo: "/images/acteurs/fibois-france.webp", largeur: 77, hauteur: 41 },
  { nom: "Fibois Grand Est", logo: "/images/acteurs/fibois-grand-est.webp", largeur: 57, hauteur: 57 },
  { nom: "Fibois Nouvelle-Aquitaine", logo: "/images/acteurs/fibois-nouvelle-aquitaine.webp", largeur: 105, hauteur: 30 },
  { nom: "Fibois Pays de la Loire", logo: "/images/acteurs/fibois-pays-de-la-loire.webp", largeur: 57, hauteur: 57 },
  { nom: "Fibois Sud", logo: "/images/acteurs/fibois-sud.webp", largeur: 57, hauteur: 57 },
  { nom: "FNB", logo: "/images/acteurs/fnb.webp", largeur: 83, hauteur: 39 },
  { nom: "Fncofor", logo: "/images/acteurs/fncofor.webp", largeur: 83, hauteur: 38 },
  { nom: "FNEDT", logo: "/images/acteurs/fnedt.webp", largeur: 97, hauteur: 33 },
  { nom: "France DOUGLAS", logo: "/images/acteurs/france-douglas.webp", largeur: 76, hauteur: 42 },
  { nom: "Fransylva", logo: "/images/acteurs/fransylva.webp", largeur: 66, hauteur: 49 },
  { nom: "French Timber", logo: "/images/acteurs/french-timber.webp", largeur: 94, hauteur: 34 },
  { nom: "IBC", logo: "/images/acteurs/ibc.webp", largeur: 57, hauteur: 56 },
  { nom: "Lignum Corsica", logo: "/images/acteurs/lignum-corsica.webp", largeur: 60, hauteur: 53 },
  { nom: "ONF", logo: "/images/acteurs/onf.webp", largeur: 85, hauteur: 38 },
  { nom: "Pro Silva France", logo: "/images/acteurs/pro-silva-france.webp", largeur: 57, hauteur: 57 },
  { nom: "PROPELLET", logo: "/images/acteurs/propellet.webp", largeur: 56, hauteur: 57 },
  { nom: "SEILA", logo: "/images/acteurs/seila.webp", largeur: 87, hauteur: 37 },
  { nom: "UCFF", logo: "/images/acteurs/ucff.webp", largeur: 83, hauteur: 39 },
  { nom: "UFME", logo: "/images/acteurs/ufme.webp", largeur: 98, hauteur: 33 },
  { nom: "UICB", logo: "/images/acteurs/uicb.webp", largeur: 85, hauteur: 37 },
  { nom: "UIPC", logo: "/images/acteurs/uipc.webp", largeur: 62, hauteur: 52 },
  { nom: "UIPP", logo: "/images/acteurs/uipp.webp", largeur: 57, hauteur: 57 },
  { nom: "UMB-FFB", logo: "/images/acteurs/umb-ffb.webp", largeur: 62, hauteur: 51 },
  { nom: "UNAMA", logo: "/images/acteurs/unama.webp", largeur: 57, hauteur: 57 },
  { nom: "Xylofutur", logo: "/images/acteurs/xylofutur.webp", largeur: 67, hauteur: 48 },
];
