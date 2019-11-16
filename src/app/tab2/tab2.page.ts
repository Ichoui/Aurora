import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { cities, Coords } from '../cities';
import { NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AuroraService } from '../aurora.service';
import { Weather } from '../weather';

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
    localisation: string;
    getCode: string;
    coords: Coords;
    city: string;
    country: string;
    slideOpts = {
        initialSlide: 0,
        speed: 400
    };

    dataCurrentWeather: any;
    dataHourly: any;
    dataSevenDay: any;
    utcOffset: number;

    dataError: ErrorTemplate = {
        value: false,
        message: 'Un problème est survenu'
    };
    eventRefresh: any;

    constructor(private geoloc: Geolocation,
                private storage: Storage,
                private auroraService: AuroraService,
                private nativeGeo: NativeGeocoder) {
    }

    ionViewWillEnter() {
        this.loading = true; // si on remet ça, buffer constamment présent : pas trop long ?
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
     * */
    userLocalisation() {
        this.geoloc.getCurrentPosition().then((resp) => {
            this.coords = resp.coords;
            this.nativeGeo.reverseGeocode(resp.coords.latitude, resp.coords.longitude).then(
                (res: NativeGeocoderResult[]) => {
                    this.city = res[0].locality;
                    this.country = res[0].countryName;
                    this.getForecast();
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
     * */
    chooseAnyCity(code: string): void {
        const city = cities.find(res => res.code === code);
        this.city = city.ville;
        this.country = city.pays;

        this.coords = {
            latitude: city.latitude,
            longitude: city.longitude
        };
        this.getForecast();
    }

    /**
     * API Dark Sky
     * 4 variables pour aujourd'hui, prochaines 24h, 7 jours et UtfOffset pour déterminer l'horaire locale de l'endroit sélectionné
     * */
    getForecast(): void {
        this.auroraService.darkSkyForecast(this.coords.latitude, this.coords.longitude).subscribe(
            (res: Weather) => {
                this.dataCurrentWeather = res.currently;
                this.dataHourly = res.hourly;
                this.dataSevenDay = res.daily;
                this.utcOffset = res.offset;
                this.loading = false;

                this.eventRefresh ? this.eventRefresh.target.complete() : '';
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
    doRefresh(event) {
        this.eventRefresh = event;
        console.log('heere');
        this.getForecast();
    }
}
