
import React from 'react';
import { NavItem } from '../types';
import { NAVIGATION } from '../constants';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SidebarItem: React.FC<{
  item: NavItem;
  currentPath: string;
  onNavigate: (path: string) => void;
  depth?: number;
}> = ({ item, currentPath, onNavigate, depth = 0 }) => {
  const isActive = currentPath === item.path;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="mb-0.5">
      {item.path ? (
        <button
          onClick={() => onNavigate(item.path!)}
          className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm group flex items-center gap-3 ${
            isActive
              ? 'bg-slate-900 text-white font-medium shadow-md shadow-slate-200'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          style={{ marginLeft: `${depth * 0.75}rem` }}
        >
          {depth === 0 && (
             <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? 'bg-emerald-400' : 'bg-slate-300 group-hover:bg-slate-400'}`}></span>
          )}
          {item.title}
        </button>
      ) : (
        <div 
          className="px-3 pt-6 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]"
          style={{ marginLeft: `${depth * 0.75}rem` }}
        >
          {item.title}
        </div>
      )}
      {hasChildren && (
        <div className="mt-0.5">
          {item.children!.map((child) => (
            <SidebarItem
              key={child.title}
              item={child}
              currentPath={currentPath}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-100 z-50 transform transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static lg:h-full ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center gap-4">
             <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-200 ring-2 ring-white">D</div>
             <div className="flex flex-col">
                <span className="font-bold text-slate-900 tracking-tight text-lg">DataWood</span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Consortium</span>
             </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto px-4 pb-8 custom-scrollbar">
            {NAVIGATION.map((item) => (
              <SidebarItem
                key={item.title}
                item={item}
                currentPath={currentPath}
                onNavigate={(p) => { onNavigate(p); onClose(); }}
              />
            ))}
          </nav>

          <div className="p-6 mt-auto">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-100 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 relative z-10">Infrastructure</p>
              <div className="flex items-center gap-2 relative z-10">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-slate-700 font-bold tracking-tight">V1.0 Stable</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
