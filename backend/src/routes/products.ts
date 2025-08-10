import { FastifyPluginAsync } from 'fastify';
import { getAllProducts } from '../services/productService';

const productsRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/getAll', {

  }, async (request, reply) => {
    return await getAllProducts();
  });
};

export default productsRoutes;
