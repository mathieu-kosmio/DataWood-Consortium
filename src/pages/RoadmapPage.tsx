import React from 'react';

type Etat = 'fait' | 'encours' | 'avenir';

interface Jalon {
    texte: string;
    etat: Etat;
    detail?: string;
}

interface Phase {
    periode: string;
    titre: string;
    objectif: string;
    statut: 'terminee' | 'encours' | 'avenir';
    jalons: Jalon[];
}

const PHASES: Phase[] = [
    {
        periode: '2024-2025',
        titre: 'Préfiguration',
        objectif: 'Poser les fondations et vérifier que le besoin est collectif.',
        statut: 'terminee',
        jalons: [
            { texte: 'Définition de la gouvernance et des principes de l’initiative', etat: 'fait' },
            { texte: 'Cartographie V1 des initiatives et des acteurs de la filière', etat: 'fait' },
            { texte: 'Stabilisation des cinq cas d’usage pilotes, de la forêt au bâtiment', etat: 'fait' },
        ],
    },
    {
        periode: '2026',
        titre: 'Cadrage collectif',
        objectif: 'Construire le consortium, arrêter l’architecture et préparer le déploiement.',
        statut: 'encours',
        jalons: [
            { texte: 'Labellisation et portage filière avec Xylofutur', etat: 'fait' },
            { texte: 'Présentation à la filière, assemblée générale Xylofutur', etat: 'fait', detail: 'avril 2026' },
            { texte: 'Cartographie enrichie et lecture chiffrée de l’écosystème numérique', etat: 'fait', detail: 'juin 2026' },
            { texte: 'Livre blanc sur le passeport numérique produit et le data space', etat: 'fait', detail: 'août 2026' },
            {
                texte: 'Choix d’architecture : adossement à une infrastructure de data space existante plutôt que reconstruction',
                etat: 'fait',
                detail: 'septembre 2026',
            },
            {
                texte: 'Modèle produit : un modèle de données unique et deux outils, Passeport pour les détenteurs de données, Portail pour les donneurs d’ordre',
                etat: 'fait',
                detail: 'septembre 2026',
            },
            {
                texte: 'Maquette fonctionnelle des deux outils, jouée sur la chaîne bois construction',
                etat: 'fait',
                detail: 'septembre 2026',
            },
            {
                texte: 'Ateliers de cadrage par cas d’usage : flux de données prioritaires, maturité des dispositifs existants',
                etat: 'encours',
                detail: 'été-automne 2026',
            },
            {
                texte: 'Spécifications fonctionnelles et techniques des deux outils',
                etat: 'encours',
            },
            {
                texte: 'Structuration de la gouvernance : modèle multi-acteurs, structure d’exploitation, modèle économique',
                etat: 'encours',
            },
            {
                texte: 'Candidature au dispositif France 2030 « Espaces de données » pour financer la phase de développement',
                etat: 'avenir',
                detail: 'fin 2026',
            },
        ],
    },
    {
        periode: '2027-2029',
        titre: 'Développement',
        objectif: 'Déployer l’infrastructure fédérée et la mettre en service chez les premiers adhérents.',
        statut: 'avenir',
        jalons: [
            {
                texte: 'Socle commun : référentiels partagés, modèle objet bois, origine et diligence raisonnée, générateur de documents réglementaires',
                etat: 'avenir',
            },
            { texte: 'Démonstrateurs par cas d’usage, de l’amont forestier au bâtiment', etat: 'avenir' },
            {
                texte: 'Interopérabilité avec les dispositifs existants : FORETDATA, eMOBOIS, catalogue bois construction, valorisation environnementale, BIM',
                etat: 'avenir',
            },
            { texte: 'Premiers adhérents en production et montée en charge de la gouvernance', etat: 'avenir' },
        ],
    },
    {
        periode: '2029 et au-delà',
        titre: 'Exploitation pérenne',
        objectif: 'Un commun numérique autofinancé au service de la filière.',
        statut: 'avenir',
        jalons: [
            { texte: 'Ouverture progressive à l’ensemble des acteurs de la filière', etat: 'avenir' },
            { texte: 'Connexion des éditeurs de logiciels et des plateformes métier', etat: 'avenir' },
            {
                texte: 'Services d’intérêt général : traçabilité réglementaire, passeport produit, données d’impact',
                etat: 'avenir',
            },
        ],
    },
];

const ECHEANCES: { date: string; texte: string }[] = [
    { date: 'Janvier 2026', texte: 'Règlement produits de construction applicable, passeport numérique inscrit dans le droit' },
    { date: 'Décembre 2026', texte: 'Règlement déforestation applicable aux grands et moyens opérateurs' },
    { date: 'Fin de décennie', texte: 'Écoconception : acte délégué attendu pour le mobilier' },
];

