'use client';
/* Cartes Leaflet (chargées côté client seulement) : tuiles OpenStreetMap passées en gris par la feuille de style. */
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';

const TILE = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTR = '© OpenStreetMap';

function Fit({ pts, pad = 28 }: { pts: [number, number][]; pad?: number }) {
  const m = useMap();
  const key = pts.map(p => p.join(',')).join(';');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { m.fitBounds(L.latLngBounds(pts), { padding: [pad, pad] }); }, [m, key, pad]);
  return null;
}

function arc(a: [number, number], b: [number, number], k = 0.18): [number, number][] {
  const [x1, y1] = a, [x2, y2] = b, mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1;
  const cx = mx - dy * k, cy = my + dx * k, out: [number, number][] = [];
  for (let t = 0; t <= 1.001; t += 0.05) out.push([(1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2, (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t * t * y2]);
  return out;
}

const pin = (label: string, sel: boolean, shift = false) => L.divIcon({
  className: '', html: `<span class="pin${sel ? ' sel' : ''}">${label}</span>`, iconSize: [30, 30], iconAnchor: shift ? [30, 26] : [15, 15],
});
const BLD_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/></svg>';
const bldPin = L.divIcon({ className: '', html: `<span class="pin" style="width:24px;height:24px">${BLD_SVG}</span>`, iconSize: [24, 24], iconAnchor: [12, 12] });

export function ChainMap({ steps, sel, onSelect }: { steps: { order: number; lat: number; lng: number }[]; sel: number; onSelect: (n: number) => void }) {
  const pts = steps.map(s => [s.lat, s.lng] as [number, number]);
  return (
    <MapContainer className="leaf" center={pts[0]} zoom={6} zoomControl={false} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer url={TILE} attribution={ATTR} />
      <Fit pts={pts} />
      {steps.slice(0, -1).map((s, k) => <Polyline key={k} positions={arc(pts[k], pts[k + 1])} pathOptions={{ color: '#1f2a37', weight: 2, opacity: 0.7, dashArray: '2 6', lineCap: 'round' }} />)}
      {steps.map((s, k) => {
        const close = k > 0 ? Math.hypot(s.lat - steps[k - 1].lat, s.lng - steps[k - 1].lng) < 0.6 : k === 0 && steps[1] && Math.hypot(s.lat - steps[1].lat, s.lng - steps[1].lng) < 0.6;
        return <Marker key={s.order} position={[s.lat, s.lng]} icon={pin(String(s.order), s.order === sel, k === 0 && !!close)} eventHandlers={{ click: () => onSelect(s.order) }} />;
      })}
    </MapContainer>
  );
}

export function PointsMap({ center, points, zoom, fit = true }: { center: [number, number]; points: { lat: number; lng: number; color: string; r?: number }[]; zoom?: number; fit?: boolean }) {
  const pts = points.map(p => [p.lat, p.lng] as [number, number]).concat([center]);
  return (
    <MapContainer className="leaf" center={center} zoom={zoom ?? 12} zoomControl={false} scrollWheelZoom={false} dragging={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer url={TILE} attribution={ATTR} />
      {fit && <Fit pts={pts} pad={24} />}
      <Marker position={center} icon={bldPin} />
      {points.map((p, k) => <CircleMarker key={k} center={[p.lat, p.lng]} radius={p.r ?? 7} pathOptions={{ color: '#fff', weight: p.r ? 1.5 : 3, fillColor: p.color, fillOpacity: p.r ? 0.72 : 1 }} />)}
    </MapContainer>
  );
}

export function ScansMap({ points }: { points: number[][] }) {
  return (
    <MapContainer className="leaf" center={[46.6, 2.6]} zoom={5} zoomControl={false} scrollWheelZoom={false} dragging={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer url={TILE} attribution={ATTR} />
      {points.map(([a, b, n], k) => <CircleMarker key={k} center={[a, b]} radius={Math.sqrt(n) * 0.9} pathOptions={{ color: '#fff', weight: 1.5, fillColor: '#1f2a37', fillOpacity: 0.72 }} />)}
    </MapContainer>
  );
}

export function PinMap({ center }: { center: [number, number] }) {
  return (
    <MapContainer className="leaf" center={center} zoom={15} zoomControl={false} scrollWheelZoom={false} dragging={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer url={TILE} attribution={ATTR} />
      <Marker position={center} icon={bldPin} />
    </MapContainer>
  );
}
