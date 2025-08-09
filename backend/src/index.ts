import fastify from 'fastify';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weather';

dotenv.config();

const server = fastify({ logger: true });

// Rota básica
server.get('/', async () => ({ status: 'ok' }));

// Registrar clima
server.register(weatherRoutes, { prefix: '/weather' });

// Iniciar
server.listen({ port: 8080, host: '0.0.0.0' }, (err) => {
  if (err) throw err;
  console.log('🌤️ Servidor rodando na porta 8080');
});

