import React from 'react';

export const ConsortiumPage: React.FC = () => {
    return (
        <div className="bg-white">
            <div className="bg-emerald-900 text-white py-20 px-6 text-center">
                <p className="text-emerald-200 text-sm uppercase tracking-[0.3em] mb-5">Datawood Pact</p>
                <h1 className="text-4xl lg:text-6xl font-black mb-6">Charte pour la digitalisation responsable</h1>
                <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
                    Charte pour la digitalisation responsable de la filière bois et de l’innovation ouverte de la filière forêt-bois.
                </p>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-20">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 lg:p-12">
                    <div className="flex flex-col gap-10">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4">Préambule</h2>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                La filière forêt-bois est engagée dans une transformation progressive de ses pratiques, portée
                                notamment par la digitalisation, l’échange d’informations et le développement de projets numériques.
                                Ces dynamiques offrent de fortes opportunités : meilleure coordination entre acteurs,
                                valorisation des initiatives existantes, efficacité collective accrue, innovation plus rapide et plus utile.
                            </p>
                            <p className="text-slate-600 text-lg leading-relaxed mt-4">
                                Elles soulèvent également des enjeux essentiels de confiance, de protection des informations,
                                de respect des métiers et de coopération équilibrée. La présente charte propose un cadre commun
                                de bonnes pratiques, volontaire et non contraignant, afin de favoriser une digitalisation responsable
                                et une innovation ouverte au service de l’ensemble de la filière.
                            </p>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 lg:p-8">
                            <h2 className="text-2xl font-black text-slate-900 mb-4">Objet de la charte</h2>
                            <ul className="space-y-3 text-slate-700 text-base">
                                {[
                                    "Encourager des pratiques numériques responsables et coopératives.",
                                    "Faciliter la compréhension et la complémentarité des initiatives existantes.",
                                    "Créer un climat de confiance propice aux projets collectifs.",
                                    "Garantir le respect absolu des informations privées, sensibles ou stratégiques."
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500"></span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-slate-500 text-sm mt-4">
                                Elle n’a pas de valeur contractuelle et n’impose aucune obligation juridique, technique ou économique à ses signataires.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-6">Principes partagés</h2>
                            <div className="grid lg:grid-cols-2 gap-6">
                                {[
                                    {
                                        title: "1. Digitalisation au service des métiers",
                                        items: [
                                            "Soutenir les pratiques professionnelles existantes.",
                                            "Respecter la diversité des modèles économiques et organisationnels.",
                                            "S’adapter aux réalités de terrain de la filière forêt-bois."
                                        ]
                                    },
                                    {
                                        title: "2. Coopération et complémentarité",
                                        items: [
                                            "Reconnaître la légitimité des initiatives existantes.",
                                            "Favoriser leur mise en visibilité et leur articulation.",
                                            "Valoriser la complémentarité plutôt que l’isolement."
                                        ],
                                        footnote: "Chacun reste libre de ses choix stratégiques, tout en favorisant un esprit de coopération lorsque cela est pertinent."
                                    },
                                    {
                                        title: "3. Partage raisonné des initiatives",
                                        items: [
                                            "Partager des retours d’expérience lorsque cela est possible.",
                                            "Décrire les initiatives existantes de façon lisible.",
                                            "Clarifier les périmètres, objectifs et usages des projets numériques."
                                        ],
                                        footnote: "Ce partage vise la lisibilité collective, non l’appropriation ou la standardisation forcée."
                                    },
                                    {
                                        title: "4. Respect absolu des informations sensibles",
                                        items: [
                                            "Aucune donnée privée ou confidentielle ne doit être partagée sans consentement explicite.",
                                            "Chaque acteur reste propriétaire et responsable de ses données et savoir-faire.",
                                            "La participation collective ne vaut jamais obligation de transmission."
                                        ],
                                        footnote: "La confidentialité prévaut toujours sur les objectifs de coopération."
                                    },
                                    {
                                        title: "5. Innovation ouverte et progressive",
                                        items: [
                                            "Favoriser des échanges ouverts, progressifs et pragmatiques.",
                                            "Reconnaître que l’expérimentation fait partie des dynamiques numériques.",
                                            "Accepter que toutes les initiatives n’aient pas vocation à converger."
                                        ],
                                        footnote: "L’évolution collective se construit par étapes."
                                    },
                                    {
                                        title: "6. Neutralité et respect des positions",
                                        items: [
                                            "Ne promouvoir aucune solution, technologie ou acteur en particulier.",
                                            "Ne pas remettre en cause les activités existantes.",
                                            "Ne pas imposer d’alignement stratégique."
                                        ],
                                        footnote: "La charte crée un socle commun de confiance compatible avec la diversité des acteurs."
                                    }
                                ].map((item) => (
                                    <div key={item.title} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                                        <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                                        <ul className="space-y-2 text-sm text-slate-600">
                                            {item.items.map((point) => (
                                                <li key={point} className="flex items-start gap-3">
                                                    <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500"></span>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {item.footnote && (
                                            <p className="text-slate-500 text-sm mt-4">{item.footnote}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-emerald-900 mb-4">Ce que cette charte est</h3>
                                <ul className="space-y-3 text-slate-700 text-sm">
                                    {[
                                        "Un cadre de référence volontaire.",
                                        "Un signal positif d’ouverture et de responsabilité.",
                                        "Un outil de confiance pour les collaborations numériques."
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500"></span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-slate-900 rounded-2xl p-6 text-white">
                                <h3 className="text-xl font-bold mb-4">Ce que cette charte n’est pas</h3>
                                <ul className="space-y-3 text-emerald-100 text-sm">
                                    {[
                                        "Un engagement contractuel.",
                                        "Un cadre de gouvernance contraignant.",
                                        "Une obligation de partage de données ou de technologies."
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <span className="mt-2 h-2 w-2 rounded-full bg-emerald-400"></span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 shadow-sm">
                            <h2 className="text-2xl font-black text-slate-900 mb-4">Adhésion</h2>
                            <p className="text-slate-600 text-base leading-relaxed mb-4">
                                En adhérant à cette charte, les signataires déclarent partager les principes énoncés ci-dessus,
                                soutenir une digitalisation responsable et coopérative de la filière forêt-bois, agir, lorsque cela est
                                possible, dans un esprit de dialogue, de complémentarité et de respect mutuel.
                            </p>
                            <p className="text-slate-500 text-sm">
                                Cette adhésion est libre, réversible et sans condition opérationnelle.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-24 space-y-16">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-8">Gouvernance</h2>
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
                    </div>

                    {/* Partners Grid */}
                    <div>
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
        </div>
    );
};
