import axios from 'axios';
import { WeatherRequest, WeatherResponse, OpenMeteoResponse } from '../types/weather';

export class WeatherService {
  private baseUrl = 'https://api.open-meteo.com/v1/forecast';

  async getWeight(req: WeatherRequest): Promise<WeatherResponse> {
    try {
      const data = await this.fetchWeatherData(req);
      
      // Analisar condições
      const sunny = this.isSunny(data.current_weather.weathercode);
      const rainChance = data.daily.precipitation_probability_max[0] || 0;
      const tempMin = data.daily.temperature_2m_min[0];
      const tempMax = data.daily.temperature_2m_max[0];
      
      // Calcular peso
      let weight = 1.0;
      
      // Sol = +0.5
      if (sunny) weight += 0.5;
      
      // Baixa chance de chuva = +0.3
      if (rainChance < 30) weight += 0.3;
      
      // Temperatura ideal (18-28°C) = +0.2
      if (tempMin >= 18 && tempMax <= 28) {
        weight += 0.2;
      } else if (tempMin < 10 || tempMax > 35) {
        weight -= 0.3; // Temperatura extrema = -0.3
      }
      
      return {
        weight: Math.round(weight * 100) / 100,
        conditions: { sunny, rainChance, tempMin, tempMax }
      };
    } catch (error) {
      // Fallback para dados simulados em caso de erro
      return this.getMockWeight();
    }
  }

  private async fetchWeatherData(req: WeatherRequest): Promise<OpenMeteoResponse> {
    const response = await axios.get<OpenMeteoResponse>(this.baseUrl, {
      params: {
        latitude: req.lat,
        longitude: req.lon,
        current_weather: true,
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode',
        timezone: 'auto',
        forecast_days: 1
      },
      timeout: 5000
    });

    return response.data;
  }

  // Weather codes da Open-Meteo: https://open-meteo.com/en/docs
  private isSunny(code: number): boolean {
    // 0 = Clear sky, 1 = Mainly clear
    return code === 0 || code === 1;
  }

  private getMockWeight(): WeatherResponse {
    const sunny = Math.random() > 0.5;
    const rainChance = Math.floor(Math.random() * 100);
    const tempMin = Math.floor(Math.random() * 20 + 10);
    const tempMax = tempMin + Math.floor(Math.random() * 15 + 5);
    
    let weight = 1.0;
    if (sunny) weight += 0.5;
    if (rainChance < 30) weight += 0.3;
    if (tempMin >= 18 && tempMax <= 28) weight += 0.2;
    else if (tempMin < 10 || tempMax > 35) weight -= 0.3;
    
    return {
      weight: Math.round(weight * 100) / 100,
      conditions: { sunny, rainChance, tempMin, tempMax }
    };
  }
}

