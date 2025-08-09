import { FastifyPluginAsync } from 'fastify';
import { WeatherService } from '../services/weatherService';


// get's latitude and longitude from query parameters
// and returns the weight of the weather at that location
// Example: GET /weight?lat=40.7128&lon=-74.006
const weatherRoutes: FastifyPluginAsync = async (fastify) => {
  const weather = new WeatherService();

  fastify.get('/weight', {
    schema: {
      querystring: {
        type: 'object',
        required: ['lat', 'lon'],
        properties: {
          lat: { type: 'number', minimum: -90, maximum: 90 },
          lon: { type: 'number', minimum: -180, maximum: 180 }
        }
      }
    }
  }, async (request, reply) => {
    const { lat, lon } = request.query as { lat: number; lon: number };
    return await weather.getWeight({ lat, lon });
  });
};

export default weatherRoutes;
