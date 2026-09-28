'use client';
/* Simulateur de connecteurs (spec § 6) : la donnée reste chez l'émetteur.
   Chaque bloc interroge le nœud de sa source ; il attend la latence du nœud, ou échoue au bout de 1,6 s si le nœud est coupé. */
import { useEffect, useState } from 'react';

export type SourceState = 'loading' | 'ok' | 'offline';
const resolved = new Set<string>();

/** Oublie les réponses d'un nœud : la prochaine lecture repasse par le réseau. */
export function invalidate(nodeId: string) {
  [...resolved].filter(k => k.startsWith(nodeId + ':')).forEach(k => resolved.delete(k));
}

export function fetchFromNode(nodeId: string, online: boolean, latencyMs: number): Promise<void> {
  const key = `${nodeId}:${online}`;
  if (resolved.has(key)) return online ? Promise.resolve() : Promise.reject(new Error('Source indisponible'));
  return new Promise((res, rej) => {
    setTimeout(() => {
      resolved.add(key);
      online ? res() : rej(new Error('Source indisponible'));
    }, online ? latencyMs : 1600);
  });
}

export function useSource(nodeId: string, online: boolean, latencyMs: number): SourceState {
  const key = `${nodeId}:${online}`;
  const [state, setState] = useState<SourceState>('loading');
  useEffect(() => {
    let live = true;
    if (!resolved.has(key)) setState('loading');
    fetchFromNode(nodeId, online, latencyMs).then(() => live && setState('ok'), () => live && setState('offline'));
    return () => { live = false; };
  }, [key, nodeId, online, latencyMs]);
  return state;
}
