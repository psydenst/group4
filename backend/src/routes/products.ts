import { FastifyPluginAsync } from 'fastify';
import { getAllProducts, getOneProduct } from '../services/productService';
import { IProduct } from '../types/products';

const productsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/getAll', {

  }, async (request, reply) => {
    return await getAllProducts();
  });


  fastify.get('/getOne', async (request, reply) => {
    try {
      const { id } = request.query as { id: string };

      if (!id) {
        return reply.status(400).send({ message: 'O parâmetro "id" é obrigatório na URL.' });
      }

      const product = await getOneProduct(parseInt(id, 10));

      if (!product) {
        return reply.status(404).send({ message: 'Produto não encontrado.' });
      }

      return product;
    } catch (error) {
      console.error('Erro ao buscar um produto:', error);
      reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
  });
};

export default productsRoutes;
