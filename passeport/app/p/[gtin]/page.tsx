import type { Metadata } from 'next';
import { PassportPage } from '@/components/dpp/PassportPage';
import { PRODUCTS, product } from '@/lib/data';

export function generateStaticParams() { return PRODUCTS.map(p => ({ gtin: p.gtin })); }
export function generateMetadata({ params }: { params: { gtin: string } }): Metadata { return { title: product(params.gtin)?.name }; }

export default function Page({ params }: { params: { gtin: string } }) {
  return <PassportPage gtin={params.gtin} />;
}
