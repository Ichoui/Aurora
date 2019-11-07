import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { cities } from '../cities';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

   cities = cities;
    localisation: string;

    constructor(private storage: Storage) {
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


    selectedValue(choice?: any, init?: string) {
        if (choice) {
            this.localisation = choice.detail.value;
            this.storage.set('localisation', this.localisation);
            return;
        }
        if (init){
            this.storage.set('localisation', 'currentLocation');
            return;
        }
    }
}
