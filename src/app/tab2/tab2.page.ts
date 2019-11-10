import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { cities, Coords } from '../cities';
import { NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AuroraService } from '../aurora.service';
import { tap } from 'rxjs/operators';

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

    dataForecast: any;

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

    chooseAnyCity(code: string): void {
        const city = cities.find(res => res.code === code);
        this.city = city.ville;
        this.country = city.pays;

        this.coords = {
            latitude: city.latitude,
            longitude: city.longitude
        };
        this.getForecast();
        // this.loading = false;
    }

    getForecast(): void {
        this.auroraService.forecastNineDays(this.coords.latitude, this.coords.longitude).pipe(
        ).subscribe(
                data => this.dataForecast = data,
                error => {
                    console.warn('Error with the Forecast', error);
                    this.loading = false;
                    this.dataError = {
                        value: true,
                        message: error.status + ' ' + error.statusText
                    };
                    console.log(this.dataError);
                },
                () => this.loading = false
            );
    }
}
