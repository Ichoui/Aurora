import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

const URL_DARK_SKY = 'https://api.darksky.net/forecast';
const URL_AURORA = 'https://api.auroras.live/v1';


@Injectable({
    providedIn: 'root'
})
export class AuroraService {


    constructor(private http: HttpClient) {
    }

    //http://auroraslive.io/#/api/v1

    // Aurores KP
    // --> http://auroraslive.io/#/api/v1/ace

    // Weather
    forecastNineDays(lat, long): Observable<any> {
        const params = {
            type: 'weather',
            forecast: 'true',
            lat: lat,
            long: long
        };
        // return this.http.get(`${environment.api}/${lat},${long}/`, {params});
        return this.http.get(`${URL_AURORA}/`, {params});

    }


    // --> http://auroraslive.io/#/api/v1/weather ?
    // --> prefere https://darksky.net/dev/docs#forecast-request mais tarifs?
}

// --> https://www.chartjs.org/docs/latest/getting-started/installation.html CHART JS! enjoy
