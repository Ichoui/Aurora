import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { cities, Coords } from '../models/cities';
import { NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AuroraService } from '../aurora.service';
import { Weather } from '../models/weather';
import { AuroraZenith, DataACE, ParamsACE, SolarWind } from '../models/aurora';

export interface ErrorTemplate {
    value: boolean;
    message: string;
}


@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

    loading: boolean = true;
    tabLoading: string[] = [];
    apiCallNumber: number = 3; // nombre de fois où une API est appelé sur cette page

    localisation: string;
    getCode: string;
    coords: Coords;
    city: string;
    country: string;
    slideOpts = {
        initialSlide: 0,
        speed: 400
    };

    eventRefresh: any;

    // Data inputs
    dataCurrentWeather: any;
    dataHourly: any;
    dataSevenDay: any;
    utcOffset: number;
    solarWind: SolarWind = {} as any;
    auroraZenith: AuroraZenith = {} as any;


    dataError: ErrorTemplate = {
        value: false,
        message: 'Un problème est survenu'
    };

    constructor(private geoloc: Geolocation,
                private storage: Storage,
                private auroraService: AuroraService,
                private nativeGeo: NativeGeocoder) {
    }

    ionViewWillEnter() {
        this.loading = true; // buffer constant
        // Cheminement en fonction si la localisation est pré-set ou si géoloc
        this.storage.get('localisation').then(
            codeLocation => {
                if (codeLocation === 'currentLocation' || codeLocation === null) {
                    this.getCode = codeLocation;
                    this.userLocalisation();
                } else {
                    this.getCode = codeLocation;
                    this.chooseAnyCity(codeLocation);
                }
            },
            error => {
                console.warn('errorStorage', error);
                this.dataError = {
                    value: true,
                    message: error
                };
            }
        );

        this.auroraService.auroraLiveV2(null,null,null,false).subscribe(console.log)
    }

    /**
     * Déterminer la localisation actuelle de l'utilisateur via lat/long et via reverseGeocode retrouver le nom de la ville exacte
     */
    userLocalisation() {
        this.geoloc.getCurrentPosition().then((resp) => {
            this.coords = resp.coords;
            this.nativeGeo.reverseGeocode(resp.coords.latitude, resp.coords.longitude).then(
                (res: NativeGeocoderResult[]) => {
                    this.city = res[0].locality;
                    this.country = res[0].countryName;
                    this.getForecast();
                    this.getSolarWind();
                    this.getLocalAuroraZenith();
                },
                error => {
                    console.warn('Erreur de reverse geocode', error);
                    this.loading = false;
                    this.dataError = {
                        value: true,
                        message: error
                    };
                }
            );
        }).catch((error) => {
            console.warn('Error getting location', error);
        });
    }

    /**
     * Choisir une des villes pré-enregistrées
     */
    chooseAnyCity(code: string): void {
        const city = cities.find(res => res.code === code);
        this.city = city.ville;
        this.country = city.pays;

        this.coords = {
            latitude: city.latitude,
            longitude: city.longitude
        };
        this.getForecast();
        this.getSolarWind();
        this.getLocalAuroraZenith();
    }

    /**
     * API Dark Sky
     * 4 variables pour aujourd'hui, les variables vont aux enfants via Input()
     */
    getForecast(): void {
        this.auroraService.darkSkyForecast(this.coords.latitude, this.coords.longitude).subscribe(
            (res: Weather) => {
                this.dataCurrentWeather = res.currently;
                this.dataHourly = res.hourly;
                this.dataSevenDay = res.daily;
                this.utcOffset = res.offset;
                this.trickLoading('1st');
            },
            error => {
                console.warn('Error with Dark Sky Forecast', error);
                this.loading = false;
                this.dataError = {
                    value: true,
                    message: error.status + ' ' + error.statusText
                };
            });
    }

    /**
     * Récupère les données ACE de vent solaire
     * */
    getSolarWind(): void {
        const params: ParamsACE = {
            type: 'ace',
            data: DataACE.all
        };
        this.auroraService.auroraLive(params).subscribe(
            (solarwind: SolarWind) => {
                this.solarWind = solarwind;
                this.trickLoading('2nd');
            },
            error => {
                console.warn('Problème avec données vent solaire', error);
                this.dataError = {
                    value: true,
                    message: error.status + ' ' + error.statusText
                };
            });
    }

    /**
     * Récupère les données ACE de probabilité d'Aurore pour une localisation lat/long donnée
     * */
    getLocalAuroraZenith(): void {
        const params: ParamsACE = {
            type: 'ace',
            data: DataACE.probability,
            lat: this.coords.latitude,
            long: this.coords.longitude
        };
        this.auroraService.auroraLive(params).subscribe(
            (auroraZenith: AuroraZenith) => {
                this.auroraZenith = auroraZenith;
                this.trickLoading('3th');
            },
            error => {
                console.warn('Problème avec données vent solaire', error);
                this.dataError = {
                    value: true,
                    message: error.status + ' ' + error.statusText
                };
            });
    }

    /**
     * Gère le loader
     * Lorsque tout les appels API sont passés, débloque le loader
     * */
    trickLoading(count: string): void {
        this.tabLoading.push(count);
        if (this.tabLoading.length === this.apiCallNumber) {
            this.loading = false;
            this.eventRefresh ? this.eventRefresh.target.complete() : '';
        }
    }

    /*
    * Attends les retours des résultats d'API pour retirer l'animation visuelle
    * */
    doRefresh(event) {
        this.tabLoading = [];
        this.eventRefresh = event;
        this.getForecast();
        this.getSolarWind();
        this.getLocalAuroraZenith();
    }
}
