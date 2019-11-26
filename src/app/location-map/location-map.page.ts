import { Component, OnInit } from '@angular/core';
import { Environment, GoogleMap, GoogleMapOptions, GoogleMaps, Marker } from '@ionic-native/google-maps';
import { ActivatedRoute } from '@angular/router';
import { cities, CodeLocalisation } from '../models/cities';
import { Storage } from '@ionic/storage';


@Component({
    selector: 'app-location-map',
    templateUrl: './location-map.page.html',
    styleUrls: ['./location-map.page.scss'],
})
export class LocationMapPage implements OnInit {

    map: GoogleMap;
    cities = cities;
    localisation: string;

    constructor(private route: ActivatedRoute, private storage: Storage) {
    }

    ionViewWillEnter() {
        const test = this.route.snapshot.paramMap.get('test');
        console.log(test);
        this.storageLoc();
        this.loadMap();
    }

    ngOnInit() {
        // const test = this.route.snapshot.paramMap.get('test');
        // console.log(test);
        // this.loadMap();
    }


    /**
     * @param choice Lorsque le Select est modifié, rentre dans la condition pour modifier la valeur de localisation
     * @param init Si la localisation n'a jamais été remplie, on set avec "currentLocation"
     * Permet de pré-remplir le select avec la valeur disponible en storage si elle existe.
     * */
    selectedLoc(choice?: any): void {
        if (choice) {
            this.localisation = choice.detail.value;
            console.log(this.localisation);
            // this.storage.set('localisation', this.localisation);
            this.storage.set('localisation', {code: this.localisation, lat: null, long:null});
            return;
        }
    }

    /**
     * Si storage vide, set valeur à location actuelle ET valeur du select à position actuelle
     * Sinon, set valeur du select à la position indiquée dans storage
     * */
    storageLoc(): void {
        this.storage.get('localisation').then(
            (codeLocation: CodeLocalisation) => {
                if (codeLocation) {
                    this.localisation = codeLocation.code;
                }
            },
            error => console.warn('Il y a un soucis de storage de position', error)
        );
    }

    /**
     * Chargement de la carte
     * */
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
            }
        };

        this.map = GoogleMaps.create('map_canvas_select', mapOptions);
        let marker: Marker = this.map.addMarkerSync({
            title: 'Ionic',
            icon: 'blue',
            animation: 'DROP',
            position: {
                lat: 43.608763,
                lng: 1.436908
            }
        });
    }

}
