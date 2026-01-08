import React from 'react';

export const SupportConfirmationPage: React.FC = () => {
    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-3xl mx-auto px-6 py-24">
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-10 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto mb-6">
                        ✓
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-4">Merci pour votre soutien</h1>
                    <p className="text-slate-700 text-base leading-relaxed">
                        Un e-mail de confirmation de votre soutien va vous être envoyé dans les prochaines minutes.
                    </p>
                    <p className="text-slate-700 text-base leading-relaxed mt-3">
                        Merci de consulter votre boîte de réception et de valider votre soutien en cliquant sur le lien de confirmation.
                    </p>
                </div>
            </div>
        </div>
    );
};
