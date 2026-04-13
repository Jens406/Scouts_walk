import { logger } from '../logging';

export interface MapTile {
  url: string;
  attribution: string;
}

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
}

export const mapProvider = {
  getTileUrl(): MapTile {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors',
    };
  },

  async geocode(query: string): Promise<GeocodingResult | null> {
    // Stub: In production, call a real geocoding API
    logger.info(`[MapProvider] Geocoding: ${query}`);
    return null;
  },
};
