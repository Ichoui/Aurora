import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuroraModules } from './models/aurorav2';
import { Weather } from './models/weather';

@Injectable({
  providedIn: 'root',
})
export class AuroraService {
  constructor(private http: HttpClient) {}

  /**
   * @param lat {number} longitude
   * @param long {number} latitude
   * get la v2 providé par aurora.live grâce au Space Weather Prediction Center
   * https://v2.api.auroras.live/images/embed/nowcast.png
   * */
  auroraLiveV2(lat?: number, long?: number): Observable<any> {
    return this.http.post(`${environment.cors}/${environment.aurora_v2_api}`, {
      modules: [AuroraModules.kpcurrent, AuroraModules.density, AuroraModules.speed, AuroraModules.nowcastlocal, AuroraModules.kp27day, AuroraModules.kpforecast],
      common: {
        lat: lat,
        long: long,
      },
    });
  }

  /**
   * @param lat {number} latitude
   * @param long {number} longitude
   * @param exclude {string} hourly | daily
   * */
  darkSkyForecast(lat: number, long: number, exclude?: string): Observable<any> {
    const params = {
      lang: 'fr',
      units: 'si',
      exclude: `alerts, flags, ${exclude}`,
    };
    return this.http.get(`${environment.cors}/${environment.api_darksky}/forecast/${environment.apikey_ds}/${lat},${long}/`, { params });
  }

  /**
   * @param lat {number} latitude
   * @param lon {number} longitude
   * @param exclude {string} hourly | daily
   * @param unit  {unit}
   * */
  openWeatherMapForecast$(lat: number, lon: number, unit?: Unit, exclude?: ExcludeType): Observable<Weather> {
    const params = {
      appid: environment.apikey,
      lat: lat.toString(),
      lon: lon.toString(),
      lang: 'fr',
      units: unit,
      exclude: exclude,
    };
    return this.http.get<Weather>(`${environment.cors}/${environment.api_weather}`, { params });
  }

  /**
   * @param pole {string} NORTH / SOUTH
   * Permet de récupérer les images de la planète qui tournante avec les aurores qui s'y déplacent
   * */
  getOvations(pole: string): Observable<any> {
    return this.http.get(`${environment.cors}/https://services.swpc.noaa.gov/products/animations/ovation-${pole}.json`);
  }
}

export enum ExcludeType {
  MINUTELY = 'minutely',
  HOURLY = 'hourly',
  DAILY = 'daily'
}

export enum Unit {
  METRIC = 'metric',
  IMPERIAL = 'imperial',
}
