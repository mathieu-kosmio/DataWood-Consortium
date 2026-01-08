import React, { useState, useEffect, useRef } from 'react';

const brevoFormHtml = `
<div class="sib-form" style="text-align: center; background-color: #EFF2F7;">
  <div id="sib-form-container" class="sib-form-container">
    <div id="error-message" class="sib-form-message-panel" style="font-size:16px; text-align:left; font-family:Helvetica, sans-serif; color:#661d1d; background-color:#ffeded; border-radius:3px; border-color:#ff4949;max-width:540px;">
      <div class="sib-form-message-panel__text sib-form-message-panel__text--center">
        <svg viewBox="0 0 512 512" class="sib-icon sib-notification__icon">
          <path d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-11.49 120h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM256 340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z" />
        </svg>
        <span class="sib-form-message-panel__inner-text">
          Nous n&#039;avons pas pu confirmer votre Soutien.
        </span>
      </div>
    </div>
    <div></div>
    <div id="success-message" class="sib-form-message-panel" style="font-size:16px; text-align:left; font-family:Helvetica, sans-serif; color:#085229; background-color:#e7faf0; border-radius:3px; border-color:#13ce66;max-width:540px;">
      <div class="sib-form-message-panel__text sib-form-message-panel__text--center">
        <svg viewBox="0 0 512 512" class="sib-icon sib-notification__icon">
          <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z" />
        </svg>
        <span class="sib-form-message-panel__inner-text">
          Votre soutien est confirmée.
        </span>
      </div>
    </div>
    <div></div>
    <div id="sib-container" class="sib-container--large sib-container--vertical" style="text-align:center; background-color:rgba(255,255,255,1); max-width:540px; border-radius:3px; border-width:1px; border-color:#C0CCD9; border-style:solid; direction:ltr">
      <form id="sib-form" method="POST" action="https://d99cfba0.sibforms.com/serve/MUIFALsRrrlT3aldB_8Y4IgTTh-6OG2Te2BV2HOcgYujoc-VQKZkvXDNq7JKmPkUAF8YIrWt87O-iKZM7_IVtueNU13AFTsF2HC9hly9ycIoFt40U1kzJxOyxnnSfuOnOU5f7oYzoB9ulkf5ArtDoJtiwRhmJ8zvrbrWVjHPPGrmSNx0oOey9MNGWoAcMlkJYwFFPZcg1rOtsZCB" data-type="subscription">
        <div style="padding: 8px 0;">
          <div class="sib-form-block" style="font-size:32px; text-align:left; font-weight:700; font-family:Helvetica, sans-serif; color:#3C4858; background-color:transparent; text-align:left">
            <p>Soutenir le DataWood Consortium</p>
          </div>
        </div>
        <div style="padding: 8px 0;">
          <div class="sib-form-block" style="font-size:16px; text-align:left; font-family:Helvetica, sans-serif; color:#3C4858; background-color:transparent; text-align:left">
            <div class="sib-text-form-block">
              <p>Soutenir le Datawood c&#039;est partager les idées exprimées dans la charte pour la digitalisation responsable de la filière bois et de l’innovation ouverte de la filière forêt-bois.&nbsp;</p>
              <p><br></p>
              <p>Ajoutez votre mail, le nom de votre société et éventuellement un logo pour apparaitre dans les soutiens.</p>
            </div>
          </div>
        </div>
        <div style="padding: 8px 0;">
          <div class="sib-input sib-form-block">
            <div class="form__entry entry_block">
              <div class="form__label-row ">
                <label class="entry__label" style="font-weight: 700; text-align:left; font-size:16px; text-align:left; font-weight:700; font-family:Helvetica, sans-serif; color:#3c4858;" for="EMAIL" data-required="*">Veuillez renseigner votre adresse email pour vous inscrire</label>
                <div class="entry__field">
                  <input class="input " type="text" id="EMAIL" name="EMAIL" autocomplete="off" placeholder="EMAIL" data-required="true" required />
                </div>
              </div>
              <label class="entry__error entry__error--primary" style="font-size:16px; text-align:left; font-family:Helvetica, sans-serif; color:#661d1d; background-color:#ffeded; border-radius:3px; border-color:#ff4949;"></label>
              <label class="entry__specification" style="font-size:12px; text-align:left; font-family:Helvetica, sans-serif; color:#8390A4; text-align:left">
                Veuillez renseigner votre adresse email pour vous inscrire. Ex. : abc@xyz.com
              </label>
            </div>
          </div>
        </div>
        <div style="padding: 8px 0;">
          <div class="sib-input sib-form-block">
            <div class="form__entry entry_block">
              <div class="form__label-row ">
                <label class="entry__label" style="font-weight: 700; text-align:left; font-size:16px; text-align:left; font-weight:700; font-family:Helvetica, sans-serif; color:#3c4858;" for="PRENOM" data-required="*">Entrez votre PRENOM</label>
                <div class="entry__field">
                  <input class="input " maxlength="200" type="text" id="PRENOM" name="PRENOM" autocomplete="off" placeholder="PRENOM" data-required="true" required />
                </div>
              </div>
              <label class="entry__error entry__error--primary" style="font-size:16px; text-align:left; font-family:Helvetica, sans-serif; color:#661d1d; background-color:#ffeded; border-radius:3px; border-color:#ff4949;"></label>
              <label class="entry__specification" style="font-size:12px; text-align:left; font-family:Helvetica, sans-serif; color:#8390A4; text-align:left">
                Personnalisez ce texte d&#039;aide facultatif avant de publier votre formulaire..
              </label>
            </div>
          </div>
        </div>
        <div style="padding: 8px 0;">
          <div class="sib-input sib-form-block">
            <div class="form__entry entry_block">
              <div class="form__label-row ">
                <label class="entry__label" style="font-weight: 700; text-align:left; font-size:16px; text-align:left; font-weight:700; font-family:Helvetica, sans-serif; color:#3c4858;" for="NOM" data-required="*">Entrez votre NOM</label>
                <div class="entry__field">
                  <input class="input " maxlength="200" type="text" id="NOM" name="NOM" autocomplete="off" placeholder="NOM" data-required="true" required />
                </div>
              </div>
              <label class="entry__error entry__error--primary" style="font-size:16px; text-align:left; font-family:Helvetica, sans-serif; color:#661d1d; background-color:#ffeded; border-radius:3px; border-color:#ff4949;"></label>
              <label class="entry__specification" style="font-size:12px; text-align:left; font-family:Helvetica, sans-serif; color:#8390A4; text-align:left">
                Personnalisez ce texte d&#039;aide facultatif avant de publier votre formulaire..
              </label>
            </div>
          </div>
        </div>
        <div style="padding: 8px 0;">
          <div class="sib-input sib-form-block">
            <div class="form__entry entry_block">
              <div class="form__label-row ">
                <label class="entry__label" style="font-weight: 700; text-align:left; font-size:16px; text-align:left; font-weight:700; font-family:Helvetica, sans-serif; color:#3c4858;" for="ORGANISATION" data-required="*">Entrez votre ENTREPRISE</label>
                <div class="entry__field">
                  <input class="input " maxlength="200" type="text" id="ORGANISATION" name="ORGANISATION" autocomplete="off" placeholder="ORGANISATION" data-required="true" required />
                </div>
              </div>
              <label class="entry__error entry__error--primary" style="font-size:16px; text-align:left; font-family:Helvetica, sans-serif; color:#661d1d; background-color:#ffeded; border-radius:3px; border-color:#ff4949;"></label>
              <label class="entry__specification" style="font-size:12px; text-align:left; font-family:Helvetica, sans-serif; color:#8390A4; text-align:left">
                Personnalisez ce texte d&#039;aide facultatif avant de publier votre formulaire..
              </label>
            </div>
          </div>
        </div>
        <div style="padding: 8px 0;">
          <div class="sib-form-block" style="text-align: left">
            <button class="sib-form-block__button sib-form-block__button-with-loader" style="font-size:16px; text-align:left; font-weight:700; font-family:Helvetica, sans-serif; color:#FFFFFF; background-color:#3E4857; border-radius:3px; border-width:0px;" form="sib-form" type="submit">
              <svg class="icon clickable__icon progress-indicator__icon sib-hide-loader-icon" viewBox="0 0 512 512" style="">
                <path d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
              </svg>
              Je soutiens
            </button>
          </div>
        </div>
        <input type="text" name="email_address_check" value="" class="input--hidden">
        <input type="hidden" name="locale" value="fr">
      </form>
    </div>
  </div>
</div>
`;

