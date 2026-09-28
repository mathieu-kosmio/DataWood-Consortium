import type { Metadata } from 'next';
import { PassportPage } from '@/components/dpp/PassportPage';
import { PRODUCTS, RUBRIQUES, product } from '@/lib/data';
import type { Rubrique } from '@/lib/types';

export function generateStaticParams() { return PRODUCTS.flatMap(p => RUBRIQUES.map(r => ({ gtin: p.gtin, rubrique: r.key }))); }
export function generateMetadata({ params }: { params: { gtin: string; rubrique: string } }): Metadata {
  return { title: `${RUBRIQUES.find(r => r.key === params.rubrique)?.question} · ${product(params.gtin)?.name}` };
}

export default function Page({ params }: { params: { gtin: string; rubrique: Rubrique } }) {
  return <PassportPage gtin={params.gtin} rub={params.rubrique} />;
}
