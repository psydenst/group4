'use client';

import { useState } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import WeatherCalendar from '@/components/WeatherCalendar';
import Header from '@/components/Header';
import { Search, Filter, MapPin } from 'lucide-react';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Mountain Adventure Hiking',
    description: 'Experience breathtaking views and challenging trails in the Rocky Mountains. Perfect for adventure seekers looking for an unforgettable outdoor experience.',
    price: 149,
    image: 'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Adventure Sports',
  },
  {
    id: '2',
    name: 'Sunset Sailing Experience',
    description: 'Sail into the golden hour with our premium sunset cruise. Enjoy champagne and gourmet snacks while watching the sun dip below the horizon.',
    price: 89,
    image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Water Sports',
  },
  {
    id: '3',
    name: 'Wine Tasting Tour',
    description: 'Discover the finest local wines with our expert sommelier guide. Visit three premium wineries and learn about the art of winemaking.',
    price: 125,
    image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Food & Drink',
  },
  {
    id: '4',
    name: 'Photography Workshop',
    description: 'Master the art of landscape photography with professional guidance. Capture stunning shots in the most photogenic locations.',
    price: 199,
    image: 'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Creative Arts',
  },
  {
    id: '5',
    name: 'Spa & Wellness Retreat',
    description: 'Rejuvenate your mind and body with our luxury spa treatments. Includes massage, facial, and access to thermal pools.',
    price: 299,
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Wellness',
  },
  {
    id: '6',
    name: 'Culinary Masterclass',
    description: 'Learn to cook like a professional chef with hands-on instruction. Create a three-course meal using fresh, local ingredients.',
    price: 175,
    image: 'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Food & Drink',
  },
];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(mockProducts.map(p => p.category)))];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookNow = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleDateSelect = (date: Date) => {
    console.log('Booking confirmed for:', selectedProduct?.name, 'on', date);
    // Here you would typically send the booking data to your backend
    alert(`Booking confirmed for ${selectedProduct?.name} on ${date.toDateString()}!`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Book Your Next
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent block">
              Adventure
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Discover amazing experiences with weather-aware booking. Choose the perfect day for your adventure.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="px-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search experiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition-colors appearance-none cursor-pointer"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-[#132743] text-white">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <MapPin className="w-6 h-6 text-blue-400" />
            <h2 className="text-3xl font-bold text-white">
              Available Experiences ({filteredProducts.length})
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBookNow={handleBookNow}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">No experiences found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Weather Calendar Modal */}
      {selectedProduct && (
        <WeatherCalendar
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          onClose={() => setSelectedProduct(null)}
          onDateSelect={handleDateSelect}
        />
      )}
    </div>
  );
}