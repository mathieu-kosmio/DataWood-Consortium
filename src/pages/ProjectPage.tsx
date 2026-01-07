
import React from 'react';

export const ProjectPage: React.FC = () => {
    return (
        <div className="bg-white">
            {/* Hero */}
            <div className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">Le Projet</div>
                        <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                            Une démarche collective <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">au service de la filière</span>
                        </h1>
                        <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                            Le projet DataWood Consortium vise à structurer, en amont, la gouvernance et les connaissances nécessaires au partage de données dans la filière forêt-bois, sans développer de solution technique propriétaire.
                        </p>
                    </div>
                    <div className="relative flex items-center justify-center">
                        <img
                            src="/images/project-visual.png"
                            alt="De la forêt aux données connectées"
                            className="w-full max-w-md h-auto drop-shadow-2xl"
                        />
                    </div>
                </div>
            </div>

            {/* 5 Pillars Section */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-black text-slate-900">Les 5 piliers du consortium</h2>
                    <p className="text-slate-500 mt-4">Nos objectifs stratégiques pour 2025.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Socle de Connaissance", icon: "📚", color: "bg-blue-50 text-blue-600", desc: "Rassembler et documenter les référentiels existants." },
                        { title: "Mise en lisibilité", icon: "👀", color: "bg-purple-50 text-purple-600", desc: "Cartographier les initiatives pour y voir clair." },
                        { title: "Interopérabilité", icon: "🔌", color: "bg-emerald-50 text-emerald-600", desc: "Définir les standards d'échange sans imposer d'outils." },
                        { title: "Gouvernance", icon: "⚖️", color: "bg-amber-50 text-amber-600", desc: "Créer un cadre de confiance neutre et partagé." },
                        { title: "Data Space", icon: "🌌", color: "bg-slate-50 text-slate-600", desc: "Préparer le futur espace de données européen." }
                    ].map((item, i) => (
                        <div key={i} className={`p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 ${i === 3 || i === 4 ? 'md:col-span-1.5' : ''}`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 ${item.color}`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};
