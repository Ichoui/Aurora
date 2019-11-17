import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ParamsACE } from './models/aurora';

const URL_DARK_SKY = 'https://api.darksky.net/forecast';
const URL_AURORA = 'https://api.auroras.live/v1';

export interface ForecastParams {
    type: string;
    forecast?: string;
    lat: number;
    long: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuroraService {

    //http://auroraslive.io/#/api/v1

    constructor(private http: HttpClient) {
    }

    /**
     * Récupération du KP actuel depuis Space Weather Prediction Center sous-traité par le site auroralive.io
     * type ACE combiné à data ALL : Récupère toute la data envoyée par ACE, BZ KP densité et vitesse particules
     * http://auroraslive.io/#/api/v1/ace
     * */
    auroraLive(): Observable<any> {
        const params = {
            type: 'ace',
            data: 'all',
        };
        return this.http.get(`${environment.cors}/${environment.aurora_api}`, {params});
    }

    /**
     * @param lat : latitude
     * @param long : longitude
     * @param exclude : hourly | daily
     * prefere https://darksky.net/dev/docs#forecast-request
     * */
    darkSkyForecast(lat: number, long: number, exclude?: string): Observable<any> {
        const params = {
            lang: 'fr',
            units: 'si',
            exclude: `alerts, flags, ${exclude}`
        };
        return this.http.get(`${environment.cors}/${environment.api}/forecast/${environment.apikey}/${lat},${long}/`, {params});
    }


}

// --> https://www.chartjs.org/docs/latest/getting-started/installation.html CHART JS! enjoy
