
import React from 'react';
import { NAVIGATION } from '../constants';

interface NavbarProps {
    currentPath: string;
    onNavigate: (path: string) => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, isMobileMenuOpen, setIsMobileMenuOpen }) => {

    const handleNavClick = (path: string) => {
        onNavigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 glass border-b border-slate-200/50 bg-white/90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center shrink-0 cursor-pointer" onClick={() => handleNavClick('/')}>
                        <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 shadow-lg shadow-emerald-100 bg-white">
                            <img
                                src="/images/logo-square-light.svg"
                                alt="DataWood Consortium"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">DataWood <span className="text-emerald-600">Consortium</span></span>
                    </div>

                    {/* Desktop Menu - Simplified */}
                    <div className="hidden lg:flex items-center space-x-2">
                        {NAVIGATION.slice(1).map((item) => (
                            <button
                                key={item.title}
                                onClick={() => handleNavClick(item.path!)}
                                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${currentPath === item.path
                                        ? 'text-emerald-700 bg-emerald-50 shadow-sm ring-1 ring-emerald-200'
                                        : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-50'
                                    }`}
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center lg:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-slate-200 shadow-xl absolute w-full left-0 z-50">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {NAVIGATION.slice(1).map((item) => (
                            <button
                                key={item.title}
                                onClick={() => handleNavClick(item.path!)}
                                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-bold ${currentPath === item.path ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};
