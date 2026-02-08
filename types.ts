
export type TimeOfDay = 'morning' | 'noon' | 'afternoon' | 'night';
export type AppLanguage = 'en' | 'id' | 'zh' | 'ja' | 'fr';

export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  pressure: number;
  altitude: number;
  humidity: number;
  voc: number;
  airStatus: 'Good' | 'Moderate' | 'Bad';
}

export interface ForecastDay {
  dayName: string;
  temp: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Thunder';
}

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Thunder';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ThemeConfig {
  bgGradient: string;
  accentColor: string;
  cardBg: string;
  textColor: string;
}
