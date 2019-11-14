import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { cities } from '../cities';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

    cities = cities;
    localisation: string;


    constructor(private storage: Storage,
                private iab: InAppBrowser) {
    }

    /*
    * Si storage vide, set valeur à location actuelle ET valeur du select à position actuelle
    * Sinon, set valeur du select à la position indiquée dans storage
    * */
    ionViewWillEnter() {
        this.storage.get('localisation').then(
            localisation => {
                console.log(localisation);
                if (localisation === null) {
                    console.log('je suis là');
                    this.selectedValue(null, 'currentLocation');
                    this.localisation = 'currentLocation';
                } else {
                    this.localisation = localisation;
                }
            },
            error => console.warn('Il y a un soucis de storage de position', error)
        );


    }

    openUrl(url: string) {
       const options : InAppBrowserOptions = {
            location : 'yes',//Or 'no'
        };
        this.iab.create(url, '_system', options);
    }


    selectedValue(choice?: any, init?: string) {
        if (choice) {
            this.localisation = choice.detail.value;
            this.storage.set('localisation', this.localisation);
            return;
        }
        if (init) {
            this.storage.set('localisation', 'currentLocation');
            return;
        }
    }
}
