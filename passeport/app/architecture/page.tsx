import type { Metadata } from 'next';
import { Architecture } from '@/components/architecture/Architecture';
export const metadata: Metadata = { title: 'Comment ça marche' };
export default function Page() { return <Architecture />; }
