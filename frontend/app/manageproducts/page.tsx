'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, MapPin, Shield, Award, Users, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const productsList = [
  'Trampolin Jumping Rio',
  'Beach Tennis Rio',
  'Santa Teresa Rooftop',
  'Rio Football',
  'Sao Paulo Tennis',
  'Padel Tennis Rio',
  'Sao Paulo Afterwork Drinks',
];

const defaultFactors = [
  { key: 'basePrice', label: 'Base Price', defaultValue: 100 },
  { key: 'weather', label: 'Weather Multiplier', defaultValue: 1 },
  { key: 'bookingDistance', label: 'Booking Distance Multiplier', defaultValue: 1 },
  { key: 'season', label: 'Season Multiplier', defaultValue: 1 },
];

const mockProducts = [
  {
    id: 'Trampolin Jumping Rio',
    name: 'Trampolin Jumping Rio',
    description: 'Jump and bounce with excitement at our trampolin park!',
    price: 100,
    image:
      'https://trampolin-jumping-rio.staging.ticketbro.com/_next/image?url=https%3A%2F%2Fdrw21st1r555p.cloudfront.net%2Foptimized%2FDEFAULT%2F7c00cd54-ebf1-4003-8762-c7f86f22ab0e-1x-optimized&w=384&q=75',
    category: 'Adventure Sports',
  },
  {
    id: 'Beach Tennis Rio',
    name: 'Beach Tennis Rio',
    description: 'Play tennis by the beach with sun and sand.',
    price: 120,
    image:
      'https://beach-tennis-rio.staging.ticketbro.com/_next/image?url=https%3A%2F%2Fdrw21st1r555p.cloudfront.net%2Foptimized%2FDEFAULT%2F02ff7d65-572a-4708-a32d-80dae08c9cfa-2x-optimized&w=256&q=75',
    category: 'Water Sports',
  },
  {
    id: 'Santa Teresa Rooftop',
    name: 'Santa Teresa Rooftop',
    description: 'Enjoy amazing rooftop views and cocktails.',
    price: 90,
    image:
      'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Food & Drink',
  },
];

export default function ManageProductPage() {
    const router = useRouter();
    const params = useParams();
    const productIdFromUrl = params.id as string | undefined;

    const [selectedProduct, setSelectedProduct] = useState<string>(
    productIdFromUrl && productsList.includes(productIdFromUrl)
      ? productIdFromUrl
      : productsList[0]
  );

  const [pricingFactors, setPricingFactors] = useState(() => {
    const init: Record<string, Record<string, number>> = {};
    productsList.forEach((product) => {
      init[product] = {};
      defaultFactors.forEach((factor) => {
        init[product][factor.key] = factor.defaultValue;
      });
    });
    return init;
  });

  function handleFactorChange(key: string, value: string) {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setPricingFactors((prev) => ({
      ...prev,
      [selectedProduct]: {
        ...prev[selectedProduct],
        [key]: numValue,
      },
    }));
  }

  const productDetails = mockProducts.find((p) => p.id === selectedProduct);

  function calculateFinalPrice() {
  const factors = pricingFactors[selectedProduct];
  if (!factors) return 0;
  const basePrice = factors.basePrice || 0;
  const multiplier = Object.entries(factors).reduce((acc, [key, val]) => {
    if (key === 'basePrice') return acc;
    return acc * val;
  }, 1);
  return basePrice * multiplier;
}


  return (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
    {/* Botão de voltar */}
    <div className="max-w-7xl w-full mb-6">
      <button
        onClick={() => router.push('/admin')}
        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Admin Panel
      </button>
    </div>

    {/* Grid principal com 2 colunas */}
    <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Coluna esquerda: produto com imagem e detalhes */}
      <div className="space-y-6 text-white">
        {productDetails ? (
          <>
            <div className="relative h-96 rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-md">
              <Image
                src={productDetails.image}
                alt={productDetails.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white text-sm font-medium">4.8</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-2 text-white/70 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{productDetails.category}</span>
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">{productDetails.name}</h1>

              <p className="text-white/80 text-lg leading-relaxed mb-6">{productDetails.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 text-white/80">
                  <Shield className="w-5 h-5 text-white-400" />
                  <span className="text-sm">Safety Certified</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Award className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">Expert Guides</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-sm">Small Groups</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-white text-center text-xl">Produto não encontrado.</div>
        )}
      </div>

      {/* Coluna direita: editor de fatores */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-white flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Manage Pricing Factors</h2>

        {/* Select produto */}
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full px-4 py-3 mb-8 bg-white text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all cursor-pointer"
        >
          {productsList.map((prod) => (
            <option key={prod} value={prod}>
              {prod}
            </option>
          ))}
        </select>

        {/* Inputs dos fatores em containers separados */}
        <div className="flex flex-col gap-6 flex-grow">
          {defaultFactors.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between bg-white/20 rounded-lg p-4 shadow-md"
            >
              <label htmlFor={key} className="font-semibold text-lg text-white">
                {label}:
              </label>
              <input
                id={key}
                type="number"
                step="0.01"
                min="0"
                value={pricingFactors[selectedProduct][key]}
                onChange={(e) => handleFactorChange(key, e.target.value)}
                className="w-32 rounded-md px-3 py-1 text-black"
              />
            </div>
          ))}
        </div>

        {/* Fórmula e preço */}
        <div className="mt-8 text-center text-xl font-bold">
          <p className="text-white-400">
            Final Price: $ {calculateFinalPrice().toFixed(2)}
          </p>
        </div>

        {/* Botão salvar (mock) */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => alert(`Simulando salvar fórmula para ${selectedProduct}`)}
            className="bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 text-white px-8 py-3 rounded-xl font-semibold transition-shadow shadow-md"
          >
            Save Formula
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
