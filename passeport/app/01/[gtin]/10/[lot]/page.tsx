import { Resolve } from '@/components/demo/Resolve';
import { FLEET, HERO_GTIN, PRODUCTS } from '@/lib/data';

/* Résolution GS1 Digital Link : /01/{GTIN}/10/{lot} ouvre le passeport du produit. */
export function generateStaticParams() {
  return [...FLEET.lots.map(l => ({ gtin: HERO_GTIN, lot: l.lot })), ...PRODUCTS.filter(p => p.batch && p.gtin !== HERO_GTIN).map(p => ({ gtin: p.gtin, lot: p.batch! }))];
}
export default function Page({ params }: { params: { gtin: string; lot: string } }) {
  return <Resolve gtin={params.gtin} lot={params.lot} />;
}
