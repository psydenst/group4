// routes/pricingRoutes.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PricingService } from '../services/pricing';

interface WeightQuery {
  lat: string;
  lon: string;
}

async function pricingRoutes(fastify: FastifyInstance) {
  const pricingService = new PricingService();

  fastify.get<{
    Querystring: WeightQuery;
  }>('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          lat: { type: 'string' },
          lon: { type: 'string' }
        },
        required: ['lat', 'lon']
      }
    }
  }, async (request: FastifyRequest<{ Querystring: WeightQuery }>, reply: FastifyReply) => {
    try {
      const { lat, lon } = request.query;

      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      // Validação se são números válidos
      if (isNaN(latitude) || isNaN(longitude)) {
        return reply.send({ weight: 0 });
      }

      // Chama o serviço
      const weight = await pricingService.getWeight(latitude, longitude);

      reply.send({ weight });
    } catch (error) {
      reply.send({ weight: 0 });
    }
  });
}

export default pricingRoutes;


