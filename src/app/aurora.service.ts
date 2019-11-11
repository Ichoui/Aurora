import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

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
    // Aurores KP
    // --> http://auroraslive.io/#/api/v1/ace

    // Weather
    weatherForecast(lat, long, forecast): Observable<any> {
        const params = {
            type: 'weather',
            forecast: forecast,
            lat: lat,
            long: long
        };

        return this.http.get(`${URL_AURORA}/`, {params});
    }

    testDarkSky(lat, long): Observable<any> {
        const params = {
        };
        return this.http.get(`${environment.cors}/${environment.api}/forecast/${environment.apikey}/${lat},${long}/`, {params});
    }


    // --> prefere https://darksky.net/dev/docs#forecast-request mais tarifs?
}

// --> https://www.chartjs.org/docs/latest/getting-started/installation.html CHART JS! enjoy
