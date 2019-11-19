import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { UtilsService } from './models/utils';
import { AuroraModules } from './models/aurorav2';
import { DataNotif } from './notifications';
import { ONE_SIGNAL_REST_KEY } from '../environments/keep';


@Injectable({
    providedIn: 'root'
})
export class AuroraService {

    constructor(private http: HttpClient) {
    }

    /**
     * @params {ParamsACE}
     * Récupération du KP actuel
     * type ACE combiné à data ALL : Récupère toute la data envoyée par ACE, BZ KP densité et vitesse particules
     * TODO Supprimer si on garde la v2 défintivement(ainsi que la data dans tab2.ts & kpindex.ts)
     * http://auroraslive.io/#/api/v1/ace
     * */
    auroraLive(params): Observable<any> {
        const queryParams: HttpParams = UtilsService.buildQueryParams(params);
        return this.http.get(`${environment.cors}/${environment.aurora_v1_api}`, {params});
    }

    /**
     * @lat : longitude
     * @long latitude
     * @nowcast si true on envoie nowcast la data Nowcast, sinon on envoie les modules et la latitudes.
     * get la v2 providé par aurora.live grâce au Space Weather Prediction Center
     * TODO Utilisation de la V2. Peut être soumis à des changements
     * https://v2.api.auroras.live/images/embed/nowcast.png
     * */
    auroraLiveV2(lat?: number, long?: number, nowcast?: boolean): Observable<any> {
        if (nowcast) {
            return this.http.post(`${environment.cors}/${environment.aurora_v2_api}/nowcast`, {
                'nowcast:local': {
                    lat: lat,
                    long: long
                }
            });
        } else {
            return this.http.post(`${environment.cors}/${environment.aurora_v2_api}`, {
                modules: [AuroraModules.kpcurrent, AuroraModules.density, AuroraModules.speed],
                common: {
                    lat: lat,
                    long: long
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

        const httpOptions = {
            headers: new HttpHeaders({
                'Accept':  'application/json',
                'Content-Type':  'application/json',
                'Authorization': `Basic ${ONE_SIGNAL_REST_KEY}`
            })
        };
        return this.http.post(`${environment.push_notifs}`, {body});
    }
}
