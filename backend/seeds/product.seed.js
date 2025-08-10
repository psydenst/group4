import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const mockProducts = [
  {
    name: 'Trampolin Jumping Rio',
    description: 'Welcome to Trampolin Jumping Rio, where the fun never stops! Step into our jumping hall and experience the thrill of bouncing on trampolines like never before. Get ready to jump, laugh, and make unforgettable memories with us!',
    price: 149,
    latitude: -22.9035, // Exemplo de coordenada para Nova York, EUA
    longitude: -43.2096,
  },
  {
    name: 'Beach Tennis Rio',
    description: 'Welcome to Beach Tennis Rio! 🏖️🎾 Whether you\'re a beach tennis enthusiast or an owner looking to improve your game, this is the perfect spot for you. Come and experience the thrill of beach tennis in Rio!',
    price: 89,
    latitude: -22.9035, // Exemplo de coordenada para Los Angeles, EUA
    longitude: -43.2096,
  },
  {
    name: 'Santa Teresa Rooftop',
    description: 'Welcome to Santa Teresa Rooftop! Get ready to experience unforgettable music events with a breathtaking view. Join us for a night of melodies and magic at our rooftop venue.',
    price: 125,
    latitude: -22.9035, // Exemplo de coordenada para Nova York, EUA
    longitude: -43.2096,
  },
  {
    name: 'Rio Football',
    description: '',
    price: 199,
    latitude: -22.9035, // Exemplo de coordenada para Nova York, EUA
    longitude: -43.2096,
  },
  {
    name: 'Sao Paulo Tennis',
    description: 'Welcome to Sao Paulo Tennis, the ultimate destination for tennis enthusiasts! Our shop offers top-notch tennis courts for you to practice and improve your game. Join us for a fun and energizing tennis experience!',
    price: 299,
    latitude: -23.5489, // Exemplo de coordenada para Las Vegas, EUA
    longitude: -46.6388,
  },
  {
    name: 'Sao Paulo Afterwork Drinks',
    description: 'Looking for a vibrant spot in Sao Paulo to unwind after work? Look no further than Sao Paulo Afterwork Drinks! This place is perfect for music events where you can relax, socialize, and enjoy great tunes. Join us for a memorable night out!',
    price: 175,
    latitude: -23.5489, // Exemplo de coordenada para Las Vegas, EUA
    longitude: -46.6388,
  },
  {
    name: 'Padel Tennis Rio',
    description: '',
    price: 175,
    latitude: -22.9035, // Exemplo de coordenada para Chicago, EUA
    longitude: -43.2096,
  },
];

async function main() {
  try {
    console.log('Iniciando a inserção dos dados de mock...');

    const results = await Promise.all(
      mockProducts.map(async (productData) => {
        const newProduct = await prisma.product.create({
          data: {
            name: productData.name,
            description: productData.description,
            latitude: productData.latitude,
            longitude: productData.longitude,
            product_configs: {
              create: {
                minPrice: productData.price,
                maxPrice: productData.price + 50,
                climaInfluence: 5,
              },
            },
          },
        });
        return newProduct;
      })
    );

    console.log('\nDados inseridos com sucesso:');
    console.log(results);

  } catch (error) {
    console.error('Ocorreu um erro durante a execução do script:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
