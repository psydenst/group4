import fastify from 'fastify';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weather';
import productsRoutes from './routes/products';
import cors from '@fastify/cors'; // <-- Importe o plugin cors

dotenv.config();

const server = fastify({ logger: true });

// Registre o plugin CORS antes das suas rotas
server.register(cors, {
  origin: '*', // Permite todas as origens, ou você pode especificar: 'http://localhost:3000'
  methods: ['GET', 'POST', 'PUT'],
});

// Rota básica
server.get('/', async () => ({ status: 'ok' }));

// Registrar clima
server.register(weatherRoutes, { prefix: '/weather' });

// Registrar produtos
server.register(productsRoutes, { prefix: '/products' });

// Iniciar
server.listen({ port: 8080, host: '0.0.0.0' }, (err) => {
  if (err) throw err;
  console.log('🌤️ Servidor rodando na porta 8080');
});