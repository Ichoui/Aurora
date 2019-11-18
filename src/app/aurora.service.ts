import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { UtilsService } from './models/utils';
import { AuroraModules } from './models/aurorav2';
import { DataNotif } from './notifications';


export interface Nowcast {
    nowcast: {
        local: {
            lat: number;
            long: number;
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuroraService {

    constructor(private http: HttpClient) {
    }

    /**
     * @params {ParamsACE}
     * Récupération du KP actuel depuis Space Weather Prediction Center sous-traité par le site auroralive.io
     * type ACE combiné à data ALL : Récupère toute la data envoyée par ACE, BZ KP densité et vitesse particules
     * http://auroraslive.io/#/api/v1/ace
     * */
    auroraLive(params): Observable<any> {
        const queryParams: HttpParams = UtilsService.buildQueryParams(params);
        return this.http.get(`${environment.cors}/${environment.aurora_v1_api}`, {params});
    }

    /**
     * @body {Aurora} get la v2 de aurora.live
     * TODO Quand la v2 sera plus stable + du temps, attendre que le gars fixe le problème de nowcast
     * https://v2.api.auroras.live/images/embed/nowcast.png
     * */
    auroraLiveV2(lat?: number, long?: number, modules?: AuroraModules[], nowcast?: boolean): Observable<any> {
        if (nowcast) {
            return this.http.post(`${environment.cors}/${environment.aurora_v2_api}/nowcast`, {
                'nowcast:local': {
                    lat: 36,
                    long: 45
                }
            });
        } else {
            return this.http.post(`${environment.cors}/${environment.aurora_v2_api}`, {
                modules: [AuroraModules.kpcurrent, AuroraModules.density, AuroraModules.speed],
                common: {
                    lat: 42.50,
                    long: 1.54
                }
            });
        }
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
        return this.http.get(`${environment.cors}/${environment.api_weather}/forecast/${environment.apikey}/${lat},${long}/`, {params});
    }


    // https://jasonwatmore.com/post/2018/09/07/angular-6-basic-http-authentication-tutorial-example
    // --> Authorization missing header, interceptors (voir pour interceptor cors aussi?)
    pushNotification(body: DataNotif): Observable<any> {
        return this.http.post(`${environment.cors}/${environment.push_notifs}`, {body});
    }
}
