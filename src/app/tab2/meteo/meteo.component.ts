import { Component, Input, OnInit } from '@angular/core';
import { Coords } from '../../cities';
import { Weather } from '../../weather';

@Component({
    selector: 'app-meteo',
    templateUrl: './meteo.component.html',
    styleUrls: ['./meteo.component.scss'],
})
export class MeteoComponent implements OnInit {

    @Input() coords: Coords;
    @Input() dataForecast: any;

    constructor() {
    }

    ngOnInit() {
        console.log(this.dataForecast);
        Object.keys(this.dataForecast).forEach(key => {
            let value: Weather = this.dataForecast[key];
            // Exclu le message du Space Weather Prediction Center
            if (value.length != 1) {
                console.log(value);
            }
        });
    }

}
