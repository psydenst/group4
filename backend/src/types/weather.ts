export interface WeatherRequest {
  lat: number;
  lon: number;
}

export interface WeatherResponse {
  weight: number;
  conditions: {
    sunny: boolean;
    rainChance: number;
    tempMin: number;
    tempMax: number;
  };
}

export interface OpenMeteoResponse {
  current_weather: {
    temperature: number;
    weathercode: number;
    cloudcover: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    weathercode: number[];
  };
}

