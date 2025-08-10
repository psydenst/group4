import { FastifyPluginAsync } from 'fastify';
import { SeasonalityService } from '../services/seasonalityService';

interface SeasonalityInfoQuery {
  lat: number;
}

interface SeasonalityWeightQuery {
  lat: number;
  lon: number;
  date?: string;
}

interface SeasonCheckQuery {
  lat: number;
  date: string;
}

const seasonalityRoutes: FastifyPluginAsync = async (fastify) => {
  const seasonalityService = new SeasonalityService();

  // GET /seasonality/info?lat=-23.5505 (rota original)
  fastify.get('/info', {
    schema: {
      querystring: {
        type: 'object',
        required: ['lat'],
        properties: {
          lat: { type: 'number', minimum: -90, maximum: 90 }
        }
      }
    }
  }, async (request, reply) => {
    const { lat } = request.query as SeasonalityInfoQuery;
    return seasonalityService.getSeasonality({ lat });
  });

	fastify.get('/weight', {
		schema: {
			querystring: {
				type: 'object',
				required: ['lat', 'lon'],
				properties: {
					lat: { type: 'number', minimum: -90, maximum: 90 },
					lon: { type: 'number', minimum: -180, maximum: 180 },
					date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' }
				}
			}
		}
	}, async (request, reply) => {
		const { lat, lon, date } = request.query as SeasonalityWeightQuery;
		const { finalWeight } = await seasonalityService.getSeasonalityWeight({ lat, lon, date });
		return { weight: finalWeight };
	});

  // GET /seasonality/next-high?lat=-23.5505
  fastify.get('/next-high', {
    schema: {
      querystring: {
        type: 'object',
        required: ['lat'],
        properties: {
          lat: { type: 'number', minimum: -90, maximum: 90 }
        }
      }
    }
  }, async (request, reply) => {
    const { lat } = request.query as SeasonalityInfoQuery;
    const seasonality = seasonalityService.getSeasonality({ lat });
    const nextHigh = seasonality.highSeasons.find(season => 
      season.startDate > new Date().toISOString().split('T')[0]
    );
    
    if (!nextHigh) {
      return { message: 'Nenhuma alta temporada futura encontrada para este ano' };
    }
    
    return { nextHighSeason: nextHigh };
  });

  // GET /seasonality/check?lat=-23.5505&date=2025-12-25
  fastify.get('/check', {
    schema: {
      querystring: {
        type: 'object',
        required: ['lat', 'date'],
        properties: {
          lat: { type: 'number', minimum: -90, maximum: 90 },
          date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' }
        }
      }
    }
  }, async (request, reply) => {
    const { lat, date } = request.query as SeasonCheckQuery;
    const seasonality = seasonalityService.getSeasonality({ lat });
    const isHigh = seasonality.highSeasons.some(season => 
      date >= season.startDate && date <= season.endDate
    );
    
    return {
      date,
      latitude: lat,
      isHighSeason: isHigh,
      intensity: isHigh ? 'alta' : 'baixa'
    };
  });
};

export default seasonalityRoutes;
