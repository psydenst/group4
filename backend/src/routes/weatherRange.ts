// routes/weatherRange.ts
import { FastifyPluginAsync } from 'fastify';
import { WeatherRangeService } from '../services/weatherRangeService';
import { WeatherRangeRequest, WeatherRangeResponse } from '../types/weatherRange';
// Linha a ser removida: import {getWeatherRange} from '../services/weatherRangeService';

const weatherRangeRoutes: FastifyPluginAsync = async (fastify) => {
  const weather = new WeatherRangeService();

  fastify.get('/', {
    schema: {
      querystring: {
        type: 'object',
        required: ['lat', 'lon'],
        properties: {
          lat:  { type: 'number', minimum: -90,  maximum: 90 },
          lon:  { type: 'number', minimum: -180, maximum: 180 },
          days: { type: 'integer', minimum: 1,    maximum: 16, default: 7 }
        }
      }
    }
  }, async (request, reply) => {
    const { lat, lon, days } = request.query as { lat: number; lon: number; days?: number };
    const payload: WeatherRangeRequest = { lat, lon, days: days ?? 7 };

    // A chamada correta é feita na instância 'weather' que você criou.
    const result: WeatherRangeResponse = await weather.getWeatherRange(payload);
    return result;
  });
};

export default weatherRangeRoutes;



