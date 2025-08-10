import { PrismaClient } from '@prisma/client';
import { IProduct } from '../types/products';
const prisma = new PrismaClient();

/**
 * Busca todos os produtos do banco de dados, incluindo suas configurações.
 * @returns {Promise<Array>} Uma promessa que resolve para um array de produtos.
 */
export const getAllProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
        productConfig: true,
      },
    });

    return products;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw new Error('Falha ao buscar produtos.');
  } finally {
    await prisma.$disconnect();
  }
};

export const getOneProduct = async (id: number) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: id,
      },
      select: {
        description: true,
        id: true,
        img_link: true,
        latitude: true,
        longitude: true,
        name: true,
        productConfig: true,
        personPrice: true,
      },
    });
    return product;
  }catch  (err: any) {
    console.error('Error fetching product:', err.message);
  }
};
