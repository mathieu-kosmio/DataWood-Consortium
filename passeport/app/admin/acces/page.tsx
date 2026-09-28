import type { Metadata } from 'next';
import { Access } from '@/components/admin/Access';
export const metadata: Metadata = { title: 'Accès aux données' };
export default function Page() { return <Access />; }
