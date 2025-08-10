import { WeatherRequest, WeatherResponse, OpenMeteoResponse } from '../types/weather';

// Novos tipos para a segunda rota
export interface WeatherRangeRequest {
  lat: number;
  lon: number;
  days: number; // 1-16 dias
}

export interface DailyWeatherData {
  date: string;
  weight: number;
  sunny: boolean;
  rainChance: number;
  tempMin: number;
  tempMax: number;
  weatherCode: number;
}

export interface WeatherRangeResponse {
  days: DailyWeatherData[];
  averageWeight: number;
  totalDays: number;
}

export interface OpenMeteoRangeResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    weathercode: number[];
  };
}
