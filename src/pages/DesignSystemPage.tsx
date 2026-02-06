import React, { useState, useEffect, useRef } from 'react';

interface NavItem {
  id: string;
  name: string;
  icon?: string;
  children?: NavItem[];
}

interface ComponentExample {
  id: string;
  name: string;
  description: string;
  status: 'stable' | 'beta';
  version: string;
  usage: number;
  variants: string[];
  code: {
    react: string;
    props: string;
    installation: string;
  };
}

export const DesignSystemPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('brand');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const sectionRefs = useRef<{[key: string]: HTMLElement | null}>({});

  // Navigation structure
  const navItems: NavItem[] = [
    {
      id: 'brand',
      name: '📘 Brand',
      children: [
        { id: 'logo', name: 'Logo' },
        { id: 'colors', name: 'Couleurs' },
        { id: 'typography', name: 'Typographie' }
      ]
    },
    {
      id: 'components',
      name: '🧩 Components',
      children: [
        { id: 'button', name: 'Button' },
        { id: 'card', name: 'Card' }
      ]
    },
    {
      id: 'patterns',
      name: '📐 Patterns',
      children: [
        { id: 'layouts', name: 'Layouts' }
      ]
    },
    { id: 'guide', name: 'ℹ️ Guide d\'utilisation' }
  ];

  // Component examples
  const components: ComponentExample[] = [
    {
      id: 'button',
      name: 'Button',
      description: 'Primary call-to-action component with multiple variants',
      status: 'stable',
      version: '1.0.0',
      usage: 42,
      variants: ['primary', 'secondary', 'outline', 'ghost'],
      code: {
        react: `<button className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 shadow-xl transition-all">
  Click Me
</button>`,
        props: `interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}`,
        installation: `import { Button } from './components/Button';

<Button variant="primary" size="lg">
  Submit
</Button>`
      }
    },
    {
      id: 'card',
      name: 'Card',
      description: 'Versatile container for content display',
      status: 'stable',
      version: '1.1.0',
      usage: 28,
      variants: ['default', 'highlight', 'dark'],
      code: {
        react: `<div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all">
  <h3 className="text-lg font-bold text-slate-900 mb-2">Card Title</h3>
  <p className="text-slate-500 text-sm">Card content goes here.</p>
</div>`,
        props: `interface CardProps {
  variant?: 'default' | 'highlight' | 'dark';
  children: React.ReactNode;
  className?: string;
}`,
        installation: `import { Card } from './components/Card';

<Card variant="highlight">
  <YourContent />
</Card>`
      }
    }
  ];

  // Scroll to section
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    
    setTimeout(() => {
      const element = sectionRefs.current[id];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Copy code to clipboard
  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Set up intersection observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Get component by id
  const getComponent = (id: string) => {
    return components.find(comp => comp.id === id);
  };

  // Render navigation items
  const renderNavItems = (items: NavItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        <button
          onClick={() => scrollToSection(item.id)}
          className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-2 ${
            activeSection === item.id
              ? 'bg-emerald-50 text-emerald-700 font-bold'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          {item.icon && <span className="text-xl">{item.icon}</span>}
          <span>{item.name}</span>
        </button>
        {item.children && level < 2 && (
          <div className="mt-1 space-y-1">
            {renderNavItems(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-slate-800 shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:sticky lg:top-20 inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-40 transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-200 ease-in-out h-screen lg:h-[calc(100vh-5rem)]`}
      >
        <div className="flex flex-col h-full pt-20 lg:pt-0">
          {/* Sidebar Header - Hidden when in App Shell since Navbar provides context */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 lg:hidden">
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Design System</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">DataWood Consortium</p>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {renderNavItems(navItems)}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Powered by
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">MKVD Studio</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header - Removed internal header as toggle and branding are redundant with main layout */}

        {/* Content */}
        <main className="p-6 lg:p-8 bg-slate-50 dark:bg-slate-800">
          {/* Brand Section */}
          <section
            id="brand"
            ref={(el) => (sectionRefs.current['brand'] = el)}
            className="mb-12 scroll-mt-24"
          >
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Brand Identity</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              The visual foundation of the DataWood Consortium design system.
            </p>

            {/* Logo */}
            <div id="logo" ref={(el) => (sectionRefs.current['logo'] = el)} className="mb-8 scroll-mt-24">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Logo</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shadow-lg">
                      <img src="/images/logo-square-light.svg" alt="Light Logo" className="w-full h-full" />
                    </div>
                    <span className="font-bold text-slate-900">Light Variant</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Used in navbar and light backgrounds
                  </p>
                </div>
                <div className="bg-slate-900 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shadow-lg">
                      <img src="/images/logo-square-g.svg" alt="Dark Logo" className="w-full h-full" />
                    </div>
                    <span className="font-bold text-white">Dark Variant</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Used in footer and dark backgrounds
                  </p>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div id="colors" ref={(el) => (sectionRefs.current['colors'] = el)} className="mb-8 scroll-mt-24">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Colors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { name: 'Emerald 600', value: '#16a34a', class: 'bg-emerald-600' },
                  { name: 'Emerald 500', value: '#22c55e', class: 'bg-emerald-500' },
                  { name: 'Slate 900', value: '#0f172a', class: 'bg-slate-900' },
                  { name: 'Slate 800', value: '#1e293b', class: 'bg-slate-800' },
                  { name: 'Slate 100', value: '#f1f5f9', class: 'bg-slate-100 border border-slate-200' },
                  { name: 'White', value: '#ffffff', class: 'bg-white border border-slate-200' }
                ].map((color) => (
                  <div key={color.name} className="p-4 bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600">
                    <div className={`w-full h-20 rounded-lg mb-2 ${color.class}`}></div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{color.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{color.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div id="typography" ref={(el) => (sectionRefs.current['typography'] = el)} className="mb-8 scroll-mt-24">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Typography</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Font Family</p>
                  <p className="text-slate-900 dark:text-white font-mono">'Inter', system-ui, -apple-system, sans-serif</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'H1', class: 'text-4xl font-black' },
                    { name: 'H2', class: 'text-3xl font-black' },
                    { name: 'H3', class: 'text-2xl font-bold' },
                    { name: 'Body', class: 'text-lg' }
                  ].map((type) => (
                    <div key={type.name} className="p-4 bg-white dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{type.name}</p>
                      <p className={type.class}>Sample Text</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Components Section */}
          <section
            id="components"
            ref={(el) => (sectionRefs.current['components'] = el)}
            className="mb-12 scroll-mt-24"
          >
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Components</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              Reusable UI components that build the interface.
            </p>

            {/* Button Component */}
            {getComponent('button') && (
              <div id="button" ref={(el) => (sectionRefs.current['button'] = el)} className="mb-8 bg-white dark:bg-slate-700 rounded-2xl p-6 shadow-sm scroll-mt-24">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{getComponent('button')!.name}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{getComponent('button')!.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      getComponent('button')!.status === 'stable' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>{
                      getComponent('button')!.status
                    }</span>
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                      v{getComponent('button')!.version}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      Used {getComponent('button')!.usage}x
                    </span>
                  </div>
                </div>

                {/* Preview */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">PREVIEW</h4>
                  <div className="flex gap-4 flex-wrap">
                    <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                      Primary
                    </button>
                    <button className="px-6 py-3 bg-white text-slate-800 border-2 border-slate-200 rounded-xl font-bold hover:border-emerald-300 transition-colors">
                      Secondary
                    </button>
                    <button className="px-6 py-3 border-2 border-slate-200 rounded-xl font-bold hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                      Outline
                    </button>
                    <button className="px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl font-bold transition-colors">
                      Ghost
                    </button>
                  </div>
                </div>

                {/* Code */}
                <div className="border-t border-slate-200 dark:border-slate-600 pt-6">
                  <div className="flex gap-4 mb-4">
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white">
                      React
                    </button>
                    <button className="px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                      Props
                    </button>
                    <button className="px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                      Installation
                    </button>
                  </div>

                  <div className="relative bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code className="language-jsx">
                        {getComponent('button')!.code.react}
                      </code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(getComponent('button')!.code.react, 'button')}
                      className="absolute top-2 right-2 p-1 rounded-md bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      {copied === 'button' ? (
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Card Component */}
            {getComponent('card') && (
              <div id="card" ref={(el) => (sectionRefs.current['card'] = el)} className="mb-8 bg-white dark:bg-slate-700 rounded-2xl p-6 shadow-sm scroll-mt-24">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{getComponent('card')!.name}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{getComponent('card')!.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      getComponent('card')!.status === 'stable' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>{
                      getComponent('card')!.status
                    }</span>
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                      v{getComponent('card')!.version}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      Used {getComponent('card')!.usage}x
                    </span>
                  </div>
                </div>

                {/* Preview */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">PREVIEW</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <h5 className="font-bold text-slate-900 mb-2">Default</h5>
                      <p className="text-sm text-slate-500">Standard card variant</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border-2 border-emerald-500 shadow-xl">
                      <h5 className="font-bold text-slate-900 mb-2">Highlight</h5>
                      <p className="text-sm text-slate-500">Featured content</p>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-4 text-white">
                      <h5 className="font-bold mb-2">Dark</h5>
                      <p className="text-sm text-slate-300">Dark theme</p>
                    </div>
                  </div>
                </div>

                {/* Code */}
                <div className="border-t border-slate-200 dark:border-slate-600 pt-6">
                  <div className="flex gap-4 mb-4">
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white">
                      React
                    </button>
                    <button className="px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                      Props
                    </button>
                    <button className="px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                      Installation
                    </button>
                  </div>

                  <div className="relative bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code className="language-jsx">
                        {getComponent('card')!.code.react}
                      </code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(getComponent('card')!.code.react, 'card')}
                      className="absolute top-2 right-2 p-1 rounded-md bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      {copied === 'card' ? (
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Patterns Section */}
          <section
            id="patterns"
            ref={(el) => (sectionRefs.current['patterns'] = el)}
            className="mb-12 scroll-mt-24"
          >
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Patterns</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              Design patterns and best practices for common use cases.
            </p>

            <div id="layouts" ref={(el) => (sectionRefs.current['layouts'] = el)} className="mb-8 scroll-mt-24">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Layouts</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-sm">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">App Shell</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Main application layout with navbar, content, and footer
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
                    <div className="h-8 bg-emerald-600 rounded-t-lg mb-2"></div>
                    <div className="h-32 bg-white dark:bg-slate-700 rounded-b-lg"></div>
                    <div className="h-8 bg-slate-900 dark:bg-slate-800 rounded-lg mt-2"></div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-sm">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Landing Page</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Hero section with feature cards and CTA
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
                    <div className="h-16 bg-emerald-600 rounded-lg mb-2"></div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-12 bg-white dark:bg-slate-700 rounded"></div>
                      <div className="h-12 bg-white dark:bg-slate-700 rounded"></div>
                      <div className="h-12 bg-white dark:bg-slate-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Guide Section */}
          <section
            id="guide"
            ref={(el) => (sectionRefs.current['guide'] = el)}
            className="mb-12 scroll-mt-24"
          >
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Guide d'utilisation</h2>
            <div className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Getting Started</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                This design system provides a comprehensive set of components and guidelines for building consistent interfaces.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Installation</h4>
              <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4 mb-4">
                <pre className="text-sm overflow-x-auto">
                  <code className="language-bash">npm install @datawood/design-system</code>
                </pre>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Usage</h4>
              <p className="text-slate-600 dark:text-slate-300">
                Import components and use them in your React application:
              </p>
              <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code className="language-jsx">
{`import { Button, Card } from '@datawood/design-system';

function MyComponent() {
  return (
    <div>
      <Button variant="primary">Click Me</Button>
      <Card variant="highlight">
        <h3>Card Title</h3>
        <p>Card content</p>
      </Card>
    </div>
  );
}`}
                  </code>
                </pre>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Toast Notification */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in zoom-in">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">Code copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  );
};