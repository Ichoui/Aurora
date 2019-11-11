import { Component, Input, OnInit } from '@angular/core';
import { Coords } from '../../cities';
import { Weather } from '../../weather';
import 'moment/locale/fr';

@Component({
    selector: 'app-meteo',
    templateUrl: './meteo.component.html',
    styleUrls: ['./meteo.component.scss'],
})
export class MeteoComponent implements OnInit {

    @Input() coords: Coords;
    @Input() nineDayForecast;
    @Input() currentWeather: Weather;

    constructor() {
    }

    ngOnInit() {
        this.sevenDayForecast();
        this.todayWeather();
    }

    sevenDayForecast() {
        console.log(this.nineDayForecast);
        Object.keys(this.nineDayForecast).forEach(key => {
            let value: Weather = this.nineDayForecast[key];
            // Exclu le message du Space Weather Prediction Center
            let i = 0;
            if (value.length != 1) {
                i = i + 1;
                // console.log(i);
                // console.log(value);
            }
        });
    }

    todayWeather() {
        console.log(this.currentWeather);
        // console.log(this.currentWeather.temperature);

    }

    nextHours() {

    }

}
