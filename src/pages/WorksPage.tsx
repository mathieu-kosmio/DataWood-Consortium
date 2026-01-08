
import React from 'react';

export const WorksPage: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <h1 className="text-5xl font-black mb-12">Travaux & Livrables</h1>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Highlight Card */}
                    <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-xl flex flex-col justify-between h-[500px] relative overflow-hidden group cursor-pointer hover:border-emerald-500 transition-all">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Phare</span>
                            <h2 className="text-4xl font-bold mt-6 mb-4">État de l’art des initiatives data</h2>
                            <p className="text-slate-500 text-lg leading-relaxed max-w-md">Une cartographie documentée des projets, formats et référentiels existants dans la filière forêt-bois.</p>
                        </div>
                        <div className="relative z-10 mt-auto">
                            <a
                                href="https://www.notion.so/kosmio/DWC-Travaux-et-livrables-2e2d2a1120b680019174e56c63445eb1"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                            >
                                Consulter le rapport
                            </a>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {/* Smaller Cards */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">🧩</div>
                            <div>
                                <h3 className="text-xl font-bold">Wiki DataWood</h3>
                                <p className="text-slate-500 text-sm">Base de connaissances technique.</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer flex items-center gap-6">
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl">🗺️</div>
                            <div>
                                <h3 className="text-xl font-bold">Cartographies</h3>
                                <p className="text-slate-500 text-sm">Flux de données et acteurs.</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer flex items-center gap-6">
                            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl">📝</div>
                            <div>
                                <h3 className="text-xl font-bold">Standards V1</h3>
                                <p className="text-slate-500 text-sm">Premières spécifications d'échange.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
