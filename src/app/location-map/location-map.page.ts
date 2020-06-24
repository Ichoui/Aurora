import { Component, OnDestroy, OnInit } from '@angular/core';
import { Environment, Geocoder, GeocoderRequest, GeocoderResult, GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsEvent, LatLng, Marker } from '@ionic-native/google-maps/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { cities, CodeLocalisation } from '../models/cities';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { mapStyle } from '../../map-style';

@Component({
    selector: 'app-location-map',
    templateUrl: './location-map.page.html',
    styleUrls: ['./location-map.page.scss'],
})
export class LocationMapPage implements OnInit, OnDestroy {

    map: GoogleMap;
    marker: Marker;
    cities = cities;
    localisation: string;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private geoloc: Geolocation,
                private navController: NavController,
                private storage: Storage) {
    }


    ngOnInit(): void {
        this.removeMarker();
        console.log();
        this.checkStorageLoc();

    }

    ionViewWillEnter(): void {
    }

    ionViewDidLeave() {
        // this.removeMarker();
    }

    ngOnDestroy(): void {
        this.removeMarker();
    }
    // test() {
    //     console.log('ccc');
    //     this.removeMarker();
    //
    // }


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
     * @param choice {any} Lorsque le Select est modifié, rentre dans la condition pour modifier la valeur de localisation
     * @param position {LatLng} Lorsqu'on ajoute un point sur la carte
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
     * @param lat {number}
     * @param lng {number}
     * Chargement de la carte
     * */
    loadMap(lat: number, lng: number): void {
        console.log(lat, lng);
        // Environment.setBackgroundColor('#2a2a2a');
        let mapOptions: GoogleMapOptions = {
            controls: {
                compass: true,
                zoom: true
            },
            styles: mapStyle
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

        this.map.on(GoogleMapsEvent.MAP_LONG_CLICK)
            .subscribe(
                (params: any[]) => {
                    let latLng: LatLng = params[0];
                    this.removeMarker();
                    this.addMarker(latLng.lat, latLng.lng);
                    this.selectedLoc(null, latLng);
                });
    }

    /**
     * @param lat {number}
     * @param lng {number}
     * Permet de créer un marqueur
     * */
    addMarker(lat, lng): void {

        this.reverseGeocode(lat, lng);

        this.marker = this.map.addMarkerSync({
            icon: 'blue',
            flat: true,
            draggable: false,
            animation: 'DROP',
            styles: {
                'font-weight': 'bold',
            },
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
            console.warn('Error getting current location', error);
        });
    }

    /**
     * @param lat {number}
     * @param lng {number}
     * Récupérer l'adresse de l'emplacement est affiche un tooltip
     * */
    reverseGeocode(lat: number, lng: number) {
        let options: GeocoderRequest = {
            position: {'lat': lat, 'lng': lng}
        };
        Geocoder.geocode(options).then(
            (locale: GeocoderResult[]) => {
                let infoWindow;
                if (locale.length === 0) {
                    infoWindow = 'Localisation inconnue';
                } else {
                    if (locale[0].locality && locale[0].country) {
                        // Ville - CODE
                        infoWindow = locale[0].locality + ' - ' + locale[0].country;
                    } else if (locale[0].country && !locale[0].locality && locale[0].subAdminArea) {
                        // Des régions un peu lointaine
                        infoWindow = locale[0].subAdminArea + ' - ' + locale[0].country;
                    } else {
                        // Dans un océan
                        infoWindow = locale[0].extra.featureName;
                    }
                }
                this.marker.setTitle(infoWindow);
                this.marker.setSnippet(`Lat: ${lat}\nLng: ${lng}`);
                this.marker.showInfoWindow();
                this.marker.on(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
                    this.router.navigate(['', 'tabs', 'tab2']);
                });
            });
    }


}
