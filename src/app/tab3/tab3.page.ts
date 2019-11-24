import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { cities } from '../models/cities';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Environment, GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsEvent } from '@ionic-native/google-maps';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';


@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

    cities = cities;
    kpindex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    localisation: string;
    notifications: boolean = false;
    notifKp;

    map: GoogleMap;

    constructor(private storage: Storage,
                private router: Router,
                private modalController: ModalController,
                private iab: InAppBrowser) {
    }


    ionViewWillEnter() {
        // this.storageLoc();
        this.storageNotif();
        this.loadMap();
    }


    loadMap(): void {
        Environment.setBackgroundColor('#2a2a2a');
        let mapOptions: GoogleMapOptions = {

            camera: {
                target: {
                    lat: 43.608763,
                    lng: 1.436908
                },
                zoom: 10,
                tilt: 30
            },
            gestures: {
                scroll: false,
                rotate: false,
                zoom: false,
                tilt: false
            }
        };
        // https://stackoverflow.com/questions/44864303/send-data-through-routing-paths-in-angular
        //https://forum.ionicframework.com/t/google-map-native-map-click-event/100269/2
        this.map = GoogleMaps.create('map_canvas', mapOptions);
        this.map.on(GoogleMapsEvent.MAP_CLICK).pipe(
            tap(e => this.router.navigate(['', 'map', {test: 'aa'}]))
        ).subscribe();
    }

 /*   /!**
     * Si storage vide, set valeur à location actuelle ET valeur du select à position actuelle
     * Sinon, set valeur du select à la position indiquée dans storage
     * *!/
    storageLoc(): void {
        this.storage.get('localisation').then(
            localisation => {
                if (localisation === null) {
                    // this.selectedLoc(null, 'currentLocation');
                    this.localisation = 'currentLocation';
                } else {
                    this.localisation = localisation;
                }
            },
            error => console.warn('Il y a un soucis de storage de position', error)
        );
    }*/

    storageNotif(): void {
        this.storage.get('notifications_active').then(
            notif => {
                this.notifications = notif;
                if (notif) this.storageKP();
            },
            error => console.warn('Problème de récupération notification', error)
        );
    }

    storageKP(): void {
        this.storage.get('kp_notif').then(
            kp => {
                this.notifKp = kp;
            },
            error => console.warn('Problème de récupération notification', error)
        );
    }

/*    selectedLoc(choice?: any, init?: string): void {
        if (choice) {
            this.localisation = choice.detail.value;
            this.storage.set('localisation', this.localisation);
            return;
        }
        if (init) {
            this.storage.set('localisation', 'currentLocation');
            return;
        }
    }*/

    activeNotif(e): void {
        this.notifications = e.detail.checked;
        this.storage.set('notifications_active', this.notifications);
    }

    selectedKp(choice?: any): void {
        if (choice) {
            this.notifKp = choice.detail.value;
            this.storage.set('kp_notif', this.notifKp);
        }
    }

    openUrl(url: string): void {
        const options: InAppBrowserOptions = {
            location: 'yes',//Or 'no'
        };
        this.iab.create(url, '_system', options);
    }
}
