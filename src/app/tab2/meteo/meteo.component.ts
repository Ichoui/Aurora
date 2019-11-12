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

    sunset;
    sunrise;

    constructor() {
    }

    ngOnInit() {
        this.todayForecast();
        this.nextHoursForecast();
        this.sevenDayForecast();
    }


    todayForecast() {
        console.log(this.currentWeather);
        const date = this.manageDates(this.currentWeather.time);
        console.log(date);
    }

    nextHoursForecast() {
        console.log(this.hourlyWeather.data);

    }

    sevenDayForecast() {

        const today = moment().add(0, 'd');
        this.sevenDayWeather.data.forEach(day => {
            if (this.manageDates(day.time, 'MM DD') === today.format('MM DD')) {
                console.log(day.windSpeed);
                this.sunset = this.manageDates(day.sunsetTime, 'H:mm');
                this.sunrise = this.manageDates(day.sunriseTime, 'H:mm');
            }
            console.log(day);
        });
    }

    /**
     * Permet de gérer les dates qui sont au format Unix Timestamp (seconds)
     * @params date Date retournée par l'API
     * @params format Permet de choisir le formatage de la date. (ex: YYYY MM DD)
     * */
    manageDates(date: number, format?: string): string | moment.Moment {
        const unixToLocal = moment.unix(date);
        return unixToLocal.format(format);
    }
}
