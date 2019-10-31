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
        // this.loading = true; // si on remet ça, buffer constamment présent : pas trop long ?
        this.storage.get('localisation').then(
            res => {
                this.localisation = res;
                console.log(this.localisation);
            },
            error => console.log('errorStorage', error)
        );
        this.userLocalisation();
    }

    userLocalisation() {
        this.geoloc.getCurrentPosition().then((resp) => {
            console.log(resp.coords);
            this.coords = resp.coords;
            this.loading = false;
            console.log(this.coords);
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }
}
