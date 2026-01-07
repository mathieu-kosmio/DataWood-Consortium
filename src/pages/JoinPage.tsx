import React from 'react';

export const JoinPage: React.FC = () => {
    return (
        <div className="bg-white">
            <div className="bg-slate-900 text-white py-24 text-center px-6">
                <h1 className="text-5xl font-black mb-6">Rejoindre le DataWood Consortium</h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">Le DataWood Consortium s’adresse à tous les acteurs impliqués dans les données de la filière forêt-bois, quel que soit leur niveau de maturité.</p>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20 -mt-20">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col">
                        <div className="text-4xl mb-6">🏭</div>
                        <h3 className="text-2xl font-bold mb-2">Acteurs Filière</h3>
                        <p className="text-slate-500 mb-8 flex-grow">Scieries, Exploitants, Transformateurs...</p>
                        <ul className="space-y-3 mb-8 text-sm text-slate-600">
                            <li>✓ Influencez les standards</li>
                            <li>✓ Anticipez la réglementation</li>
                            <li>✓ Accédez à l'expertise</li>
                        </ul>
                        <button className="w-full py-3 border-2 border-slate-200 rounded-xl font-bold hover:border-emerald-500 hover:text-emerald-600 transition-colors">Nous écrire</button>
                    </div>

                    {/* Card 2 - Main */}
                    <div className="bg-emerald-600 text-white p-8 rounded-3xl shadow-2xl shadow-emerald-900/20 transform lg:-translate-y-4 flex flex-col">
                        <div className="text-4xl mb-6">💻</div>
                        <h3 className="text-2xl font-bold mb-2">Éditeurs Tech</h3>
                        <p className="text-emerald-100 mb-8 flex-grow">Solutions logicielles, IoT, Startups...</p>
                        <ul className="space-y-3 mb-8 text-sm font-medium">
                            <li>✓ Intégrez les standards nativement</li>
                            <li>✓ Gagnez en visibilité</li>
                            <li>✓ Simplifiez vos intégrations</li>
                        </ul>
                        <button className="w-full py-3 bg-white text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-colors">Devenir Partenaire</button>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col">
                        <div className="text-4xl mb-6">🏛️</div>
                        <h3 className="text-2xl font-bold mb-2">Institutions</h3>
                        <p className="text-slate-500 mb-8 flex-grow">Organismes publics, Fédérations...</p>
                        <ul className="space-y-3 mb-8 text-sm text-slate-600">
                            <li>✓ Portez une vision commune</li>
                            <li>✓ Sécurisez vos investissements data</li>
                            <li>✓ Évitez la fragmentation</li>
                        </ul>
                        <button className="w-full py-3 border-2 border-slate-200 rounded-xl font-bold hover:border-emerald-500 hover:text-emerald-600 transition-colors">Contacter le bureau</button>
                    </div>
                </div>

                <div className="mt-24 max-w-2xl mx-auto bg-slate-50 p-8 rounded-3xl text-center">
                    <h3 className="text-2xl font-bold mb-4">Une question ?</h3>
                    <p className="text-slate-500 mb-6">Envoyez-nous un message directement.</p>
                    <a href="mailto:contact@datawood.org" className="text-emerald-600 font-bold text-xl hover:underline">contact@datawood.org</a>
                </div>
            </div>
        </div>
    );
};
