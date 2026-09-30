import React, { useState } from 'react';
import { ACTEURS_FILIERE, ActeurFiliere } from '../data/acteursFiliere';

const CARTOGRAPHIE_URL = 'https://mappings.kosmio.dev/DataWood/datawood/explorer';
const NB_RANGEES = 2;

// Empreinte FNV-1a : ordre mélangé mais stable, pour que les logos d'un même réseau (Fibois, Bois de…) ne se suivent pas
const empreinte = (texte: string) => {
    let h = 2166136261;
    for (let i = 0; i < texte.length; i++) {
        h ^= texte.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};

const RANGEES: ActeurFiliere[][] = (() => {
    const melanges = [...ACTEURS_FILIERE].sort((a, b) => empreinte(a.nom) - empreinte(b.nom));
    return Array.from({ length: NB_RANGEES }, (_, r) => melanges.filter((_, i) => i % NB_RANGEES === r));
})();

// Chaque rangée est rendue deux fois bout à bout : la piste glisse de -50 % puis reboucle sans à-coup
const Logos: React.FC<{ acteurs: ActeurFiliere[]; copie?: boolean }> = ({ acteurs, copie }) => (
    <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={copie || undefined}>
        {acteurs.map((acteur) => (
            <li key={acteur.logo} className="flex shrink-0 items-center justify-center">
                <img
                    src={acteur.logo}
                    alt={copie ? '' : acteur.nom}
                    title={acteur.nom}
                    width={acteur.largeur}
                    height={acteur.hauteur}
                    loading="lazy"
                    decoding="async"
                    className="max-w-none grayscale opacity-75 transition hover:grayscale-0 hover:opacity-100"
                    style={{ width: acteur.largeur, height: acteur.hauteur }}
                />
            </li>
        ))}
    </ul>
);

export const ActeursFiliere: React.FC = () => {
    const [enPause, setEnPause] = useState(false);

    return (
        <section className="relative max-w-6xl mx-auto" aria-labelledby="acteurs-filiere-titre">
            <h2
                id="acteurs-filiere-titre"
                className="text-center text-sm text-slate-400 font-medium uppercase tracking-widest mb-8"
            >
                Les acteurs de la filière bois
            </h2>

            <div className={`defilement space-y-8${enPause ? ' en-pause' : ''}`}>
                {RANGEES.map((rangee, r) => (
                    <div key={r} className="defilement-rangee">
                        <div
                            className="defilement-piste"
                            style={{
                                animationDuration: `${rangee.length * 4}s`,
                                animationDirection: r % 2 ? 'reverse' : 'normal',
                            }}
                        >
                            <Logos acteurs={rangee} />
                            <Logos acteurs={rangee} copie />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
                <a
                    href={CARTOGRAPHIE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-semibold text-emerald-700 underline decoration-emerald-200 underline-offset-4 hover:decoration-emerald-600"
                >
                    Voir la cartographie de l'écosystème
                    <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="sr-only">(nouvel onglet)</span>
                </a>
                <button
                    type="button"
                    onClick={() => setEnPause(!enPause)}
                    className="defilement-bouton text-xs font-medium text-slate-400 hover:text-slate-600"
                >
                    {enPause ? 'Reprendre le défilement' : 'Mettre en pause le défilement'}
                </button>
            </div>
        </section>
    );
};
