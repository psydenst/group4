'use client';

import { Product } from '@/types';
import { Calendar, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleBookNow = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 border border-white/20 hover:border-white/30 group">
      <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-white text-sm font-medium">4.8</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white/70">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{product.category}</span>
        </div>
        
        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-white/80 text-sm leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-4">
          <div className="text-white">
            <span className="text-2xl font-bold">${product.price}</span>
            <span className="text-white/60 text-sm ml-1">per person</span>
          </div>
          
          <button
            onClick={handleBookNow}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}