import type { Metadata } from 'next';
import { Fleet } from '@/components/admin/Fleet';
export const metadata: Metadata = { title: 'Espace fabricant' };
export default function Page() { return <Fleet />; }