const MARQUEURS: Record<Etat, { signe: string; classe: string; libelle: string }> = {
    fait: { signe: '✓', classe: 'text-emerald-600', libelle: 'terminé' },
    encours: { signe: '◐', classe: 'text-amber-600', libelle: 'en cours' },
    avenir: { signe: '○', classe: 'text-slate-400', libelle: 'à venir' },
};

export const RoadmapPage: React.FC = () => {
    return (
        <div className="bg-white py-20 px-6">
            <div className="max-w-3xl mx-auto text-center mb-6">
                <h1 className="text-5xl font-black mb-6">Feuille de route</h1>
                <p className="text-xl text-slate-500">
                    Une trajectoire progressive, fondée sur l’existant et validée collectivement.
                </p>
            </div>

            <div className="max-w-3xl mx-auto text-center mb-16">
                <p className="text-sm text-slate-400">Dernière mise à jour : 17 septembre 2026</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
                    {(Object.keys(MARQUEURS) as Etat[]).map((k) => (
                        <span key={k} className="inline-flex items-center gap-2">
                            <span className={`${MARQUEURS[k].classe} font-bold`} aria-hidden="true">
                                {MARQUEURS[k].signe}
                            </span>
                            {MARQUEURS[k].libelle}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-3xl mx-auto relative pl-8 border-l-2 border-slate-100">
                {PHASES.map((phase, pi) => {
                    const active = phase.statut === 'encours';
                    const terminee = phase.statut === 'terminee';
                    return (
                        <div key={phase.titre} className={pi === PHASES.length - 1 ? 'relative' : 'mb-16 relative'}>
                            <div
                                className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full ring-4 ring-white ${
                                    active ? 'bg-emerald-500' : terminee ? 'bg-emerald-200' : 'bg-slate-200'
                                }`}
                            ></div>

                            <div
                                className={`text-sm font-bold mb-2 ${
                                    active ? 'text-emerald-600' : terminee ? 'text-emerald-700/70' : 'text-slate-400'
                                }`}
                            >
                                {active ? 'EN COURS' : terminee ? 'TERMINÉ' : 'À VENIR'} • {phase.periode}
                            </div>

                            <h2 className={`text-3xl font-bold mb-3 ${active || terminee ? '' : 'text-slate-400'}`}>
                                {phase.titre}
                            </h2>
                            <p className="text-slate-500 mb-5">{phase.objectif}</p>

                            <div
                                className={`p-6 rounded-2xl border ${
                                    active
                                        ? 'bg-emerald-50 border-emerald-100'
                                        : terminee
                                          ? 'bg-slate-50 border-slate-100'
                                          : 'bg-white border-slate-100'
                                }`}
                            >
                                <ul className="space-y-3">
                                    {phase.jalons.map((jalon) => (
                                        <li key={jalon.texte} className="flex items-start gap-3">
                                            <span
                                                className={`${MARQUEURS[jalon.etat].classe} font-bold leading-7`}
                                                title={MARQUEURS[jalon.etat].libelle}
                                            >
                                                {MARQUEURS[jalon.etat].signe}
                                            </span>
                                            <span className="text-slate-700 leading-7">
                                                {jalon.texte}
                                                {jalon.detail && (
                                                    <span className="text-slate-400"> · {jalon.detail}</span>
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="max-w-3xl mx-auto mt-20">
                <h2 className="text-2xl font-bold mb-2">Les échéances qui cadencent la trajectoire</h2>
                <p className="text-slate-500 mb-6">
                    Le calendrier du consortium n’est pas choisi librement : il suit celui des obligations
                    européennes qui s’appliquent aux entreprises de la filière.
                </p>
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                    {ECHEANCES.map((e, i) => (
                        <div
                            key={e.date}
                            className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 px-6 py-4 ${
                                i === 0 ? '' : 'border-t border-slate-100'
                            }`}
                        >
                            <div className="w-40 shrink-0 font-bold text-slate-900">{e.date}</div>
                            <div className="text-slate-600">{e.texte}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-3xl mx-auto mt-16 text-center">
                <p className="text-slate-500 mb-4">
                    Cette feuille de route est révisée à chaque étape franchie. Les acteurs de la filière qui
                    souhaitent contribuer au cadrage sont les bienvenus.
                </p>
                <a
                    href="#/rejoindre"
                    className="inline-block bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
                >
                    Rejoindre les travaux
                </a>
            </div>
        </div>
    );
};
