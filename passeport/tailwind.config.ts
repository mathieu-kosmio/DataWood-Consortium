import type { Config } from 'tailwindcss';

/* Les tokens vivent en variables CSS (app/styles/tokens.css, repris des écrans de référence).
   Tailwind les expose ; la préflight est coupée pour ne pas écraser la base des écrans. */
const v = (n: string) => `var(--${n})`;
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        em: { DEFAULT: v('em'), 50: v('em50'), 100: v('em100'), 200: v('em200'), 700: v('em7'), 800: v('em8'), 900: v('em9') },
        s: { 50: v('s50'), 100: v('s100'), 200: v('s200'), 300: v('s300'), 400: v('s400'), 500: v('s500'), 600: v('s600'), 700: v('s700'), 800: v('s800'), 900: v('s900'), 950: v('s950') },
        paper: v('paper'),
        amber: { 50: v('amber50'), 200: v('amber200'), 700: v('amber700'), 800: v('amber800') },
        red: { 50: v('red50'), 200: v('red200'), 700: v('red700') },
        mat: { min: v('mat-min'), met: v('mat-met'), bois: v('mat-bois'), pla: v('mat-pla'), ver: v('mat-ver'), aut: v('mat-aut') },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], mono: ['JetBrains Mono', 'ui-monospace', 'monospace'] },
      borderRadius: { card: '14px' },
      boxShadow: { 1: v('sh1'), 2: v('sh2') },
    },
  },
  plugins: [],
};
export default config;
