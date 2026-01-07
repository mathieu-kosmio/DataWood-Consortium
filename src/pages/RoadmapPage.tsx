
import React from 'react';

export const RoadmapPage: React.FC = () => {
    return (
        <div className="bg-white py-20 px-6">
            <div className="max-w-4xl mx-auto text-center mb-20">
                <h1 className="text-5xl font-black mb-6">Feuille de Route</h1>
                <p className="text-xl text-slate-500">Notre trajectoire pour construire le commun numérique.</p>
            </div>

            <div className="max-w-3xl mx-auto relative pl-8 border-l-2 border-slate-100">
                {/* Item 1 */}
                <div className="mb-16 relative">
                    <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-emerald-500 ring-4 ring-white"></div>
                    <div className="text-sm font-bold text-emerald-600 mb-2">NOW • 2024-2025</div>
                    <h2 className="text-3xl font-bold mb-4">Phase de Préfiguration</h2>
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Création de la gouvernance</li>
                            <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Rédaction de la Charte</li>
                            <li className="flex items-center gap-3"><span className="text-slate-400">○</span> État de l'art consolidé</li>
                            <li className="flex items-center gap-3"><span className="text-slate-400">○</span> Lancement du Wiki</li>
                        </ul>
                    </div>
                </div>

                {/* Item 2 */}
                <div className="mb-16 relative">
                    <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-slate-200 ring-4 ring-white"></div>
                    <div className="text-sm font-bold text-slate-400 mb-2">NEXT • 2025-2026</div>
                    <h2 className="text-3xl font-bold mb-4 text-slate-400">Projection Data Space</h2>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 opacity-60">
                        <p className="text-slate-500">Définition des scénarios techniques d'interopérabilité et sécurisation du modèle économique pérenne.</p>
                    </div>
                </div>

                {/* Item 3 */}
                <div className="relative">
                    <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-slate-200 ring-4 ring-white"></div>
                    <div className="text-sm font-bold text-slate-400 mb-2">FUTURE • 2027+</div>
                    <h2 className="text-3xl font-bold mb-4 text-slate-400">Déploiement Opérationnel</h2>
                </div>
            </div>
        </div>
    );
};
