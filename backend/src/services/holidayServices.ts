// services/holidayService.ts
import axios from 'axios';
import {Holiday, HolidayInfo} from '../types/seasonality';

export interface NagerDatePublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}


export class HolidayService {
  // Usando Nager.Date (gratuito, sem API key)
  private readonly baseUrl = 'https://date.nager.at/api/v3';

  async getHolidays(countryCode: string, year: number): Promise<Holiday[]> {
    try {
      const response = await axios.get<NagerDatePublicHoliday[]>(`${this.baseUrl}/PublicHolidays/${year}/${countryCode}`, {
        timeout: 5000
      });
      
      return response.data.map((holiday: any) => ({
        name: holiday.name,
        date: holiday.date,
        type: holiday.type || 'public',
        primary_type: holiday.type || 'Public',
        locations: holiday.counties?.join(', ') || countryCode,
        states: holiday.counties?.join(', ')
      }));

    } catch (error) {
      // Fallback com feriados universais
      return this.getUniversalHolidays(year);
    }
  }

  async isHoliday(countryCode: string, date: string): Promise<HolidayInfo> {
    const year = new Date(date).getFullYear();
    const holidays = await this.getHolidays(countryCode, year);
    
    const holiday = holidays.find(h => h.date === date);
    
    if (holiday) {
      // Feriados públicos = peso máximo
      const weight = holiday.type === 'public' ? 1.5 : 1.3;
      
      return {
        isHoliday: true,
        holidayName: holiday.name,
        holidayType: holiday.type,
        weight
      };
    }

    return {
      isHoliday: false,
      weight: 1.0
    };
  }

  private getUniversalHolidays(year: number): Holiday[] {
    return [
      {
        name: 'New Year\'s Day',
        date: `${year}-01-01`,
        type: 'public',
        primary_type: 'Public',
        locations: 'Universal',
      },
      {
        name: 'Christmas Day',
        date: `${year}-12-25`,
        type: 'public', 
        primary_type: 'Public',
        locations: 'Universal',
      },
      {
        name: 'New Year\'s Eve',
        date: `${year}-12-31`,
        type: 'observance',
        primary_type: 'Observance',
        locations: 'Universal',
      }
    ];
  }
}
