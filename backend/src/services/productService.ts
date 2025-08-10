import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Busca todos os produtos do banco de dados, incluindo suas configurações.
 * @returns {Promise<Array>} Uma promessa que resolve para um array de produtos.
 */
export const getAllProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
        product_configs: true,
      },
    });

    return products;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw new Error('Falha ao buscar produtos.');
  } finally {
    // Garante que a conexão com o banco de dados seja fechada.
    await prisma.$disconnect();
  }
};
