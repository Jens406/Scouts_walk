import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { CommunityRef } from '../apiClient/routeApi';

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Props {
  communities: CommunityRef[];
}

export default function CommunityMarkers({ communities }: Props) {
  return (
    <>
      {communities.map((c) => (
        <Marker key={c.id} position={[c.lat, c.lng]} icon={blueIcon}>
          <Popup>
            <strong>🏕️ {c.name}</strong>
            {c.memberCount !== undefined && (
              <p>{c.memberCount} member{c.memberCount !== 1 ? 's' : ''}</p>
            )}
          </Popup>
        </Marker>
      ))}
    </>
  );
}
