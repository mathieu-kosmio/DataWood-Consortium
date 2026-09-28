'use client';
/* Scan simulé (spec § 7.1) : le viseur « reconnaît » l'étiquette, ou l'on touche un QR de démonstration. */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Icon } from '@/components/ui/Icon';
import { DemoStrip } from '@/components/ui/kit';
import { HERO_GTIN, issuer, product } from '@/lib/data';
import { asset } from '@/lib/asset';
import { useStore } from '@/lib/store';

const DEMOS: [string, string, string][] = [
  [HERO_GTIN, 'Montrez-le en premier : passeport complet', ''],
  ['03760000000028', 'Un certificat expiré, une source à couper', 'c'],
  ['03760000000035', 'Une version plus récente existe', 'w'],
];

export function ScanPage() {
  const [hit, setHit] = useState(false);
  const emit = useStore(s => s.emit);
  const hydrated = useStore(s => s.hydrated);
  const router = useRouter();
  const url = (g: string) => `https://datawood.org/passeport/01/${g}`;
  useEffect(() => { const t = setTimeout(() => setHit(true), 1700); return () => clearTimeout(t); }, []);
  useEffect(() => { if (hit && hydrated) { emit('scan:detected'); navigator.vibrate?.(30); } }, [hit, hydrated, emit]);
  const open = (g: string) => { emit('scan:detected'); router.push(`/p/${g}`); };
  const hero = product(HERO_GTIN)!;
  return (
    <div className="scan-page">
      <DemoStrip />
      <section className="cam" aria-label="Viseur de l'appareil photo (simulé)">
        <div className="cam-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/img/scan-scene.webp')} alt="" width={900} height={1350} />
          <span className="qr-on-label"><QRCodeSVG value={url(HERO_GTIN) + '/10/27-0118'} level="M" style={{ width: '100%', height: '100%' }} /></span>
          <div className={`finder${hit ? ' hit' : ''}`}><i /><i /><i /><i />{!hit && <span className="line" />}</div>
          {hit && <button className="detect" id="detect" onClick={() => open(HERO_GTIN)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(hero.image)} alt="" />{hero.name}<Icon n="chevron-right" /></button>}
        </div>
        <div className="cam-bar"><Link className="round" href="/" aria-label="Fermer"><Icon n="x" /></Link><span className="t">Scanner une étiquette</span><button className="round" aria-label="Lampe"><Icon n="flashlight" /></button></div>
        <p className="cam-hint" role="status">{hit ? 'Étiquette reconnue' : "Visez le QR code de l'étiquette"}</p>
      </section>
      <section className="tray"><div className="grab" />
        <h2>Produits de démonstration</h2><p className="d">Pas d&apos;étiquette sous la main ? Touchez un QR pour le « scanner ».</p>
        <ul className="demo">{DEMOS.map(([g, d, t], k) => {
          const p = product(g)!;
          return <li key={g}><button id={`demo-${k}`} onClick={() => open(g)}><span className="q"><QRCodeSVG value={url(g)} level="M" style={{ width: '100%', height: '100%' }} /></span>
            <div className="grow"><div className="n">{p.name}</div><div className="m">{issuer(p.manufacturerId).name}</div><span className={`tag ${t}`}>{d}</span></div><Icon n="chevron-right" /></button></li>;
        })}</ul>
      </section>
    </div>
  );
}
