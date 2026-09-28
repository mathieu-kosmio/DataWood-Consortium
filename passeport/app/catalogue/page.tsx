import type { Metadata } from 'next';
import { Catalogue } from '@/components/catalog/Catalogue';
export const metadata: Metadata = { title: 'Catalogue du réseau' };
export default function Page() { return <Catalogue />; }
