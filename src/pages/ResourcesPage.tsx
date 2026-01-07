
import React from 'react';

export const ResourcesPage: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-black mb-12">Ressources & Documentation</h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { type: "PDF", title: "Charte du Consortium", date: "Juin 2024", size: "2.4 MB" },
                        { type: "PDF", title: "Rapport d'activité 2023", date: "Jan 2024", size: "12 MB" },
                        { type: "XLS", title: "Inventaire des initiatives (Extract)", date: "Mai 2024", size: "450 KB" },
                        { type: "FIG", title: "Kit Média & Logos", date: "2024", size: "ZIP" },
                        { type: "PDF", title: "Flyer de présentation", date: "2024", size: "1.2 MB" },
                    ].map((doc, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="font-bold text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{doc.type}</span>
                                <span className="text-slate-400 text-xs">{doc.date}</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-emerald-700 transition-colors">{doc.title}</h3>
                            <div className="text-sm text-slate-400">{doc.size} • Télécharger</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
