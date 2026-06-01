import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Venue } from '../data/mockData';

interface MapViewProps {
  venues: Venue[];
  height?: number;
  fullscreen?: boolean;
}

const scoreColors: Record<string, string> = {
  A: '#22C55E',
  B: '#EAB308',
  C: '#EF4444',
};

const scoreLabel: Record<string, string> = {
  A: 'Fiable',
  B: 'Partiel',
  C: 'Non-conforme',
};

export default function MapView({ venues, height = 210, fullscreen = false }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const navigate = useNavigate();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Fix default marker icon path issue with Vite
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '',
        iconUrl: '',
        shadowUrl: '',
      });

      // Init map centered on Lille
      const map = L.map(mapRef.current!, {
        center: [50.6292, 3.0573],
        zoom: fullscreen ? 11 : 12,
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: fullscreen,
        dragging: fullscreen || window.innerWidth > 600,
        tap: true,
      });

      mapInstanceRef.current = map;

      // CartoDB Positron — style épuré blanc/gris
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '© OpenStreetMap © CARTO',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map);

      // Add attribution discretely
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('© <a href="https://carto.com" target="_blank">CARTO</a>')
        .addTo(map);

      // Draw markers
      venues.forEach((venue) => {
        const color = scoreColors[venue.score];

        // Custom SVG pin
        const svgPin = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" width="36" height="44">
            <filter id="shadow" x="-30%" y="-10%" width="160%" height="150%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/>
            </filter>
            <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z"
              fill="${color}" filter="url(#shadow)"/>
            <circle cx="18" cy="18" r="9" fill="white"/>
            <text x="18" y="23" text-anchor="middle" font-family="system-ui,sans-serif"
              font-weight="800" font-size="12" fill="${color}">${venue.score}</text>
          </svg>`;

        const icon = L.divIcon({
          html: svgPin,
          iconSize: [36, 44],
          iconAnchor: [18, 44],
          popupAnchor: [0, -46],
          className: '',
        });

        const marker = L.marker([venue.lat, venue.lng], { icon }).addTo(map);

        marker.on('click', () => {
          setSelectedVenue(venue);
        });

        markersRef.current.push(marker);
      });

      // Close popup on map click
      map.on('click', () => setSelectedVenue(null));
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  // Invalidate size when height/fullscreen changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 100);
    }
  }, [height, fullscreen]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height }}>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Legend */}
      <div className="absolute top-2 right-2 z-[1000] bg-white bg-opacity-95 rounded-xl px-2 py-1.5 shadow-md flex flex-col gap-1">
        {(['A', 'B', 'C'] as const).map((score) => (
          <div key={score} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: scoreColors[score] }} />
            <span className="text-[10px] text-gray-700 font-semibold">{score}</span>
          </div>
        ))}
      </div>

      {/* Popup card */}
      {selectedVenue && (
        <div
          className="absolute bottom-3 left-3 right-3 z-[1000] bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
          onClick={() => navigate(`/visiteur/lieu/${selectedVenue.id}`)}
        >
          <div
            className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
            style={{ background: `linear-gradient(135deg, ${selectedVenue.bgColor}, ${selectedVenue.bgColor2})` }}
          >
            {selectedVenue.type.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900 truncate">{selectedVenue.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{selectedVenue.address}, {selectedVenue.city}</p>
          </div>
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-extrabold"
              style={{ backgroundColor: scoreColors[selectedVenue.score] }}
            >
              {selectedVenue.score}
            </div>
            <span className="text-[9px] font-semibold" style={{ color: scoreColors[selectedVenue.score] }}>
              {scoreLabel[selectedVenue.score]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
