import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CodeLocalisation, Coords } from '../models/cities';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Environment, GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsEvent } from '@ionic-native/google-maps';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { mapStyle } from '../../map-style';
import { ModalComponent } from '../shared/modal/modal.component';


@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

    kpindex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    localisation: string;
    notifications: boolean = false;
    notifKp;

    coords: Coords = {} as any;
    map: GoogleMap;

    constructor(private storage: Storage,
                private router: Router,
                private geoloc: Geolocation,
                private navController: NavController,
                private modalController: ModalController,
                private iab: InAppBrowser) {
    }

    ionViewWillEnter() {
        this.minimapLocation();
        this.storageNotif();
    }

    /**
     *  Si la localisation n'a jamais été remplie, on set avec "currentLocation" && on localise l'utilisateur pour la minimap
     * Sinon charge la map avec les lat/long envoyée depuis la page popup (Marker et Ville Préselectionnées)
     * */
    minimapLocation() {
        // localisation format json ? {code: 'currentlocation', lat: 41.1, long: 10.41} --> pas besoin de call à chaque fois lat et long comme ça...
        this.storage.get('localisation').then(
            (codeLocation: CodeLocalisation) => {
                console.log(codeLocation);
                if (!codeLocation) {
                    console.log('??');
                    this.userLocalisation();
                } else {
                    console.log(' cc ');
                    this.loadMap(codeLocation.lat, codeLocation.long);
                }
            }
        );
    }

    /**
     * localise l'utilisateur et lance l'affichage de la map
     * */
    userLocalisation() {
        this.geoloc.getCurrentPosition().then((resp) => {
            this.coords = resp.coords;
            this.loadMap(this.coords.latitude, this.coords.longitude);
            this.storage.set('localisation', {code: 'currentLocation', lat: this.coords.latitude, long: this.coords.longitude});
        }).catch((error) => {
            console.warn('Error getting location', error);
        });
    }


    /**
     * @param lat
     * @param long
     * */
    loadMap(lat?, long?): void {
        Environment.setBackgroundColor('#2a2a2a');

        let mapOptions: GoogleMapOptions = {
            controls: {
                compass: false
            },
            camera: {
                target: {
                    lat: lat,
                    lng: long
                },
                zoom: 10,
                tilt: 90
            },
            gestures: {
                scroll: false,
                rotate: false,
                zoom: false,
                tilt: false
            },
            styles: mapStyle,
        };
        this.map = GoogleMaps.create('map_canvas', mapOptions);
        this.map.on(GoogleMapsEvent.MAP_CLICK).pipe(
            tap(e => this.navController.navigateRoot(['', 'map']))
        ).subscribe();

    }

    async CGU() {
        const modal = await this.modalController.create({
            component: ModalComponent,
            componentProps: {
                cgu: true,
            }
        });
        return await modal.present();
    }

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
