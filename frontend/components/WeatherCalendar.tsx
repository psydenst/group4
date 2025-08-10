'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';

import { WeatherData } from '@/types';
import { Cloud, CloudRain, Sun, CloudSnow, Zap, X } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';

// Definindo o tipo Value manualmente para evitar o erro de importação da biblioteca.
type CalendarValue = Date | Date[] | null;

interface WeatherCalendarProps {
  productId: string;
  productName: string;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: Zap,
  snowy: CloudSnow,
};

// Mock weather data generator
const generateWeatherData = (): WeatherData[] => {
  const weatherConditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy'];
  const data: WeatherData[] = [];
  
  for (let i = 0; i < 365; i++) {
    const date = addDays(new Date(), i);
    const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      condition,
      temperature: Math.floor(Math.random() * 30) + 10,
      icon: condition,
    });
  }
  
  return data;
};

const getProductPrice = (productId: string): number =>  {
  if (productId == '1')
  {
    return 10;
  }
  return 0;
}

export default function WeatherCalendar({ productId, productName, onClose, onDateSelect }: WeatherCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);

  useEffect(() => {
    setWeatherData(generateWeatherData());
  }, []);

  const getWeatherForDate = (date: Date): WeatherData | undefined => {
    return weatherData.find(weather => 
      isSameDay(new Date(weather.date), date)
    );
  };

  const tileContent = ({ date, view}: { date: Date; view: string}) => {
    if (view === 'month') {
      const weather = getWeatherForDate(date);
      if (weather) {
        const IconComponent = weatherIcons[weather.condition];
        return (
          <div className="weather-icon">
            <IconComponent className="w-4 h-4 mx-auto text-white/80" />
            <div className="text-xs text-white/60 mt-1">
              {weather.temperature}°
            </div>
          </div>
        );
      }
    }
    return null;
  };

  // A função onChange da biblioteca Calendar espera um valor do tipo "Value" e um evento.
  // Ajustamos a assinatura da função para usar o tipo Value que definimos.
  const handleDateChange = (value: CalendarValue | CalendarValue[], event: React.MouseEvent<HTMLButtonElement>) => {
    if (value && !Array.isArray(value)) {
      setSelectedDate(value);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedDate) {
      onDateSelect(selectedDate);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#132743] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Select Your Date</h2>
            <p className="text-white/70">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileContent={tileContent}
            minDate={new Date()}
            maxDate={addDays(new Date(), 365)}
            className="w-full"
            selectRange={false}
          />
        </div>

        {selectedDate && (
          <div className="bg-white/10 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Selected Date</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  {format(selectedDate, 'EEEE, MMMM do, yyyy')}
                </p>
                {(() => {
                  const weather = getWeatherForDate(selectedDate);
                  if (weather) {
                    const IconComponent = weatherIcons[weather.condition];
                    return (
                      <div className="flex items-center gap-2 mt-1 text-white/80">
                        <IconComponent className="w-4 h-4" />
                        <span className="capitalize">{weather.condition}</span>
                        <span>• {weather.temperature}°C</span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={!selectedDate}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
