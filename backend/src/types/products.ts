import { Decimal } from "@prisma/client/runtime/library";

export interface ProductRequest {
    
}

export interface IProductConfig {
  minPrice: number;
  maxPrice: number;
  basePrice: number;
  priceToday: number;
  climaInfluence: number;
  category: String;
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  img_link: string;
  latitude: Decimal;
  longitude: Decimal;
  productConfig: IProductConfig;
}