import React from 'react';
import { venues } from '../../data/mockData';
import MapView from '../../components/MapView';

export default function VisitorMap() {
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Full-height map */}
      <div className="flex-1 relative">
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <MapView venues={venues} height={window.innerHeight - 64} fullscreen />
      </div>
    </div>
  );
}
