// services/geocodingService.ts

import axios from 'axios';

export interface GeocodingResponse {
  country: string;
  countryCode: string;
  region: string;
  city: string;
}

export interface OpenCageGeocodingResponse {
  results: Array<{
    components: {
      country?: string;
      country_code?: string;
      state?: string;
      region?: string;
      county?: string;
      city?: string;
      town?: string;
      village?: string;
    };
  }>;
}

export class GeocodingService {
  // Usando OpenCage (gratuito até 2500 req/dia)
  private readonly apiKey = process.env.OPENCAGE_API_KEY || 'YOUR_API_KEY';
  private readonly baseUrl = 'https://api.opencagedata.com/geocode/v1/json';

  async getCountryFromCoordinates(lat: number, lon: number): Promise<GeocodingResponse> {
    try {
      const response = await axios.get<OpenCageGeocodingResponse>(this.baseUrl, {
        params: {
          q: `${lat},${lon}`,
          key: this.apiKey,
          limit: 1,
          no_annotations: 1
        },
        timeout: 5000
      });

      const result = response.data.results[0];
      if (!result) {
        throw new Error('Localização não encontrada');
      }

      const components = result.components;
      return {
        country: components.country || 'Unknown',
        countryCode: components.country_code?.toUpperCase() || 'XX',
        region: components.state || components.region || components.county || 'Unknown',
        city: components.city || components.town || components.village || 'Unknown'
      };

    } catch (error) {
      // Fallback baseado em coordenadas aproximadas
      return this.getFallbackLocation(lat, lon);
    }
  }

  private getFallbackLocation(lat: number, lon: number): GeocodingResponse {
    // Mapeamento básico por regiões geográficas
    if (lat >= -35 && lat <= 5 && lon >= -75 && lon <= -35) {
      return { country: 'Brazil', countryCode: 'BR', region: 'Unknown', city: 'Unknown' };
    } else if (lat >= 25 && lat <= 50 && lon >= -125 && lon <= -65) {
      return { country: 'United States', countryCode: 'US', region: 'Unknown', city: 'Unknown' };
    } else if (lat >= 35 && lat <= 72 && lon >= -10 && lon <= 40) {
      return { country: 'Germany', countryCode: 'DE', region: 'Unknown', city: 'Unknown' };
    }
    
    return { country: 'Unknown', countryCode: 'XX', region: 'Unknown', city: 'Unknown' };
  }
}

