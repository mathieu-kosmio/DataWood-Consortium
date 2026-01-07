
import React from 'react';

export const ConsortiumPage: React.FC = () => {
    return (
        <div className="bg-white">
            <div className="bg-emerald-900 text-white py-20 px-6 text-center">
                <h1 className="text-4xl lg:text-6xl font-black mb-6">Une gouvernance <br /> ouverte et distribuée</h1>
                <p className="text-xl text-emerald-100 max-w-2xl mx-auto">Le DataWood Consortium n'appartient à personne. Il appartient à la filière.</p>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-24">
                {/* Org Chart */}
                <div className="grid md:grid-cols-3 gap-8 items-start relative">
                    {/* Connector Line */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-slate-200 -z-10"></div>

                    {/* Nodes */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-emerald-500 text-center">
                        <h3 className="font-black text-xl mb-2">Comité de Pilotage</h3>
                        <p className="text-sm text-slate-500 mb-4">Instance Décisionnelle</p>
                        <div className="text-left text-sm space-y-2 bg-slate-50 p-4 rounded-xl">
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Stratégie</div>
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Choix tech</div>
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Adhésions</div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-emerald-500 text-center mt-12 md:mt-0">
                        <h3 className="font-black text-xl mb-2">Animation</h3>
                        <p className="text-sm text-slate-500 mb-4">Coordination</p>
                        <div className="text-left text-sm space-y-2 bg-slate-50 p-4 rounded-xl">
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Gestion projet</div>
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Communication</div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-emerald-500 text-center">
                        <h3 className="font-black text-xl mb-2">Groupes de Travail</h3>
                        <p className="text-sm text-slate-500 mb-4">Production</p>
                        <div className="text-left text-sm space-y-2 bg-slate-50 p-4 rounded-xl">
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> GT Sémantique</div>
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> GT Traçabilité</div>
                            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> GT Business</div>
                        </div>
                    </div>
                </div>

                {/* Partners Grid */}
                <div className="mt-32">
                    <h2 className="text-3xl font-black text-center mb-12">Ils nous soutiennent</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder Logos */}
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="h-20 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400">Logo {i + 1}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