export const ConsortiumPage: React.FC = () => {
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
    const [supportStatus, setSupportStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const supportFormRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isSupportModalOpen) return;

        const form = supportFormRef.current?.querySelector('#sib-form') as HTMLFormElement | null;
        if (!form) return;

        const handleSubmit = async (event: Event) => {
            event.preventDefault();
            setSupportStatus('submitting');

            try {
                const formData = new FormData(form);
                await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                });
                setSupportStatus('success');
                form.reset();
            } catch (error) {
                console.error('Brevo submission error:', error);
                setSupportStatus('error');
            }
        };

        form.addEventListener('submit', handleSubmit);

        return () => {
            form.removeEventListener('submit', handleSubmit);
        };
    }, [isSupportModalOpen]);

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

                        <div className="bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 shadow-sm">
                            <h2 className="text-2xl font-black text-slate-900 mb-4">Signer la charte</h2>
                            <p className="text-slate-600 text-base leading-relaxed mb-6">
                                Laissez vos coordonnées pour soutenir la charte et apparaître parmi les signataires.
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsSupportModalOpen(true)}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-white font-bold shadow-lg shadow-emerald-200/50 hover:bg-emerald-700 transition-colors"
                            >
                                Je soutiens
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-24 space-y-16">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-8">Gouvernance</h2>
                        <p className="text-slate-600 text-base leading-relaxed mb-6">
                            Le DataWood Consortium repose sur une gouvernance légère, ouverte et non concurrentielle, conçue pour faciliter la coopération entre acteurs sans créer de structure lourde ni imposer de décisions descendantes.
                        </p>
                        <p className="text-slate-600 text-base leading-relaxed mb-10">
                            Les orientations et livrables sont construits collectivement, par le dialogue et la recherche de consensus, avec une animation dédiée chargée de coordonner les travaux et de garantir la neutralité de la démarche.
                        </p>
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

            {isSupportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setIsSupportModalOpen(false)}
                    ></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Signer la charte</h2>
                                <p className="text-sm text-slate-500 mt-1">Merci de votre soutien au consortium.</p>
                            </div>
                            <button
                                onClick={() => setIsSupportModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full p-2 transition-colors"
                                aria-label="Fermer"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 bg-slate-50">
                            {supportStatus !== 'idle' && (
                                <div className="mb-6">
                                    {supportStatus === 'submitting' && (
                                        <div className="rounded-xl bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-medium">
                                            Envoi en cours...
                                        </div>
                                    )}
                                    {supportStatus === 'success' && (
                                        <div className="rounded-xl bg-emerald-100 text-emerald-800 px-4 py-3 text-sm font-medium">
                                            Merci, votre soutien a bien ete enregistre.
                                        </div>
                                    )}
                                    {supportStatus === 'error' && (
                                        <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm font-medium">
                                            Une erreur est survenue. Merci de reessayer.
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="flex justify-center">
                                <div ref={supportFormRef} dangerouslySetInnerHTML={{ __html: brevoFormHtml }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
