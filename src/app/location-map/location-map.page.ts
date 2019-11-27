import { Component } from '@angular/core';
import { Environment, Geocoder, GeocoderRequest, GeocoderResult, GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsEvent, LatLng, Marker } from '@ionic-native/google-maps';
import { ActivatedRoute } from '@angular/router';
import { cities, CodeLocalisation } from '../models/cities';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';


@Component({
    selector: 'app-location-map',
    templateUrl: './location-map.page.html',
    styleUrls: ['./location-map.page.scss'],
})
export class LocationMapPage {

    map: GoogleMap;
    marker: Marker;
    addressSelect: {
        locality: string;
        countryCode: string;
        country: string;
    };

    cities = cities;
    localisation: string;

    constructor(private route: ActivatedRoute,
                private navController: NavController,
                private storage: Storage) {
    }

    ionViewWillEnter() {
        this.checkStorageLoc();
        this.loadMap();
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
            if (this.localisation === 'currentLocation') {
                this.storage.remove('localisation');
                return;
            }
            const city = cities.find(res => res.code === choice.detail.value);
            if (city) {
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
                zoom: 5,
                tilt: 0
            }
        };

        this.map = GoogleMaps.create('map_canvas_select', mapOptions);
        this.map.on(GoogleMapsEvent.MAP_CLICK)
            .subscribe(
                (params: any[]) => {
                    let latLng: LatLng = params[0];
                    this.removeMarker();
                    this.addMarker(latLng);
                    this.selectedLoc(null, latLng);
                });
    }

    /**
     * @param position Valeurs lat & lng
     * Permet de créer un marqueur
     * */
    addMarker(position): void {
        let options: GeocoderRequest = {
            position: {'lat': position.lat, 'lng': position.lng}
        };
        Geocoder.geocode(options)
            .then((results: GeocoderResult[]) => {
                console.log(results);
                this.addressSelect = {
                    country: results[0].country,
                    countryCode: results[0].countryCode,
                    locality: results[0].locality
                };
                console.log(this.addressSelect);
            });

        this.marker = this.map.addMarkerSync({
            title: (this.addressSelect && this.addressSelect.locality) || 'Localisation sélectionnée',
            snippet: `Lat: ${position.lat}\nLong: ${position.lng}`,
            icon: 'blue',
            flat: true,
            draggable: true,
            animation: 'DROP',
            position: {
                lat: position.lat,
                lng: position.lng
            }
        });
    }


    /*
    * Permet de retirer le marqueur actuel
    * */
    removeMarker(): void {
        if (this.marker) {
            this.marker.remove();
        }
    }
}
