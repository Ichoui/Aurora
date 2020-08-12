import { Moment } from 'moment';

// https://openweathermap.org/api/one-call-api

// DarkSky
export interface Weather {
  lat: number;
  long: number;
  timezone: string;
  timezone_offset: number;
  current: Currently;
  minutely: Minutely[];
  hourly: Hourly[];
  daily: Daily[];
}

export interface Currently {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherIcon[];
  rain: RainOneHour;
}

export interface WeatherIcon {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface RainOneHour {
  ['1h']: number;
}

export interface Minutely {
  dt: number;
  precipitation: number;
}

export interface Hourly {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherIcon[];
  pop: number;
  rain: RainOneHour;
}

export interface Daily {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: DailyTemp;
  feels_like: DailyFeelsLike;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherIcon[];
  clouds: number;
  pop: number;
  rain: number;
  uvi: number;
}

export interface DailyTemp {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}
export interface DailyFeelsLike {
  day: number;
  night: number;
  eve: number;
  morn: number;
}

// Ennuagement
export interface Cloudy {}
