import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const mockProducts = [
  {
    name: 'Trampolin Jumping Rio',
    description: 'Welcome to Trampolin Jumping Rio, where the fun never stops! Step into our jumping hall and experience the thrill of bouncing on trampolines like never before. Get ready to jump, laugh, and make unforgettable memories with us!',
    img_link: 'https://trampolin-jumping-rio.staging.ticketbro.com/_next/image?url=https%3A%2F%2Fdrw21st1r555p.cloudfront.net%2Foptimized%2FSHOP_LOGO%2F33576c92-96d8-41be-ac18-83b7d0950318-2x-optimized&w=128&q=75',
    price: 149,
    latitude: -22.9035, // Exemplo de coordenada para Nova York, EUA
    longitude: -43.2096,
    category: 'in door',
    personPrice: 40
  },
  {
    name: 'Beach Tennis Rio',
    description: 'Welcome to Beach Tennis Rio! 🏖️🎾 Whether you\'re a beach tennis enthusiast or an owner looking to improve your game, this is the perfect spot for you. Come and experience the thrill of beach tennis in Rio!',
    img_link: 'https://beach-tennis-rio.staging.ticketbro.com/_next/image?url=https%3A%2F%2Fdrw21st1r555p.cloudfront.net%2Foptimized%2FDEFAULT%2F02ff7d65-572a-4708-a32d-80dae08c9cfa-1x-optimized&w=384&q=75',
    price: 89,
    latitude: -22.9035, // Exemplo de coordenada para Los Angeles, EUA
    longitude: -43.2096,
    category: 'out door',
    personPrice: 40
  },
  {
    name: 'Santa Teresa Rooftop',
    description: 'Welcome to Santa Teresa Rooftop! Get ready to experience unforgettable music events with a breathtaking view. Join us for a night of melodies and magic at our rooftop venue.',
    img_link: 'https://santa-teresa-rooftop.staging.ticketbro.com/_next/image?url=https%3A%2F%2Fdrw21st1r555p.cloudfront.net%2Foptimized%2FDEFAULT%2F29d348a5-dc00-41e2-9195-5316f878220f-1x-optimized&w=384&q=75',
    price: 125,
    latitude: -22.9035, // Exemplo de coordenada para Nova York, EUA
    longitude: -43.2096,
    category: 'in door',
    personPrice: 40
  },
  {
    name: 'Rio Football',
    description: '',
    img_link: 'https://rio-football.staging.ticketbro.com/_next/image?url=https%3A%2F%2Fdrw21st1r555p.cloudfront.net%2Foptimized%2FDEFAULT%2F1de7c432-d3bf-4a26-8184-6b2997645d03-1x-optimized&w=384&q=75',
    price: 199,
    latitude: -22.9035, // Exemplo de coordenada para Nova York, EUA
    longitude: -43.2096,
    category: 'out door',
    personPrice: 40
  },
  {
    name: 'Sao Paulo Tennis',
    description: 'Welcome to Sao Paulo Tennis, the ultimate destination for tennis enthusiasts! Our shop offers top-notch tennis courts for you to practice and improve your game. Join us for a fun and energizing tennis experience!',
    img_link: 'https://sao-paulo-tennis.staging.ticketbro.com/_next/image?url=https%3A%2F%2Fdrw21st1r555p.cloudfront.net%2Foptimized%2FDEFAULT%2F8b99ea3d-1941-4e9e-93de-92d44d54f94c-1x-optimized&w=384&q=75',
    price: 299,
    latitude: -23.5489, // Exemplo de coordenada para Las Vegas, EUA
    longitude: -46.6388,
    category: 'out door',
    personPrice: 40
  },
  {
    name: 'Sao Paulo Afterwork Drinks',
    description: 'Looking for a vibrant spot in Sao Paulo to unwind after work? Look no further than Sao Paulo Afterwork Drinks! This place is perfect for music events where you can relax, socialize, and enjoy great tunes. Join us for a memorable night out!',
    img_link: 'https://sao-paulo-afterwork.staging.ticketbro.com/_next/image?url=https%3A%2F%2Fdrw21st1r555p.cloudfront.net%2Foptimized%2FDEFAULT%2Fe13d848c-194b-42c1-ac59-10ca26910f24-1x-optimized&w=384&q=75',
    price: 175,
    latitude: -23.5489, // Exemplo de coordenada para Las Vegas, EUA
    longitude: -46.6388,
    category: 'in door',
    personPrice: 40
  },
  {
    name: 'Padel Tennis Rio',
    description: '',
    img_link: 'https://padel-tennis-rio.staging.ticketbro.com/_next/image?url=https%3A%2F%2Fdrw21st1r555p.cloudfront.net%2Foptimized%2FDEFAULT%2F2f5826c1-5d5f-4e1d-b019-5b9835d9b45d-1x-optimized&w=384&q=75',
    price: 175,
    latitude: -22.9035, // Exemplo de coordenada para Chicago, EUA
    longitude: -43.2096,
    category: 'in door',
    personPrice: 40
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
            img_link: productData.img_link,
            latitude: productData.latitude,
            longitude: productData.longitude,
            personPrice: productData.personPrice, 
            productConfig: {
              create: {
                minPrice: productData.price - 25,
                basePrice: productData.price,
                maxPrice: productData.price + 50,
                climaInfluence: 5,
                category: productData.category,
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
