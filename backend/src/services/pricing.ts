// services/pricingService.ts
import axios from 'axios';

interface WeightResponse {
  weight: number;
}

export class PricingService {
  async getWeight(lat: number, lon: number): Promise<number> {
    try {
      // Pega a data atual no formato YYYY-MM-DD
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Chamadas paralelas para as duas APIs
      const [seasonalityResponse, weatherResponse] = await Promise.all([
        axios.get<WeightResponse>(`http://localhost:8080/seasonality/weight?lat=${lat}&lon=${lon}&date=${currentDate}`),
        axios.get<WeightResponse>(`http://localhost:8080/weather/weight?lat=${lat}&lon=${lon}`)
      ]);

      // Multiplica os dois pesos
      const result = seasonalityResponse.data.weight * weatherResponse.data.weight;
      
      // Arredonda para 3 casas decimais
      return Math.round(result * 1000) / 1000;
    } catch (error) {
      throw new Error('Erro ao calcular peso de pricing');
    }
  }
}



