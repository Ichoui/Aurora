import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

    loading: boolean = true;
    localisation;
    coords: Coordinates;

    constructor(private geoloc: Geolocation, private storage: Storage) {
    }

    ionViewWillEnter() {
        this.loading = true; // si on remet ça, buffer constamment présent : pas trop long ?
        this.storage.get('localisation').then(
            localisation => {
                this.localisation = localisation;
                if (localisation === 'currentLocation') {
                    this.userLocalisation();
                } else {
                    this.coords = null;
                    // mettre les coordonénées des autres via fonction
                    this.loading = false;
                }
                console.log(this.localisation);
            },
            error => console.log('errorStorage', error)
        );
    }

    // reverse coordonénées ici
    userLocalisation() {
        this.geoloc.getCurrentPosition().then((resp) => {
            this.coords = resp.coords;
            this.loading = false;
            console.log(this.coords);
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }
}
