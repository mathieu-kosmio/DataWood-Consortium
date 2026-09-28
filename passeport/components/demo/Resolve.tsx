'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DemoStrip } from '@/components/ui/kit';
import { SkeletonPassport } from '@/components/dpp/parts';

export function Resolve({ gtin, lot }: { gtin: string; lot: string }) {
  const router = useRouter();
  useEffect(() => { router.replace(`/p/${gtin}/?lot=${encodeURIComponent(lot)}`); }, [router, gtin, lot]);
  return <><DemoStrip /><main className="pp" aria-label={`Ouverture du passeport du lot ${lot}`}><SkeletonPassport /></main></>;
}
