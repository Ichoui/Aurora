import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    Environment,
    Geocoder,
    GeocoderRequest,
    GeocoderResult,
    GoogleMap,
    GoogleMapOptions,
    GoogleMaps,
    GoogleMapsEvent,
    LatLng,
    Marker
} from '@ionic-native/google-maps';
import { ActivatedRoute } from '@angular/router';
import { cities, CodeLocalisation } from '../models/cities';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
    selector: 'app-location-map',
    templateUrl: './location-map.page.html',
    styleUrls: ['./location-map.page.scss'],
})
export class LocationMapPage implements OnInit, OnDestroy {

    map: GoogleMap;
    marker: Marker;
    addressSelect: {
        locality: string;
        countryCode: string;
        country: string;
    };

    cities = cities;
    localisation: string;
    displayedLocalisationChoice: string;

    constructor(private route: ActivatedRoute,
                private geoloc: Geolocation,
                private navController: NavController,
                private storage: Storage) {
    }


    ngOnInit(): void {
        this.checkStorageLoc();
    }

    ionViewWillEnter(): void {
    }

    ngOnDestroy(): void {
        this.removeMarker();
    }

    /**
     * @param choice Lorsque le Select est modifié, rentre dans la condition pour modifier la valeur de localisation
     * @param position Lorsqu'on ajoute un point sur la carte
     * Permet de pré-remplir le select avec la valeur disponible en storage si elle existe.
     * Met également la valeur en storage pour traitement tab3
     * */
    selectedLoc(choice?: any, position?: LatLng): void {
        if (choice) {
            this.removeMarker();
            console.log(choice);
            this.localisation = choice.detail.value;
            console.log('localis', this.localisation);
            const city = cities.find(res => res.code === choice.detail.value);
            if (city) {
                this.addMarker(city.latitude, city.longitude);
                this.storage.set('localisation', {code: this.localisation, lat: city.latitude, long: city.longitude});
            }
        } else {
            this.localisation = 'marker';
            this.storage.set('localisation', {code: 'marker', lat: position.lat, long: position.lng});
        }
    }

    /**
     * Si storage vide, set valeur à location actuelle ET valeur du select à position actuelle
     * Sinon, set valeur du select à la position indiquée dans storage
     * */
    checkStorageLoc(): void {
        this.storage.get('localisation').then(
            (codeLocation: CodeLocalisation) => {
                if (codeLocation) {
                    this.localisation = codeLocation.code;
                    this.loadMap(codeLocation.lat, codeLocation.long);
                    this.addMarker(codeLocation.lat, codeLocation.long);
                }
            },
            error => console.warn('Il y a un soucis de storage de position', error)
        );
    }


    /**
     * @param lat
     * @param lng
     * Chargement de la carte
     * */
    loadMap(lat: number, lng: number): void {
        Environment.setBackgroundColor('#2a2a2a');
        let mapOptions: GoogleMapOptions = {
            controls: {
                compass: true,
                zoom: true,
                myLocationButton: true,
                indoorPicker: true,
                mapToolbar: true,
                myLocation: true,
            }
        };

        this.map = GoogleMaps.create('map_canvas_select', mapOptions);

        this.map.animateCamera({
            target: {
                lat: lat,
                lng: lng
            },
            zoom: 3,
            duration: 1200
        });

        this.map.on(GoogleMapsEvent.MAP_CLICK)
            .subscribe(
                (params: any[]) => {
                    let latLng: LatLng = params[0];
                    this.removeMarker();
                    this.addMarker(latLng.lat, latLng.lng);
                    this.selectedLoc(null, latLng);
                });
    }

    /**
     * @param lat
     * @param lng
     * Permet de créer un marqueur
     * */
    addMarker(lat, lng): void {

        this.reverseGeocode(lat, lng);

        this.marker = this.map.addMarkerSync({
            icon: 'blue',
            flat: true,
            draggable: true,
            animation: 'DROP',
            position: {
                lat: lat,
                lng: lng
            }
        });

        this.map.animateCamera({
            target: {
                lat: lat,
                lng: lng
            },
            zoom: 3,
            duration: 1200
        });
    }


    /**
     * Permet de retirer le marqueur actuel
     * */
    removeMarker(): void {
        if (this.marker) {
            this.marker.remove();
        }
    }

    /**
     * Géoloc l'utilisateur et place marker sur la map
     * Set en localStorage les coords
     * */
    buttonMyPosition() {
        this.removeMarker();
        this.geoloc.getCurrentPosition().then(resp => {
            this.addMarker(resp.coords.latitude, resp.coords.longitude);
            this.storage.set('localisation', {code: 'currentLocation', lat: resp.coords.latitude, long: resp.coords.longitude});
        }).catch((error) => {
            console.warn('Error getting location', error);
        });
    }

    /**
     * @param lat
     * @param lng
     * Récupérer l'adresse en var globale
     * */
    reverseGeocode(lat: number, lng: number) {
        let options: GeocoderRequest = {
            position: {'lat': lat, 'lng': lng}
        };
        Geocoder.geocode(options).then(
            (results: GeocoderResult[]) => {
                this.addressSelect = {
                    country: results[0].country,
                    countryCode: results[0].countryCode,
                    locality: results[0].locality
                };
                console.log(this.addressSelect);
            });
    }


}
