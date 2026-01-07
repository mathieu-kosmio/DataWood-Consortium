import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ContactModal } from './src/components/ContactModal';

// Custom Pages
import { ProjectPage } from './src/pages/ProjectPage';
import { ConsortiumPage } from './src/pages/ConsortiumPage';
import { WorksPage } from './src/pages/WorksPage';
import { RoadmapPage } from './src/pages/RoadmapPage';
import { JoinPage } from './src/pages/JoinPage';
import { ResourcesPage } from './src/pages/ResourcesPage';

// ------------------------------------------------------------------
// BLOG LOGIC & HELPERS
// ------------------------------------------------------------------

// Helper to parse Frontmatter
const parseFrontmatter = (text: string) => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = text.match(frontmatterRegex);
  if (!match) return { metadata: {}, content: text };

  const frontmatter = match[1];
  const content = match[2];

  const titleMatch = frontmatter.match(/title:\s*"(.*)"/);
  const descMatch = frontmatter.match(/description:\s*"(.*)"/);
  const dateMatch = frontmatter.match(/date:\s*"(.*)"/);
  const authorMatch = frontmatter.match(/author:\s*"(.*)"/);
  const imageMatch = frontmatter.match(/image:\s*"(.*)"/);
  const tagsMatch = frontmatter.match(/tags:\s*\[(.*)\]/);

  let tags: string[] = [];
  if (tagsMatch) tags = tagsMatch[1].split(',').map(t => t.trim().replace(/"/g, ''));

  return {
    metadata: {
      title: titleMatch ? titleMatch[1] : 'Sans titre',
      description: descMatch ? descMatch[1] : '',
      date: dateMatch ? dateMatch[1] : '',
      author: authorMatch ? authorMatch[1] : 'Équipe DataWood',
      image: imageMatch ? imageMatch[1] : '',
      tags
    },
    content
  };
};

// Import all blog posts from src/content/blog
const blogPostsModules = import.meta.glob('/src/content/blog/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const getAllPosts = () => {
  return Object.entries(blogPostsModules).map(([path, rawContent]) => {
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    const { metadata } = parseFrontmatter(rawContent as string);
    return {
      slug: `/blog/${slug}`,
      ...metadata
    };
  }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const getPostBySlug = (slug: string) => {
  const path = `/src/content/blog/${slug}.md`;
  const rawContent = blogPostsModules[path];
  if (!rawContent) return null;
  return parseFrontmatter(rawContent as string);
};

// ------------------------------------------------------------------
// SUB-COMPONENTS
// ------------------------------------------------------------------

const BlogListPage: React.FC<{ navigateTo: (p: string) => void }> = ({ navigateTo }) => {
  const posts = getAllPosts();

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Blog Hero */}
      <div className="bg-slate-900 text-white relative overflow-hidden px-6 py-24 lg:py-32 text-center">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1448375240586-dfd8f3793371?q=80&w=2070')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-6">Le Journal DataWood</h1>
          <p className="text-xl text-slate-300">Actualités, décryptages et perspectives sur la donnée forestière.</p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any, i) => (
              <div key={i} onClick={() => navigateTo(post.slug)} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-slate-100 flex flex-col h-full">
                <div className="h-64 overflow-hidden relative">
                  <img src={post.image || "https://images.unsplash.com/photo-1448375240586-dfd8f3793371?q=80"} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {post.tags?.[0] || 'Article'}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="text-slate-400 text-sm font-medium mb-3 flex items-center gap-2">
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 line-clamp-3 mb-6 flex-grow">
                    {post.description}
                  </p>
                  <div className="flex items-center text-emerald-600 font-bold group-hover:underline">
                    Lire l'article <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
            <p className="text-xl text-slate-500">Aucun article pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const BlogPostPage: React.FC<{ slug: string }> = ({ slug }) => {
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-300 mb-4">404</h1>
          <p className="text-xl text-slate-500">Article non trouvé</p>
        </div>
      </div>
    );
  }

  const { metadata, content } = post as any;

  return (
    <div className="bg-white">
      {/* Large Cover */}
      <div className="h-[50vh] relative">
        <div className="absolute inset-0 bg-slate-900/40"></div>
        <img
          src={metadata.image || "https://images.unsplash.com/photo-1448375240586-dfd8f3793371?q=80"}
          className="w-full h-full object-cover"
          alt="Cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 text-center text-white">
            <div className="inline-block px-4 py-1 bg-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-emerald-400/50">
              {metadata.tags?.[0] || 'Article'}
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight mb-6 drop-shadow-lg">
              {metadata.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-slate-200 font-medium">
              <span>{metadata.date}</span>
              <span>•</span>
              <span>Par {metadata.author}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24 relative">
        <article className="prose prose-lg prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-emerald-600">
          {(content as string).split('\n').map((line, idx) => {
            if (line.startsWith('# ')) return null;
            if (line.startsWith('## ')) return <h2 key={idx} className="text-3xl font-bold text-slate-900 mt-16 mb-8">{line.replace('## ', '')}</h2>;
            if (line.startsWith('### ')) return <h3 key={idx} className="text-2xl font-bold text-slate-800 mt-10 mb-6">{line.replace('### ', '')}</h3>;
            if (line.startsWith('> ')) return <blockquote key={idx} className="pl-6 border-l-4 border-emerald-500 italic text-2xl text-slate-700 font-serif my-12 bg-slate-50 py-6 pr-6 rounded-r-xl">{line.replace('> ', '')}</blockquote>;
            if (line.trim() === '') return <div key={idx} className="h-6" />;
            if (line.startsWith('- ')) return <li key={idx} className="text-slate-700 ml-4 list-disc marker:text-emerald-500 mb-2">{line.replace('- ', '')}</li>;

            const parts = line.split('**');
            return <p key={idx} className="text-slate-600 leading-8 mb-6 text-lg">{parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-slate-900">{part}</strong> : part)}</p>;
          })}
        </article>

        {/* Author Box */}
        <div className="mt-20 p-8 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-200 rounded-full shrink-0 flex items-center justify-center text-2xl">✍️</div>
          <div>
            <h4 className="font-bold text-slate-900 text-lg">{metadata.author}</h4>
            <p className="text-slate-600 text-sm">Contributeur régulier sur les sujets d'interopérabilité et de gestion forestière.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC<{ navigateTo: (p: string) => void }> = ({ navigateTo }) => (
  <div className="relative">
    {/* Hero Section */}
    <div className="relative px-6 py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-100/40 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-100/50 rounded-full blur-3xl -ml-24 -mb-24"></div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Phase de préfiguration – projet collectif en construction
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Rendre lisibles et compatibles <br /> les données de la <span className="text-emerald-600">filière forêt-bois</span>.
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 leading-relaxed mb-8 max-w-xl">
            DataWood Consortium est une démarche collective visant à recenser, documenter et mettre en cohérence les initiatives de données existantes, afin de préparer un futur Data Space partagé.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <button onClick={() => navigateTo('/le-projet')} className="group px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-200/50 transition-all hover:-translate-y-1 flex items-center gap-3">
              Comprendre la démarche
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
            <button onClick={() => navigateTo('/rejoindre')} className="px-8 py-4 bg-white text-slate-800 border-2 border-slate-200 rounded-xl font-bold text-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all hover:-translate-y-1 shadow-sm">
              Rejoindre le consortium
            </button>
          </div>
        </div>
        {/* Hero Visual */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <img
              src="/images/hero-visual.png"
              alt="DataWood - De la forêt aux données connectées"
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Trust Band */}
    <div className="py-10 px-6 bg-white border-y border-slate-100">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-sm text-slate-400 font-medium uppercase tracking-widest mb-6">Ils participent à la démarche</p>
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
          {['Partenaire 1', 'Partenaire 2', 'Partenaire 3', 'Partenaire 4', 'Partenaire 5'].map((name, i) => (
            <div key={i} className="h-10 px-6 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm font-medium">{name}</div>
          ))}
        </div>
      </div>
      {/* Problem Statement */}
      <div className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">Un constat largement partagé dans la filière</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">La filière forêt-bois dispose de nombreuses initiatives autour des données. Mais elles ne se parlent pas encore.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl mb-6">🗂️</div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Initiatives dispersées</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Observatoires, projets de traçabilité, plateformes et référentiels se développent souvent sans cadre commun.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-2xl mb-6">🔗</div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Manque de lien</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Les systèmes actuels communiquent peu entre eux, rendant la traçabilité globale complexe.</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6">🌱</div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Besoin de lisibilité</h3>
              <p className="text-slate-600 text-sm leading-relaxed">DataWood crée le cadre partagé pour y remédier, sans imposer d'outil ni concurrencer l'existant.</p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Do */}
      <div className="py-24 px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">Ce que fait concrètement DataWood</h2>
            <p className="text-lg text-slate-500">Une approche de structuration amont, collaborative et ouverte.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📋', title: 'Recense', desc: 'Les initiatives existantes liées aux données, à la traçabilité et aux standards.' },
              { icon: '📚', title: 'Documente', desc: 'Les formats, référentiels et pratiques, dans un cadre commun et accessible.' },
              { icon: '🔄', title: 'Connecte', desc: 'Les travaux existants pour en révéler les convergences et les manques.' },
              { icon: '📖', title: 'Partage', desc: 'Un état de l\'art objectif accessible à tous les acteurs.' },
              { icon: '🤝', title: 'Fédère', desc: 'Une communauté d\'acteurs engagés autour d\'un langage commun.' },
              { icon: '🚀', title: 'Prépare', desc: 'Les conditions d\'un futur Data Space filière, sans imposer de solution.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-default">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          {/* What we are NOT */}
          <div className="mt-16 bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-50 rounded-full -mr-24 -mt-24 blur-2xl"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Ce que DataWood ne fait volontairement pas</h3>
                <p className="text-slate-600">Pour être clair sur notre positionnement et éviter toute confusion.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Plateforme logicielle',
                  'Standard imposé',
                  'Acteur commercial',
                  'Concurrent des projets',
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-center bg-red-50/50 rounded-xl px-4 py-3">
                    <span className="text-red-500 text-lg">✕</span>
                    <span className="text-slate-700 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-black mb-6">Devenez acteur du Data Space forêt-bois</h2>
          <p className="text-emerald-100 text-lg mb-8">Participez à la construction des standards de demain. Chaque contribution compte.</p>
          <button onClick={() => navigateTo('/rejoindre')} className="px-10 py-5 bg-white text-emerald-700 rounded-xl font-bold text-lg hover:bg-emerald-50 shadow-2xl transition-all hover:-translate-y-1">
            Rejoindre le consortium maintenant
          </button>
        </div>
      </div>

    </div>
  </div>
);

// ------------------------------------------------------------------
// MAIN APP COMPONENT
// ------------------------------------------------------------------

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSource, setContactSource] = useState<string>('');

  const openContactModal = (source: string) => {
    setContactSource(source);
    setIsContactModalOpen(true);
  };

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
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsMobileMenuOpen(false);
  };

  // Logic to determine view mode
  const isBlogPost = currentPath.startsWith('/blog/');
  const isBlogList = currentPath === '/blog';
  const isHome = currentPath === '/';

  // Custom Page Routing
  const renderContent = () => {
    if (isHome) return <HomePage navigateTo={navigateTo} />;
    if (currentPath === '/le-projet') return <ProjectPage />;
    if (currentPath === '/le-consortium') return <ConsortiumPage />;
    // if (currentPath === '/travaux') return <WorksPage />;
    if (currentPath === '/feuille-de-route') return <RoadmapPage />;
    if (currentPath === '/rejoindre') return <JoinPage onOpenContact={openContactModal} />;
    if (currentPath === '/ressources') return <ResourcesPage />;

    if (isBlogList) return <BlogListPage navigateTo={navigateTo} />;
    if (isBlogPost) return <BlogPostPage slug={currentPath.replace('/blog/', '')} />;

    // Fallback for any other generic page or 404
    return <div className="p-20 text-center">Page introuvable</div>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main id="main-content" className="flex-grow">
        {renderContent()}
      </main>

      <Footer onNavigate={navigateTo} />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        source={contactSource}
      />

      {/* Sticky Mobile CTA */}
      {isHome && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 lg:hidden z-40">
          <button onClick={() => navigateTo('/rejoindre')} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2">
            <span>🤝</span> Rejoindre le consortium
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
