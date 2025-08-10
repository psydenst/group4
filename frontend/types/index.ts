export interface IProductConfig {
  minPrice: number;
  maxPrice: number;
  basePrice: number;
  priceToday: number;
  climaInfluence: number;
  category: String;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  img_link: string;
  latitude: DoubleRange;
  longitude: DoubleRange;
  personPrice: number;
  productConfig: IProductConfig;
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