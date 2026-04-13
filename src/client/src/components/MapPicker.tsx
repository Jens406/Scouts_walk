import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { CommunityRef } from '../apiClient/routeApi';
import CommunityMarkers from './CommunityMarkers';

// Fix Leaflet default icon paths in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Props {
  communities?: CommunityRef[];
  routeWaypoints?: [number, number][];
  onPlanRoute: (start: { lat: number; lng: number }, destination: { lat: number; lng: number }, name: string) => void;
  isLoading?: boolean;
}

type ClickMode = 'start' | 'destination' | null;

function ClickHandler({
  mode,
  onStart,
  onDest,
}: {
  mode: ClickMode;
  onStart: (ll: L.LatLng) => void;
  onDest: (ll: L.LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      if (mode === 'start') onStart(e.latlng);
      else if (mode === 'destination') onDest(e.latlng);
    },
  });
  return null;
}

export default function MapPicker({ communities = [], routeWaypoints = [], onPlanRoute, isLoading }: Props) {
  const [start, setStart] = useState<L.LatLng | null>(null);
  const [destination, setDestination] = useState<L.LatLng | null>(null);
  const [clickMode, setClickMode] = useState<ClickMode>(null);
  const [routeName, setRouteName] = useState('');

  const handlePlan = () => {
    if (!start || !destination || !routeName.trim()) return;
    onPlanRoute({ lat: start.lat, lng: start.lng }, { lat: destination.lat, lng: destination.lng }, routeName);
  };

  const polyline: [number, number][] =
    routeWaypoints.length > 0
      ? routeWaypoints
      : start && destination
      ? [[start.lat, start.lng], [destination.lat, destination.lng]]
      : [];

  return (
    <div className="map-picker">
      <div className="map-controls">
        <input
          className="route-name-input"
          type="text"
          placeholder="Route name..."
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
        />
        <div className="map-btn-row">
          <button
            className={`map-btn ${clickMode === 'start' ? 'active' : ''}`}
            onClick={() => setClickMode(clickMode === 'start' ? null : 'start')}
          >
            📍 Set Start
          </button>
          <button
            className={`map-btn ${clickMode === 'destination' ? 'active' : ''}`}
            onClick={() => setClickMode(clickMode === 'destination' ? null : 'destination')}
          >
            🏁 Set Destination
          </button>
          <button
            className="map-btn plan-btn"
            onClick={handlePlan}
            disabled={!start || !destination || !routeName.trim() || isLoading}
          >
            {isLoading ? 'Planning…' : '🗺️ Plan Route'}
          </button>
        </div>
        {clickMode && (
          <p className="map-hint">
            Click on the map to set your {clickMode === 'start' ? 'start point' : 'destination'}
          </p>
        )}
        {start && <p className="map-coords">Start: {start.lat.toFixed(4)}, {start.lng.toFixed(4)}</p>}
        {destination && <p className="map-coords">Destination: {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}</p>}
      </div>
      <MapContainer center={[51.505, -0.09]} zoom={5} className="leaflet-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler
          mode={clickMode}
          onStart={(ll) => { setStart(ll); setClickMode(null); }}
          onDest={(ll) => { setDestination(ll); setClickMode(null); }}
        />
        {start && <Marker position={start} icon={greenIcon} />}
        {destination && <Marker position={destination} icon={redIcon} />}
        {polyline.length > 1 && <Polyline positions={polyline} color="#2d6a2d" weight={4} />}
        <CommunityMarkers communities={communities} />
      </MapContainer>
    </div>
  );
}
