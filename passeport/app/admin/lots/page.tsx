import type { Metadata } from 'next';
import { Lots } from '@/components/admin/Lots';
export const metadata: Metadata = { title: 'Lots et QR codes' };
export default function Page() { return <Lots />; }
