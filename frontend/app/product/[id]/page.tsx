'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, WeatherData } from '@/types';
import { ArrowLeft, Calendar, Clock, MapPin, Star, Users, Shield, Award } from 'lucide-react';
import Image from 'next/image';
import WeatherCalendar from '@/components/WeatherCalendar';
import Header from '@/components/Header';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Mountain Adventure Hiking',
    description: 'Experience breathtaking views and challenging trails in the Rocky Mountains. Perfect for adventure seekers looking for an unforgettable outdoor experience.',
    price: 149,
    image: 'https://trampolin-jumping-rio.staging.ticketbro.com/_next/image?url=https%3A%2F%2Fdrw21st1r555p.cloudfront.net%2Foptimized%2FDEFAULT%2F7c00cd54-ebf1-4003-8762-c7f86f22ab0e-1x-optimized&w=384&q=75',
    category: 'Adventure Sports',
  },
  {
    id: '2',
    name: 'Sunset Sailing Experience',
    description: 'Sail into the golden hour with our premium sunset cruise. Enjoy champagne and gourmet snacks while watching the sun dip below the horizon.',
    price: 89,
    image: 'https://beach-tennis-rio.staging.ticketbro.com/_next/image?url=https%3A%2F%2Fdrw21st1r555p.cloudfront.net%2Foptimized%2FDEFAULT%2F02ff7d65-572a-4708-a32d-80dae08c9cfa-2x-optimized&w=256&q=75',
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

// Generate time slots with 30-minute intervals from 8:00 AM to 8:00 PM
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 8; // 8:00 AM
  const endHour = 20; // 8:00 PM
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === endHour && minute > 0) break; // Stop at 8:00 PM exactly
      
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
      
      // Mark some random slots as unavailable for demo purposes
      const isUnavailable = Math.random() < 0.15; // 15% chance of being unavailable
      
      slots.push({
        value: time24,
        label: time12,
        available: !isUnavailable
      });
    }
  }
  
  return slots;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [participants, setParticipants] = useState<number>(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [timeSlots] = useState(generateTimeSlots());

  useEffect(() => {
    const productId = params.id as string;
    const foundProduct = mockProducts.find(p => p.id === productId);
    setProduct(foundProduct || null);
  }, [params.id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    return product.price * participants;
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }

    const bookingData = {
      product: product.name,
      date: selectedDate.toDateString(),
      time: selectedTime,
      participants,
      total: calculateTotal(),
    };

    console.log('Booking Data:', bookingData);
    alert(`Booking confirmed!\n\nProduct: ${bookingData.product}\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nParticipants: ${bookingData.participants}\nTotal: $${bookingData.total}`);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Experiences
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Details */}
          <div className="space-y-6">
            {/* Product Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white text-sm font-medium">4.8</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-2 text-white/70 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{product.category}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
              
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 text-white/80">
                  <Shield className="w-5 h-5 text-green-400" />
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
          </div>

          {/* Right Column - Booking Form */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Book Your Experience</h2>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">Select Date</label>
                <button
                  onClick={() => setShowCalendar(true)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-left text-white hover:bg-white/15 transition-colors flex items-center gap-3"
                >
                  <Calendar className="w-5 h-5 text-blue-400" />
                  {selectedDate ? selectedDate.toDateString() : 'Choose a date'}
                </button>
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">Select Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#132743] text-white/60">
                      Choose a time
                    </option>
                    {timeSlots.map((slot) => (
                      <option
                        key={slot.value}
                        value={slot.value}
                        disabled={!slot.available}
                        className={`bg-[#132743] ${
                          slot.available ? 'text-white' : 'text-white/40'
                        }`}
                      >
                        {slot.label} {!slot.available ? '(Unavailable)' : ''}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">Number of Participants</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                    className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-white font-semibold text-lg min-w-[3rem] text-center">
                    {participants}
                  </span>
                  <button
                    onClick={() => setParticipants(Math.min(10, participants + 1))}
                    className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80">Price per person:</span>
                  <span className="text-white font-semibold">${product.price}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80">Participants:</span>
                  <span className="text-white font-semibold">{participants}</span>
                </div>
                <div className="border-t border-white/20 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Total:</span>
                    <span className="text-white font-bold text-2xl">${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100"
              >
                Complete Booking - ${calculateTotal()}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Calendar Modal */}
      {showCalendar && (
        <WeatherCalendar
          productId={product.id}
          productName={product.name}
          onClose={() => setShowCalendar(false)}
          onDateSelect={handleDateSelect}
        />
      )}
    </div>
  );
}