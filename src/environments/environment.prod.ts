import { DARKSKY_API_KEY } from './keep';
export const environment = {
  production: true,
  cors: 'https://cors-anywhere.herokuapp.com',
  api_weather: 'https://api.darksky.net',
  aurora_v1_api: 'https://api.auroras.live/v1',
  aurora_v2_api: 'https://v2.api.auroras.live',
  push_notifs : 'https://onesignal.com/api/v1/notifications',
  apikey: DARKSKY_API_KEY,
  application_name: 'Aurora - Northen Light',
};
