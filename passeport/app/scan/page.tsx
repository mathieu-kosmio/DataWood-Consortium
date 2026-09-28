import type { Metadata } from 'next';
import { ScanPage } from '@/components/demo/ScanPage';
export const metadata: Metadata = { title: 'Scanner une étiquette' };
export default function Page() { return <ScanPage />; }
