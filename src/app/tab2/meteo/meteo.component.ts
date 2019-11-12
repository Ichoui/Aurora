import { Component, Input, OnInit } from '@angular/core';
import { Coords } from '../../cities';
import * as moment from 'moment';
import 'moment/locale/fr';
import { Currently, Daily, Hourly } from '../../weather';

@Component({
    selector: 'app-meteo',
    templateUrl: './meteo.component.html',
    styleUrls: ['./meteo.component.scss'],
})
export class MeteoComponent implements OnInit {

    @Input() coords: Coords;
    @Input() currentWeather: Currently;
    @Input() hourlyWeather: Hourly;
    @Input() sevenDayWeather: Daily;

    sunset = 0;// a calculer
    sunrise = 0;

    constructor() {
    }

    ngOnInit() {
        this.todayForecast();
        this.nextHoursForecast();
        this.sevenDayForecast();
    }


    todayForecast() {
        console.log(this.currentWeather);
        const date = this.manageDates(this.currentWeather.time, true);
        console.log(date);
    }

    nextHoursForecast() {
        console.log(this.hourlyWeather);

    }

    sevenDayForecast() {
        console.log(this.sevenDayWeather);
    }

    /**
    * Permet de gérer les dates qui sont au format Unix Timestamp (seconds)
    * @params date Date retournée par l'API
    * @params format  true : renvoie la date formatée 2019-11-12T21:16:37Z / false : renvoie l'objet momentJs
     * */
    manageDates(date: number, format?: boolean): string | moment.Moment {
        const unixToLocal = moment.unix(date).utc();
        if (format) {
            return unixToLocal.format();
        } else {
            return unixToLocal;
        }
    }
}
