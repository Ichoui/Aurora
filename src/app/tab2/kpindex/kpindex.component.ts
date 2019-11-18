import { Component, Input, OnInit } from '@angular/core';
import { AuroraZenith, SolarWind } from '../../models/aurora';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-kpindex',
    templateUrl: './kpindex.component.html',
    styleUrls: ['./kpindex.component.scss'],
})
export class KpindexComponent implements OnInit {

    dataSolarWind = new BehaviorSubject<SolarWind>(null);
    dataZenith = new BehaviorSubject<AuroraZenith>(null);
    forecastSW: SolarWind;
    forecastZenith: AuroraZenith;

    @Input()
    set solarWind(value: SolarWind) {
        this.dataSolarWind.next(value);
    }

    get solarWind() {
        return this.dataSolarWind.getValue();
    }

    @Input()
    set auroraZenith(value: AuroraZenith) {
        this.dataZenith.next(value);
    }

    get auroraZenith() {
        return this.dataZenith.getValue();
    }

    constructor(private storage: Storage) {
    }

    ngOnInit() {
        this.auroraBackground();
        this.solarWindData();
        this.auroraLikelyData();
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
            this.forecastSW = solarWind;
            this.storage.set('current_kp', this.forecastSW.kp);
        });
    }

    /**
     * Observable permettant de récupérer les des aurores visible au zénith via localisation
     * */
    auroraLikelyData(): void {
        this.dataZenith.subscribe(zenith => {
            this.forecastZenith = zenith;
            console.log(this.forecastZenith);
            this.storage.set('current_likely', this.forecastZenith.value);
        });
    }
}
