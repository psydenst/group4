// services/vacationServices.ts

import { VacationPeriod } from '../types/seasonality';

export class VacationService {
  getVacationPeriods(countryCode: string, date: string): VacationPeriod[] {
    const year = new Date(date).getFullYear();
    const periods: VacationPeriod[] = [];

    switch (countryCode) {
      case 'BR':
        periods.push(
          {
            name: 'Férias de Verão',
            startDate: `${year}-12-15`,
            endDate: `${year + 1}-02-15`,
            region: 'Nacional',
            weight: 1.4
          },
          {
            name: 'Férias de Julho',
            startDate: `${year}-07-01`,
            endDate: `${year}-07-31`,
            region: 'Nacional',
            weight: 1.3
          },
          {
            name: 'Carnaval',
            startDate: `${year}-02-10`,
            endDate: `${year}-02-15`,
            region: 'Nacional',
            weight: 1.5
          }
        );
        break;

      case 'US':
        periods.push(
          {
            name: 'Summer Break',
            startDate: `${year}-06-15`,
            endDate: `${year}-08-31`,
            region: 'Nacional',
            weight: 1.4
          },
          {
            name: 'Winter Holidays',
            startDate: `${year}-12-20`,
            endDate: `${year + 1}-01-05`,
            region: 'Nacional',
            weight: 1.5
          },
          {
            name: 'Spring Break',
            startDate: `${year}-03-15`,
            endDate: `${year}-03-31`,
            region: 'Nacional',
            weight: 1.3
          }
        );
        break;

      case 'DE':
      case 'FR':
      case 'IT':
      case 'ES':
        periods.push(
          {
            name: 'Summer Holidays',
            startDate: `${year}-07-01`,
            endDate: `${year}-08-31`,
            region: 'Nacional',
            weight: 1.5
          },
          {
            name: 'Christmas Holidays',
            startDate: `${year}-12-20`,
            endDate: `${year + 1}-01-06`,
            region: 'Nacional',
            weight: 1.4
          },
          {
            name: 'Easter Holidays',
            startDate: `${year}-03-25`,
            endDate: `${year}-04-10`,
            region: 'Nacional',
            weight: 1.3
          }
        );
        break;

      default:
        // Períodos genéricos universais
        periods.push(
          {
            name: 'Summer Season',
            startDate: `${year}-06-15`,
            endDate: `${year}-08-31`,
            region: 'Universal',
            weight: 1.3
          },
          {
            name: 'Winter Holidays',
            startDate: `${year}-12-20`,
            endDate: `${year + 1}-01-05`,
            region: 'Universal',
            weight: 1.4
          }
        );
    }

    return periods.filter(period => this.isDateInPeriod(date, period));
  }

  private isDateInPeriod(date: string, period: VacationPeriod): boolean {
    // Lidar com períodos que cruzam anos
    if (period.endDate.includes(`${new Date(date).getFullYear() + 1}`)) {
      const currentYearEnd = `${new Date(date).getFullYear()}-12-31`;
      const nextYearStart = period.endDate;
      
      return (date >= period.startDate && date <= currentYearEnd) ||
             (date <= nextYearStart && date >= `${new Date(date).getFullYear()}-01-01`);
    }
    
    return date >= period.startDate && date <= period.endDate;
  }
}
