// services/seasonalityService.ts (atualizado)
import { GeocodingService } from './geolocationSazonality';
import { HolidayService } from './holidayServices';
import { VacationService } from './vacationService';
import { SeasonalityRequest, SeasonalityResponse, SeasonPeriod, SeasonInfo, HolidayInfo, VacationPeriod } from '../types/seasonality';

export class SeasonalityService {
  private readonly currentYear: number;
  private geocodingService = new GeocodingService();
  private holidayService = new HolidayService();
  private vacationService = new VacationService();

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  // Método original para compatibilidade
  getSeasonality(req: { lat: number }): {
    hemisphere: 'northern' | 'southern';
    hemisphereDescription: string;
    currentSeason: SeasonPeriod;
    highSeasons: SeasonPeriod[];
    lowSeasons: SeasonPeriod[];
    allSeasons: SeasonPeriod[];
  } {
    const isNorthern = req.lat > 0;
    const hemisphere = isNorthern ? 'northern' : 'southern';
    
    const seasons = this.calculateSeasons(isNorthern);
    const currentSeason = this.getCurrentSeason(seasons);
    
    const highSeasons = seasons.filter(s => s.intensity === 'high');
    const lowSeasons = seasons.filter(s => s.intensity === 'low');

    return {
      hemisphere,
      hemisphereDescription: isNorthern 
        ? 'Hemisfério Norte - Estações alinhadas com Europa/EUA'
        : 'Hemisfério Sul - Estações opostas ao Hemisfério Norte',
      currentSeason,
      highSeasons,
      lowSeasons,
      allSeasons: seasons
    };
  }

  // Novo método completo com weight dinâmico
  async getSeasonalityWeight(req: SeasonalityRequest): Promise<SeasonalityResponse> {
    const date = req.date || new Date().toISOString().split('T')[0];
    
    // 1. Obter dados básicos de sazonalidade
    const basicSeasonality = this.getSeasonality({ lat: req.lat });
    
    // 2. Obter informações geográficas
    const location = await this.geocodingService.getCountryFromCoordinates(req.lat, req.lon);
    
    // 3. Obter informações sazonais
    const seasonInfo: SeasonInfo = {
      season: basicSeasonality.currentSeason.season,
      intensity: basicSeasonality.currentSeason.intensity,
      weight: this.getSeasonWeight(basicSeasonality.currentSeason.intensity)
    };

    // 4. Verificar feriados
    const holidayInfo = await this.holidayService.isHoliday(location.countryCode, date);

    // 5. Verificar períodos de férias
    const vacationPeriods = this.vacationService.getVacationPeriods(location.countryCode, date);

    // 6. Calcular peso final
    const breakdown = this.calculateFinalWeight(seasonInfo, holidayInfo, vacationPeriods);

    return {
      // Dados básicos de sazonalidade
      hemisphere: basicSeasonality.hemisphere,
      hemisphereDescription: basicSeasonality.hemisphereDescription,
      currentSeason: basicSeasonality.currentSeason,
      highSeasons: basicSeasonality.highSeasons,
      lowSeasons: basicSeasonality.lowSeasons,
      allSeasons: basicSeasonality.allSeasons,
      
      // Dados específicos da consulta
      date,
      country: location.country,
      region: location.region,
      coordinates: { lat: req.lat, lon: req.lon },
      seasonInfo,
      holidayInfo,
      vacationPeriods,
      finalWeight: breakdown.final,
      breakdown: {
        baseWeight: 1.0,
        seasonWeight: seasonInfo.weight,
        holidayWeight: holidayInfo.weight,
        vacationWeight: vacationPeriods.length > 0 ? Math.max(...vacationPeriods.map(v => v.weight)) : 1.0,
        appliedRule: breakdown.rule
      },
      recommendations: this.getRecommendations(breakdown.final)
    };
  }

  private calculateSeasons(isNorthern: boolean): SeasonPeriod[] {
    if (isNorthern) {
      return this.getNorthernSeasons();
    } else {
      return this.getSouthernSeasons();
    }
  }

  private getNorthernSeasons(): SeasonPeriod[] {
    return [
      {
        season: 'spring',
        intensity: 'medium',
        startDate: `${this.currentYear}-03-20`,
        endDate: `${this.currentYear}-06-20`,
        durationDays: 92,
        description: 'Primavera no Norte - Temperaturas amenas, boa época para turismo'
      },
      {
        season: 'summer',
        intensity: 'high',
        startDate: `${this.currentYear}-06-21`,
        endDate: `${this.currentYear}-09-21`,
        durationDays: 93,
        description: 'Verão no Norte - Alta temporada, clima quente, pico turístico'
      },
      {
        season: 'autumn',
        intensity: 'medium',
        startDate: `${this.currentYear}-09-22`,
        endDate: `${this.currentYear}-12-20`,
        durationDays: 89,
        description: 'Outono no Norte - Temperaturas amenas, boa época intermediária'
      },
      {
        season: 'winter',
        intensity: 'low',
        startDate: `${this.currentYear}-12-21`,
        endDate: `${this.currentYear + 1}-03-19`,
        durationDays: 89,
        description: 'Inverno no Norte - Baixa temporada, clima frio, menos turismo'
      }
    ];
  }

