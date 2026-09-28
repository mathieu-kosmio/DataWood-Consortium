import type { Metadata } from 'next';
import { BuildingPage } from '@/components/building/BuildingPage';
import { BUILDINGS, building } from '@/lib/data';

export function generateStaticParams() { return BUILDINGS.map(b => ({ id: b.id })); }
export function generateMetadata({ params }: { params: { id: string } }): Metadata { return { title: `Carnet ${building(params.id)?.name}` }; }
export default function Page({ params }: { params: { id: string } }) { return <BuildingPage id={params.id} tab="tableau" />; }
