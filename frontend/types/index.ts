export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface WeatherData {
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  temperature: number;
  icon: string;
}

export interface BookingData {
  productId: string;
  selectedDate: Date;
  customerInfo: {
    name: string;
    email: string;
  };
}