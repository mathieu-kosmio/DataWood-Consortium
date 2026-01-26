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
            <p>Soutenir le DataWood Pact</p>
          </div>
        </div>
        <div style="padding: 8px 0;">
          <div class="sib-form-block" style="font-size:16px; text-align:left; font-family:Helvetica, sans-serif; color:#3C4858; background-color:transparent; text-align:left">
            <div class="sib-text-form-block">
              <p>Soutenir le DataWood Pact, c'est partager les principes de confiance et de lisibilité pour la structuration de la filière forêt-bois.</p>
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
                <label class="entry__label" style="font-weight: 700; text-align:left; font-size:16px; text-align:left; font-weight:700; font-family:Helvetica, sans-serif; color:#3c4858;" for="PRENOM" data-required="*">Prénom Nom</label>
                <div class="entry__field">
                  <input class="input " maxlength="200" type="text" id="PRENOM" name="PRENOM" autocomplete="off" placeholder="Prénom Nom" data-required="true" required />
                </div>
              </div>
              <label class="entry__error entry__error--primary" style="font-size:16px; text-align:left; font-family:Helvetica, sans-serif; color:#661d1d; background-color:#ffeded; border-radius:3px; border-color:#ff4949;"></label>
            </div>
          </div>
        </div>
        <div style="padding: 8px 0;">
          <div class="sib-input sib-form-block">
            <div class="form__entry entry_block">
              <div class="form__label-row ">
                <label class="entry__label" style="font-weight: 700; text-align:left; font-size:16px; text-align:left; font-weight:700; font-family:Helvetica, sans-serif; color:#3c4858;" for="ORGANISATION">Entreprise (facultatif)</label>
                <div class="entry__field">
                  <input class="input " maxlength="200" type="text" id="ORGANISATION" name="ORGANISATION" autocomplete="off" placeholder="Nom de l'entreprise" />
                </div>
              </div>
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

                // SLACK INTEGRATION
                const SLACK_WEBHOOK_URL = import.meta.env.VITE_SLACK_WEBHOOK_URL || '';
                if (SLACK_WEBHOOK_URL) {
                    const payload = {
                        text: `✨ *Nouveau soutien au DataWood Pact*\n*Nom:* ${formData.get('PRENOM')}\n*Email:* ${formData.get('EMAIL')}\n*Entreprise:* ${formData.get('ORGANISATION') || 'Non renseigné'}`
                    };
                    await fetch(SLACK_WEBHOOK_URL, {
                        method: 'POST',
                        body: JSON.stringify(payload),
                        mode: 'no-cors'
                    });
                }

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
            {/* Hero (Merged from ProjectPage) */}
            <div className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">Consortium Datawood</div>
                        <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                            Une démarche collective <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">au service de la filière</span>
                        </h1>
                        <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                            Rendre visibles et compréhensibles les initiatives data : une démarche collective pour la structuration des projets, des données et des standards de la filière forêt-bois.
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

            {/* 5 Pillars Section (Merged from ProjectPage) */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-black text-slate-900">Les 5 piliers de l'initiative</h2>
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
                        <div key={i} className={`p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 ${item.color}`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-50 border-y border-slate-100">
                <div className="max-w-5xl mx-auto px-6 py-20">
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 lg:p-12">
                        <div className="flex flex-col gap-10">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-4">Pourquoi le DataWood Consortium ?</h2>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    La filière forêt-bois s’appuie aujourd’hui sur un nombre croissant d’initiatives liées aux données, aux référentiels, aux formats d’échange et aux outils numériques. Ces initiatives sont portées par des acteurs variés et répondent à des besoins légitimes, mais restent souvent fragmentées, peu lisibles collectivement et difficiles à articuler entre elles.
                                </p>
                                <p className="text-slate-600 text-lg leading-relaxed mt-4">
                                    Dans ce contexte, l'initiative DataWood vise à créer un cadre commun de référence, volontaire et non contraignant, destiné à faciliter l’identification, la compréhension et la mise en visibilité des initiatives existantes, tout en garantissant un respect strict de la confidentialité, de la souveraineté des données et de l’autonomie des acteurs.
                                </p>
                                <p className="text-slate-600 text-lg leading-relaxed mt-4">
                                    Cette initiative publique, ouverte et collective ne constitue ni un engagement formel, ni une obligation de partage de données ou de convergence technique de ceux qui la soutiennent. Elle pose simplement des principes communs pour favoriser la confiance et la coopération à un stade exploratoire et fédérateur.
                                </p>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 lg:p-8">
                                <h2 className="text-2xl font-black text-slate-900 mb-4">Objet de l'initiative</h2>
                                <ul className="space-y-3 text-slate-700 text-base">
                                    {[
                                        "Améliorer la lisibilité collective des initiatives liées aux données dans la filière forêt-bois ;",
                                        "Faciliter l’inventaire, la description et la comparaison des projets existants ;",
                                        "Identifier les zones de complémentarité, de recouvrement ou de potentiel de valeur collective ;",
                                        "Instaurer un climat de confiance propice aux échanges et à la coopération volontaire ;",
                                        "Garantir le respect strict des informations sensibles, stratégiques ou confidentielles."
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500"></span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-slate-500 text-sm mt-4">
                                    Il n’emporte aucune obligation juridique, technique, économique ou opérationnelle pour les acteurs qui s’y réfèrent.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-6">Principes partagés</h2>
                                <div className="grid lg:grid-cols-2 gap-6">
                                    {[
                                        {
                                            title: "1. Lisibilité et documentation des initiatives",
                                            items: [
                                                "Décrire leurs initiatives de manière factuelle et compréhensible ;",
                                                "Préciser les objectifs, périmètres, usages et types de données concernés ;",
                                                "Contribuer à une meilleure compréhension collective de l’existant."
                                            ],
                                            footnote: "Cette démarche vise la lisibilité et la compréhension, non l’évaluation, la normalisation imposée ou la remise en cause des projets."
                                        },
                                        {
                                            title: "2. Partage raisonné et volontaire",
                                            items: [
                                                "Aucun acteur n’est tenu de partager des données, documents ou savoir-faire ;",
                                                "La participation à une démarche collective n’implique aucune obligation implicite ;",
                                                "Le niveau de partage est librement défini par chaque acteur."
                                            ],
                                            footnote: "Le partage porte prioritairement sur des éléments descriptifs et structurants, non sur des données sensibles."
                                        },
                                        {
                                            title: "3. Respect absolu de la confidentialité et de la souveraineté des données",
                                            items: [
                                                "Chaque acteur reste pleinement propriétaire de ses données, référentiels et outils ;",
                                                "Aucune information sensible ou stratégique ne peut être partagée sans accord explicite ;",
                                                "La non-divulgation prévaut systématiquement sur les objectifs de coopération."
                                            ],
                                            footnote: "La confiance repose sur la capacité à dire ce qui peut être partagé, comme ce qui ne peut pas l’être."
                                        },
                                        {
                                            title: "4. Neutralité et non-concurrence",
                                            items: [
                                                "Aucune solution, technologie ou acteur n’est promu ;",
                                                "Aucune initiative existante n’est remise en cause ;",
                                                "Aucune orientation stratégique n’est imposée."
                                            ],
                                            footnote: "La démarche vise à rendre l’existant lisible et articulable, non à arbitrer ou à hiérarchiser."
                                        },
                                        {
                                            title: "5. Recherche de complémentarités et de valeur collective",
                                            items: [
                                                "Identifier des convergences potentielles ;",
                                                "Repérer des zones de recouvrement ou de manque ;",
                                                "Explorer, le cas échéant, des opportunités de coopération."
                                            ],
                                            footnote: "Toute convergence ou évolution reste progressive, volontaire et non prescriptive."
                                        },
                                        {
                                            title: "6. Démarche progressive et réversible",
                                            items: [
                                                "Libre ;",
                                                "Modulable dans le temps ;",
                                                "Réversible sans justification."
                                            ],
                                            footnote: "La structuration collective se construit par étapes, au rythme des acteurs."
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
                                    <h3 className="text-xl font-bold text-emerald-900 mb-4">Ce que cette initiative est</h3>
                                    <ul className="space-y-3 text-slate-700 text-sm">
                                        {[
                                            "Un cadre de référence commun et volontaire",
                                            "Un outil de lisibilité et de confiance",
                                            "Un point d’appui pour mieux comprendre l’existant"
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-3">
                                                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500"></span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-slate-900 rounded-2xl p-6 text-white">
                                    <h3 className="text-xl font-bold mb-4">Ce que cette initiative n’est pas</h3>
                                    <ul className="space-y-3 text-emerald-100 text-sm">
                                        {[
                                            "Un engagement contractuel",
                                            "Une obligation de partage de données",
                                            "Un cadre de gouvernance contraignant",
                                            "Un mécanisme de standardisation imposée"
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
                                <h2 className="text-2xl font-black text-slate-900 mb-4">Référence à l'initiative</h2>
                                <p className="text-slate-600 text-base leading-relaxed mb-4">
                                    Se référer à l'initiative DataWood signifie :
                                </p>
                                <ul className="space-y-3 text-slate-700 text-base mb-6">
                                    {[
                                        "Reconnaître l’intérêt d’une meilleure lisibilité collective des initiatives data ;",
                                        "Partager les principes de confiance, de neutralité et de respect de la confidentialité ;",
                                        "Soutenir une démarche d’inventaire et de fédération, sans engagement opérationnel."
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500"></span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-slate-500 text-sm">
                                    La participation à cette démarche est libre, modulable dans le temps et réversible sans justification.
                                </p>
                            </div>

                            <div className="bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 shadow-sm">
                                <h2 className="text-2xl font-black text-slate-900 mb-4">Soutenez l'initiative DataWood Consortium</h2>
                                <p className="text-slate-600 text-base leading-relaxed mb-6">
                                    Vous partagez les valeurs de l'initiative DataWood Consortium ? <br />Vous voulez recevoir nos travaux et être informé de nos avancées ?
                                </p>
                                <p className="text-slate-600 text-base leading-relaxed mb-6">Remplissez le formulaire de soutien, puis confirmez votre soutient grâce à l’e-mail de validation que vous recevrez.</p>
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
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-8">Gouvernance</h2>
                    <p className="text-slate-600 text-base leading-relaxed mb-6">
                        Le projet DataWood Consortium est actuellement en cours de labellisation auprès de <a href="https://xylofutur.fr/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline">Xylofutur</a>. Il est porté par <a href="https://kosm.io/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline">Kosmio</a>, qui assure le rôle de coordinateur du projet et d’animateur de la démarche collective.
                    </p>
                    <p className="text-slate-600 text-base leading-relaxed mb-6">
                        À ce stade, le projet s’inscrit dans une phase de préfiguration visant à évaluer la faisabilité d’une structuration collective des initiatives de données de la filière forêt-bois. Cette phase permet de tester les modalités de coopération, d’identifier les conditions de confiance, ainsi que les principes organisationnels et méthodologiques pertinents.
                    </p>
                    <p className="text-slate-600 text-base leading-relaxed mb-10">
                        En fonction des enseignements tirés de cette phase, l’objectif est d’aboutir, le cas échéant, à la constitution d’une gouvernance propre et partagée de l’initiative. Cette gouvernance aurait vocation à porter, dans un second temps, un projet plus large de partage et de structuration des données à l’échelle de la filière, dans une logique d’espace de données partagé.
                    </p>
                    {/* Org Chart */}
                    <div className="grid md:grid-cols-3 gap-8 items-start relative">
                        {/* Connector Line */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-slate-200 -z-10"></div>

                        {/* Nodes */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-emerald-500 text-center">
                            <h3 className="font-black text-xl mb-2">Comité de Pilotage</h3>
                            <p className="text-sm text-slate-500 mb-4">Support et décisions</p>
                            <div className="text-left text-sm space-y-2 bg-slate-50 p-4 rounded-xl">
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Stratégie</div>
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Confidentialité</div>
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Adhésion réseau</div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-emerald-500 text-center mt-12 md:mt-0">
                            <h3 className="font-black text-xl mb-2">Coordinateur</h3>
                            <p className="text-sm text-slate-500 mb-4">Animation</p>
                            <div className="text-left text-sm space-y-2 bg-slate-50 p-4 rounded-xl">
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Gestion projet</div>
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Communication</div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-emerald-500 text-center">
                            <h3 className="font-black text-xl mb-2">Partenaires</h3>
                            <p className="text-sm text-slate-500 mb-4">Inventaire des données</p>
                            <div className="text-left text-sm space-y-2 bg-slate-50 p-4 rounded-xl">
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Métiers</div>
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Échangées</div>
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Consolidées</div>
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

            {/* Support Modal */}
            {isSupportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setIsSupportModalOpen(false)}
                    ></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Soutenir le DataWood Consortium</h2>
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
                                            <p>Un e-mail de confirmation de votre soutien va vous être envoyé dans les prochaines minutes.</p>
                                            <p className="mt-2">Merci de consulter votre boîte de réception et de valider votre soutien en cliquant sur le lien de confirmation.</p>
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
