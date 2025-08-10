// types/seasonality.ts
export interface SeasonalityRequest {
  lat: number;
  lon: number;
  date?: string; // YYYY-MM-DD
}

export interface SeasonPeriod {
  season: 'summer' | 'winter' | 'spring' | 'autumn';
  intensity: 'high' | 'low' | 'medium';
  startDate: string;
  endDate: string;
  durationDays: number;
  description: string;
}

export interface Holiday {
  name: string;
  date: string;
  type: 'public' | 'bank' | 'school' | 'optional' | 'observance';
  primary_type: string;
  canonical_url?: string;
  urlid?: string;
  locations: string;
  states?: string;
}

export interface SeasonInfo {
  season: 'summer' | 'winter' | 'spring' | 'autumn';
  intensity: 'high' | 'low' | 'medium';
  weight: number; // 0.7 - 1.3
}

export interface HolidayInfo {
  isHoliday: boolean;
  holidayName?: string;
  holidayType?: string;
  weight: number; // 1.0 - 1.5
}

export interface VacationPeriod {
  name: string;
  startDate: string;
  endDate: string;
  region: string;
  weight: number; // 1.2 - 1.5
}

export interface SeasonalityResponse {
  hemisphere: 'northern' | 'southern';
  hemisphereDescription: string;
  currentSeason: SeasonPeriod;
  highSeasons: SeasonPeriod[];
  lowSeasons: SeasonPeriod[];
  allSeasons: SeasonPeriod[];
  date: string;
  country: string;
  region: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  seasonInfo: SeasonInfo;
  holidayInfo: HolidayInfo;
  vacationPeriods: VacationPeriod[];
  finalWeight: number; // 0.7 - 1.5 (resultado final)
  breakdown: {
    baseWeight: number;
    seasonWeight: number;
    holidayWeight: number;
    vacationWeight: number;
    appliedRule: string;
  };
  recommendations: {
    category: 'low' | 'medium' | 'high' | 'peak';
    description: string;
    suggestedMarkup: string;
  };
}


