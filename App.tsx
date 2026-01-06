
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { PAGES } from './constants';
import { DocPage } from './types';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentPath(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (path: string) => {
    window.location.hash = path;
    const mainArea = document.getElementById('main-scroll-area');
    if (mainArea) mainArea.scrollTop = 0;
  };

  const currentPage: DocPage = PAGES[currentPath] || PAGES['/'];

  const isHome = currentPath === '/';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar 
        currentPath={currentPath} 
        onNavigate={navigateTo} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header Glassmorphism */}
        <header className="sticky top-0 z-30 glass border-b border-slate-200/50 px-6 py-4 lg:px-12 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="hidden lg:flex items-center gap-3">
               <span className="text-[11px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded uppercase tracking-tighter">Docs</span>
               <span className="h-4 w-[1px] bg-slate-200"></span>
               <span className="text-xs font-medium text-slate-400">Dernière mise à jour: {currentPage.metadata.lastUpdated}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={() => window.open('https://github.com/datawood-consortium/docs', '_blank')}
               className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 flex items-center gap-2"
              >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
               GitHub
             </button>
          </div>
        </header>

        <main id="main-scroll-area" className="flex-1 overflow-y-auto custom-scrollbar bg-white relative">
          
          {isHome ? (
            /* Custom Landing Page Design */
            <div className="relative">
              {/* Hero Section */}
              <div className="px-6 pt-20 pb-16 lg:px-24 lg:pt-32 lg:pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
                <div className="max-w-3xl relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-8 ring-1 ring-emerald-100">
                    Commun Numérique Forêt-Bois
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
                    L'infrastructure <br/> de <span className="text-emerald-600">données partagée.</span>
                  </h1>
                  <p className="text-xl lg:text-2xl text-slate-500 leading-relaxed mb-12">
                    Le DataWood Consortium définit les standards de traçabilité et d'interopérabilité pour transformer durablement la filière bois.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => navigateTo('/manifesto')} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-100 transform hover:-translate-y-1">
                      Explorer le Manifeste
                    </button>
                    <button onClick={() => navigateTo('/architecture')} className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transform hover:-translate-y-1 shadow-sm">
                      Spécifications Tech
                    </button>
                  </div>
                </div>
              </div>

              {/* Feature Grid */}
              <div className="px-6 pb-24 lg:px-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="group bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-2xl hover:shadow-emerald-50 cursor-pointer" onClick={() => navigateTo('/governance')}>
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                       <svg xmlns="http://www.w3.org/2000/svg" className="text-emerald-600" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Gouvernance Ouverte</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">Découvrez comment les décisions sont prises de manière distribuée et transparente.</p>
                  </div>

                  <div className="group bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-2xl hover:shadow-emerald-50 cursor-pointer" onClick={() => navigateTo('/architecture')}>
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                       <svg xmlns="http://www.w3.org/2000/svg" className="text-emerald-600" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Architecture & API</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">Modèles de données JSON-LD et protocoles d'échanges standardisés.</p>
                  </div>

                  <div className="group bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-2xl hover:shadow-emerald-50 cursor-pointer" onClick={() => navigateTo('/contribute')}>
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                       <svg xmlns="http://www.w3.org/2000/svg" className="text-emerald-600" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Contribuer au Projet</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">Rejoignez les groupes de travail et enrichissez la documentation du consortium.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Documentation Page Design */
            <div className="max-w-4xl mx-auto px-6 py-12 lg:px-16 lg:py-20">
              <nav className="flex items-center gap-2 mb-10 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <button onClick={() => navigateTo('/')} className="hover:text-emerald-600">Consortium</button>
                <span>/</span>
                <span className="text-emerald-600">{currentPage.path.split('/')[1] || 'Docs'}</span>
              </nav>

              <div className="flex items-center gap-4 mb-8">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ring-1 ${
                  currentPage.metadata.status === 'stable' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 
                  currentPage.metadata.status === 'draft' ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-slate-50 text-slate-600 ring-slate-200'
                }`}>
                  Statut: {currentPage.metadata.status}
                </span>
                <span className="text-xs font-bold text-slate-300">Edition {currentPage.metadata.version}</span>
              </div>

              <article className="prose prose-slate max-w-none">
                {currentPage.content.split('\n').map((line, idx) => {
                  if (line.startsWith('# ')) return <h1 key={idx} className="text-5xl lg:text-6xl font-black text-slate-900 mb-12 tracking-tighter leading-tight">{line.replace('# ', '')}</h1>;
                  if (line.startsWith('## ')) return <h2 key={idx} className="text-3xl font-extrabold text-slate-800 mt-16 mb-6 tracking-tight">{line.replace('## ', '')}</h2>;
                  if (line.startsWith('- ')) return <div key={idx} className="flex gap-4 mb-4 group ml-4">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-150 transition-transform shrink-0"></span>
                    <p className="m-0 text-slate-600 text-lg leading-relaxed">{line.replace('- ', '')}</p>
                  </div>;
                  if (line.trim() === '') return <div key={idx} className="h-4" />;
                  
                  const formattedLine = line.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-slate-900 underline decoration-emerald-200 decoration-4 underline-offset-2">{part}</strong> : part);
                  
                  return <p key={idx} className="text-slate-600 leading-relaxed mb-6 text-xl">{formattedLine}</p>;
                })}
              </article>

              {/* Dynamic Footer for Doc Pages */}
              <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Contributeurs sur cette page</h4>
                   <div className="flex -space-x-2">
                    {currentPage.metadata.contributors.map((c, i) => (
                      <div key={c} title={c} className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm hover:z-10 cursor-pointer transform hover:-translate-y-1 transition-transform ${['bg-slate-900', 'bg-emerald-600', 'bg-emerald-800'][i % 3]}`}>
                        {c.charAt(0)}
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                  Retour en haut
                </button>
              </div>
            </div>
          )}
          
          {/* Main Global Footer */}
          <footer className="bg-slate-950 text-white mt-32 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px]"></div>
            <div className="max-w-7xl mx-auto px-8 py-20 lg:px-24 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
              <div className="md:col-span-5">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-black">D</div>
                   <span className="text-2xl font-black tracking-tight">DataWood</span>
                </div>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                  Le DataWood Consortium est une initiative collective visant à moderniser la filière bois par la standardisation des échanges de données.
                </p>
              </div>
              <div className="md:col-span-2">
                <h5 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Ressources</h5>
                <ul className="space-y-4 text-slate-400 text-sm">
                  <li><button onClick={() => navigateTo('/architecture')} className="hover:text-emerald-400">Documentation Tech</button></li>
                  <li><button onClick={() => navigateTo('/governance')} className="hover:text-emerald-400">Gouvernance</button></li>
                  <li><button onClick={() => navigateTo('/manifesto')} className="hover:text-emerald-400">Le Manifeste</button></li>
                </ul>
              </div>
              <div className="md:col-span-2">
                <h5 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Communauté</h5>
                <ul className="space-y-4 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-emerald-400">Discord</a></li>
                  <li><a href="#" className="hover:text-emerald-400">GitHub</a></li>
                  <li><a href="#" className="hover:text-emerald-400">Newsletter</a></li>
                </ul>
              </div>
              <div className="md:col-span-3">
                <div className="bg-emerald-900/30 p-6 rounded-3xl border border-emerald-800/50">
                  <h5 className="font-bold text-white mb-2 text-sm">Sous licence libre</h5>
                  <p className="text-xs text-slate-400 mb-4">Ce portail et son contenu sont distribués sous licence CC BY-SA 4.0.</p>
                  <div className="w-12 h-8 bg-white/10 rounded border border-white/10 flex items-center justify-center text-[10px] font-black">CC BY-SA</div>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-8 py-8 lg:px-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-slate-500">© 2024 DataWood Consortium. Tous droits réservés.</p>
              <div className="flex gap-6 text-xs text-slate-500">
                <a href="#" className="hover:text-white">Mentions légales</a>
                <a href="#" className="hover:text-white">Confidentialité</a>
                <a href="#" className="hover:text-white">Accessibilité</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
