'use client';
import { useEffect, useState } from 'react';
import { useStore } from './store';
import { useSource } from './dataspace';

/** État de la source d'une donnée : chargement, réponse, ou nœud injoignable. */
export function useNode(nodeId: string) {
  const n = useStore(s => s.nodes[nodeId]);
  return useSource(nodeId, n?.online ?? true, n?.latency ?? 300);
}

/** Vrai à partir de 1024 px (mise en page bureau). Faux au premier rendu, comme le HTML statique. */
export function useIsDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(min-width: 1024px)');
    const on = () => setD(m.matches);
    on(); m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return d;
}

/** Émet un événement de récit quand l'élément reste visible un moment. */
export function useSeen(id: string, evt: string, ms = 1000) {
  const emit = useStore(s => s.emit);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) t = setTimeout(() => emit(evt), ms);
      else if (t) clearTimeout(t);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); if (t) clearTimeout(t); };
  }, [id, evt, ms, emit]);
}