  private getSouthernSeasons(): SeasonPeriod[] {
    return [
      {
        season: 'summer',
        intensity: 'high',
        startDate: `${this.currentYear}-12-21`,
        endDate: `${this.currentYear + 1}-03-19`,
        durationDays: 89,
        description: 'Verão no Sul - Alta temporada, clima quente, pico turístico'
      },
      {
        season: 'autumn',
        intensity: 'medium',
        startDate: `${this.currentYear}-03-20`,
        endDate: `${this.currentYear}-06-20`,
        durationDays: 92,
        description: 'Outono no Sul - Temperaturas amenas, boa época intermediária'
      },
      {
        season: 'winter',
        intensity: 'low',
        startDate: `${this.currentYear}-06-21`,
        endDate: `${this.currentYear}-09-21`,
        durationDays: 93,
        description: 'Inverno no Sul - Baixa temporada, clima frio, menos turismo'
      },
      {
        season: 'spring',
        intensity: 'medium',
        startDate: `${this.currentYear}-09-22`,
        endDate: `${this.currentYear}-12-20`,
        durationDays: 89,
        description: 'Primavera no Sul - Temperaturas amenas, boa época para turismo'
      }
    ];
  }

  private getCurrentSeason(seasons: SeasonPeriod[]): SeasonPeriod {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    for (const season of seasons) {
      if (this.isDateInRange(todayStr, season.startDate, season.endDate)) {
        return season;
      }
    }
    
    return seasons[0];
  }

  private isDateInRange(date: string, startDate: string, endDate: string): boolean {
    if (startDate.includes(`${this.currentYear + 1}`) || endDate.includes(`${this.currentYear + 1}`)) {
      const currentYearStart = startDate.replace(`${this.currentYear + 1}`, `${this.currentYear}`);
      const nextYearEnd = endDate;
      
      return date >= currentYearStart || date <= nextYearEnd;
    }
    
    return date >= startDate && date <= endDate;
  }

  private getSeasonWeight(intensity: 'high' | 'low' | 'medium'): number {
    switch (intensity) {
      case 'high': return 1.3;   // Alta temporada
      case 'medium': return 1.0; // Temporada média
      case 'low': return 0.7;    // Baixa temporada
      default: return 1.0;
    }
  }

  private calculateFinalWeight(
    season: SeasonInfo, 
    holiday: HolidayInfo, 
    vacations: VacationPeriod[]
  ): { final: number; rule: string } {
    
    // Prioridade: Feriado > Férias > Sazonalidade
    
    // 1. Se é feriado público = peso máximo
    if (holiday.isHoliday && holiday.holidayType === 'public') {
      return {
        final: Math.min(1.5, holiday.weight), // Cap em 1.5
        rule: `Feriado público: ${holiday.holidayName}`
      };
    }

    // 2. Se está em período de férias
    if (vacations.length > 0) {
      const maxVacationWeight = Math.max(...vacations.map(v => v.weight));
      return {
        final: Math.min(1.5, maxVacationWeight), // Cap em 1.5
        rule: `Período de férias: ${vacations[0].name}`
      };
    }

    // 3. Se é feriado menor
    if (holiday.isHoliday) {
      return {
        final: Math.min(1.5, holiday.weight),
        rule: `Feriado: ${holiday.holidayName}`
      };
    }

    // 4. Apenas sazonalidade
    return {
      final: Math.max(0.7, Math.min(1.3, season.weight)), // Entre 0.7 e 1.3
      rule: `Sazonalidade: ${season.intensity} temporada`
    };
  }

  private getRecommendations(weight: number): {
    category: 'low' | 'medium' | 'high' | 'peak';
    description: string;
    suggestedMarkup: string;
  } {
    if (weight >= 1.4) {
      return {
        category: 'peak',
        description: 'Período de pico - máxima demanda',
        suggestedMarkup: '+40-50% sobre preço base'
      };
    } else if (weight >= 1.2) {
      return {
        category: 'high',
        description: 'Alta temporada - demanda elevada',
        suggestedMarkup: '+20-40% sobre preço base'
      };
    } else if (weight >= 0.9) {
      return {
        category: 'medium',
        description: 'Temporada média - demanda normal',
        suggestedMarkup: 'Preço base'
      };
    } else {
      return {
        category: 'low',
        description: 'Baixa temporada - oportunidade de desconto',
        suggestedMarkup: '-10 a -30% sobre preço base'
      };
    }
  }
}
