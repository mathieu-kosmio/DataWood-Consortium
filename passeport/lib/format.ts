/* Nombres à la française : 3 chiffres significatifs au plus, virgule décimale, espace fine avant l'unité. */
export const NNBSP = ' ';

export function num(n: number, opts: { sig?: number; dec?: number } = {}) {
  const f = opts.dec !== undefined
    ? new Intl.NumberFormat('fr-FR', { minimumFractionDigits: opts.dec, maximumFractionDigits: opts.dec })
    : new Intl.NumberFormat('fr-FR', { maximumSignificantDigits: opts.sig ?? 3 });
  return f.format(n);
}

export function value(v: number | string | boolean) {
  if (typeof v === 'number') return num(v);
  if (typeof v === 'boolean') return v ? 'Oui' : 'Non';
  return v;
}

export function withUnit(v: number | string | boolean, unit?: string) {
  return unit ? `${value(v)}${NNBSP}${unit}` : value(v);
}

/** 2026-09-18 → 18/09/2026 */
export function date(iso?: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export const tonnes = (t: number) => `${num(Math.round(t), { dec: 0 })}${NNBSP}t`;
