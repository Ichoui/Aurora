import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { Density, KpCurrent, Nowcast, Speed } from '../../models/aurorav2';

@Component({
    selector: 'app-kpindex',
    templateUrl: './kpindex.component.html',
    styleUrls: ['./kpindex.component.scss'],
})
export class KpindexComponent implements OnInit {

    dataSolarWind = new BehaviorSubject<any>(null); // type SolarWind
    dataNowcast = new BehaviorSubject<Nowcast>(null);
    // forecastSW: SolarWind ;
    // forecastZenith: AuroraZenith;

    density: Density;
    kpCurrent: KpCurrent;
    speed: Speed;
    nowcast: Nowcast;

    @Input()
    set solarWindValue(value: any) {
        this.dataSolarWind.next(value);
    }

    get solarWindValue() {
        return this.dataSolarWind.getValue();
    }

    @Input()
    set nowcastValue(value: Nowcast) {
        this.dataNowcast.next(value);
    }

    get nowcastValue() {
        return this.dataNowcast.getValue();
    }

    constructor(private storage: Storage) {
    }

    ngOnInit() {
        this.auroraBackground();
        this.solarWindData();
        this.auroraNowcast();
    }

    /**
     * Fait scintiller les étoiles en background
     * */
    auroraBackground(): void {
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

    /**
     * Observable permettant de récupérer les données des vents solaires
     * */
    solarWindData(): void {
        this.dataSolarWind.subscribe(solarWind => {
            this.density = solarWind.density;
            this.kpCurrent = solarWind["kp:current"];
            // this.kpCurrent.value = 75; // test
            this.speed = solarWind.speed;
            this.storage.set('current_kp', this.kpCurrent.value);
        });
    }

    /**
     * Observable permettant de récupérer les des aurores visible au zénith via localisation
     * */
    auroraNowcast(): void {
        this.dataNowcast.subscribe(nowcast => {
            this.nowcast = nowcast;
            this.storage.set('nowcast', this.nowcast.value);
        });
    }


}
