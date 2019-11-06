import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { cities, Coords } from '../cities';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

    loading: boolean = true;
    localisation;
    coords: Coords;

    constructor(private geoloc: Geolocation, private storage: Storage) {
    }

    ionViewWillEnter() {
        this.loading = true; // si on remet ça, buffer constamment présent : pas trop long ?
        this.storage.get('localisation').then(
            codeLocation => {
                if (codeLocation === 'currentLocation') {
                    this.localisation = codeLocation;
                    this.userLocalisation();
                } else {
                    this.localisation = codeLocation;
                    this.chooseAnyCity(codeLocation);
                }
            },
            error => console.log('errorStorage', error)
        );
    }

    // reverse coordonénées ici
    userLocalisation(): void {
        this.geoloc.getCurrentPosition().then((resp) => {
            this.coords = resp.coords;
            console.log(resp);
            this.loading = false;
            console.log(this.coords);
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

    // choosen city coords
    chooseAnyCity(code: string): void {
        const city = cities.find(res => res.code === code);
        this.coords = {
            latitude : city.latitude,
            longitude: city.longitude
        };
        this.loading = false;
    }
}
