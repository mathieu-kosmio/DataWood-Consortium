import type { Metadata } from 'next';
import { Products } from '@/components/admin/Products';
export const metadata: Metadata = { title: 'Produits' };
export default function Page() { return <Products />; }
