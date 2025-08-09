import Fastify from 'fastify';

const app = Fastify({ logger: true });
const port = 8080;

const start = async () => {
  try {
    await app.listen({ host: '0.0.0.0', port });
    console.log('backend available at 8080');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

