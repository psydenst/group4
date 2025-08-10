import axios from 'axios';
import {WeatherRangeRequest, DailyWeatherData, WeatherRangeResponse, OpenMeteoRangeResponse } from '../types/weatherRange';
import { WeatherRequest, WeatherResponse, OpenMeteoResponse } from '../types/weather';



export async function getWeatherRange(req: WeatherRangeRequest): Promise<WeatherRangeResponse> {
  const svc = new WeatherRangeService();
  return svc.getWeatherRange(req);
}


export class WeatherRangeService {
  private baseUrl = 'https://api.open-meteo.com/v1/forecast';

  // Rota original - 1 dia
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

  // Nova rota - Range de dias (1-16)
  async getWeatherRange(req: WeatherRangeRequest): Promise<WeatherRangeResponse> {
    try {
      // Validar limite de dias
      const days = Math.min(Math.max(req.days, 1), 16);
      
      const data = await this.fetchWeatherRangeData(req, days);
      
      const dailyData: DailyWeatherData[] = [];
      let totalWeight = 0;
      
      // Processar cada dia
      for (let i = 0; i < data.daily.time.length; i++) {
        const weatherCode = data.daily.weathercode[i];
        const sunny = this.isSunny(weatherCode);
        const rainChance = data.daily.precipitation_probability_max[i] || 0;
        const tempMin = data.daily.temperature_2m_min[i];
        const tempMax = data.daily.temperature_2m_max[i];
        
        // Calcular peso do dia
        let weight = 1.0;
        if (sunny) weight += 0.5;
        if (rainChance < 30) weight += 0.3;
        if (tempMin >= 18 && tempMax <= 28) {
          weight += 0.2;
        } else if (tempMin < 10 || tempMax > 35) {
          weight -= 0.3;
        }
        
        weight = Math.round(weight * 100) / 100;
        totalWeight += weight;
        
        dailyData.push({
          date: data.daily.time[i],
          weight,
          sunny,
          rainChance,
          tempMin: Math.round(tempMin * 10) / 10,
          tempMax: Math.round(tempMax * 10) / 10,
          weatherCode
        });
      }
      
      return {
        days: dailyData,
        averageWeight: Math.round((totalWeight / dailyData.length) * 100) / 100,
        totalDays: dailyData.length
      };
      
    } catch (error) {
      // Fallback para dados simulados
      return this.getMockWeatherRange(req.days);
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

  private async fetchWeatherRangeData(req: WeatherRangeRequest, days: number): Promise<OpenMeteoRangeResponse> {
    const response = await axios.get<OpenMeteoRangeResponse>(this.baseUrl, {
      params: {
        latitude: req.lat,
        longitude: req.lon,
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode',
        timezone: 'auto',
        forecast_days: days
      },
      timeout: 10000
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

  private getMockWeatherRange(days: number): WeatherRangeResponse {
    const dailyData: DailyWeatherData[] = [];
    let totalWeight = 0;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const sunny = Math.random() > 0.5;
      const rainChance = Math.floor(Math.random() * 100);
      const tempMin = Math.floor(Math.random() * 20 + 10);
      const tempMax = tempMin + Math.floor(Math.random() * 15 + 5);
      const weatherCode = sunny ? (Math.random() > 0.5 ? 0 : 1) : Math.floor(Math.random() * 10 + 10);
      
      let weight = 1.0;
      if (sunny) weight += 0.5;
      if (rainChance < 30) weight += 0.3;
      if (tempMin >= 18 && tempMax <= 28) weight += 0.2;
      else if (tempMin < 10 || tempMax > 35) weight -= 0.3;
      
      weight = Math.round(weight * 100) / 100;
      totalWeight += weight;
      
      dailyData.push({
        date: date.toISOString().split('T')[0],
        weight,
        sunny,
        rainChance,
        tempMin,
        tempMax,
        weatherCode
      });
    }
    
    return {
      days: dailyData,
      averageWeight: Math.round((totalWeight / days) * 100) / 100,
      totalDays: days
    };
  }
}
