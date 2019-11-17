import { Component, Input, OnInit } from '@angular/core';
import { SolarWind } from '../../models/aurora';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-kpindex',
    templateUrl: './kpindex.component.html',
    styleUrls: ['./kpindex.component.scss'],
})
export class KpindexComponent implements OnInit {

    dataAurora = new BehaviorSubject<SolarWind>(null);
    forecastACE: SolarWind;

    @Input()
    set solarWind(value: SolarWind) { this.dataAurora.next(value) }
    get solarWind() { return this.dataAurora.getValue() }

    constructor(private storage: Storage) {
    }

    ngOnInit() {
        this.auroraBackground();
        this.solarWindData();
        this.storage.set('current_kp', this.forecastACE.kp);
    }

    auroraBackground() {
        const reset = function (e) {
            e.target.className = 'star';
            setTimeout(function () {
                e.target.className = 'star star--animated';
            }, 0);
        };
        const stars = document.querySelectorAll('.star');
        for (let i = 0; i < stars.length; i++) {
            stars[i].addEventListener('animationend', reset);
        }
    }

    solarWindData() {
        this.dataAurora.subscribe(aurora => {
            this.forecastACE = aurora;
            console.log(this.forecastACE);
        });
    }
}
