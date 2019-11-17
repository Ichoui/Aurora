import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { UtilsService } from './models/utils';

@Injectable({
    providedIn: 'root'
})
export class AuroraService {

    constructor(private http: HttpClient) {
    }

    /**
     * Récupération du KP actuel depuis Space Weather Prediction Center sous-traité par le site auroralive.io
     * type ACE combiné à data ALL : Récupère toute la data envoyée par ACE, BZ KP densité et vitesse particules
     * http://auroraslive.io/#/api/v1/ace
     * */
    auroraLive(params): Observable<any> {
        const queryParams: HttpParams = UtilsService.buildQueryParams(params);
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
