import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
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
     * @param lat longitude
     * @param long latitude
     * get la v2 providé par aurora.live grâce au Space Weather Prediction Center
     * https://v2.api.auroras.live/images/embed/nowcast.png
     * */
    auroraLiveV2(lat?: number, long?: number): Observable<any> {
        return this.http.post(`${environment.cors}/${environment.aurora_v2_api}`, {
            modules: [AuroraModules.kpcurrent, AuroraModules.density, AuroraModules.speed, AuroraModules.nowcastlocal, AuroraModules.kp27day],
            'common': {
                lat: lat,
                long: long
            }
        });
    }

    /**
     * @param lat : latitude
     * @param long : longitude
     * @param exclude : hourly | daily
     * @param time : Time au format UNIX (moment)
     * */
    darkSkyForecast(lat: number, long: number, exclude?: string, time?: number): Observable<any> {
        const params = {
            lang: 'fr',
            units: 'si',
            exclude: `alerts, flags, ${exclude}`
        };
        if (time) {
            return this.http.get(`${environment.cors}/${environment.api_weather}/forecast/${environment.apikey}/${lat},${long},${time}/`, {params});

        } else {
            return this.http.get(`${environment.cors}/${environment.api_weather}/forecast/${environment.apikey}/${lat},${long}/`, {params});
        }
    }

    // https://jasonwatmore.com/post/2018/09/07/angular-6-basic-http-authentication-tutorial-example
    // --> Authorization missing header, interceptors (voir pour interceptor cors aussi?)
    pushNotification(body: DataNotif): Observable<any> {

        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic ${ONE_SIGNAL_REST_KEY}`
            })
        };
        return this.http.post(`${environment.push_notifs}`, {body});
    }
}
