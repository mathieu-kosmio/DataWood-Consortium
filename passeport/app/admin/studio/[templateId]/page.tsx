import type { Metadata } from 'next';
import { Studio } from '@/components/admin/Studio';
export const metadata: Metadata = { title: 'Studio' };
export function generateStaticParams() { return [{ templateId: 'rpc' }]; }
export default function Page() { return <Studio />; }
