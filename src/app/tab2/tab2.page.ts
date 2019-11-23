import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { cities, Coords } from '../models/cities';
import { NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AuroraService } from '../aurora.service';
import { Currently, Daily, Hourly, Weather } from '../models/weather';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
import 'moment/locale/fr';
import { Kp27day, KpForecast } from '../models/aurorav2';

export interface ErrorTemplate {
    value: boolean;
    message: string;
}

const API_CALL_NUMBER = 2; // nombre de fois où une API est appelé sur cette page

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

    loading: boolean = true;
    tabLoading: string[] = [];

    localisation: string;
    getCode: string;
    coords: Coords;
    city: string;
    country: string;
    slideOpts = {
        initialSlide: 1,
        speed: 400
    };

    eventRefresh: any;

    // Data inputs
    dataCurrentWeather: Currently;
    dataHourly: Hourly;
    dataSevenDay: Daily;
    utcOffset: number;
    moduleACE: any = {} as any;
    kpForecast: KpForecast = {} as any;
    kpForecast27days: Kp27day = {} as any;


    dataError: ErrorTemplate = {
        value: false,
        message: 'Un problème est survenu'
    };

    constructor(private geoloc: Geolocation,
                private storage: Storage,
                private navCtrl: NavController,
                private auroraService: AuroraService,
                private nativeGeo: NativeGeocoder) {
    }

    ionViewWillEnter() {
        this.loading = true; // buffer constant
        this.tabLoading = [];

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
    }

    /**
     * API Dark Sky
     * 4 variables pour aujourd'hui, les variables vont aux enfants via Input()
     */
    getForecast(time?: number): void {
        if (time) {

        this.auroraService.darkSkyForecast(this.coords.latitude, this.coords.longitude, null, time).subscribe(
            (res: Weather) => {
                console.log(res);
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
        } else {
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
    }

    /**
     * Récupère les données ACE de vent solaire & nowcast
     * */
    getSolarWind(): void {
        this.auroraService.auroraLiveV2(this.coords.latitude, this.coords.longitude).subscribe(
            ACE => {
                this.moduleACE = ACE;
                this.kpForecast = ACE['kp:forecast'];
                this.kpForecast27days = ACE['kp:27day'];
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
     * Gère le loader
     * Lorsque tout les appels API sont passés et le tableau égal à la valeur API_CALL_NUMBER, débloque le loader
     * */
    trickLoading(count: string): void {
        this.tabLoading.push(count);
        if (this.tabLoading.length === API_CALL_NUMBER) {
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
        this.getForecast(moment().unix());
        this.getSolarWind();
    }
}
