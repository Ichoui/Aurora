import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cities, CodeLocalisation } from '../../models/cities';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Control, control, icon, LatLng, Map, marker, Marker, tileLayer, ZoomPanOptions } from 'leaflet';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.page.html',
  styleUrls: ['./location-map.page.scss'],
})
export class LocationMapPage implements OnInit, OnDestroy {
  map: Map;
  marker: Marker;
  cities = cities;
  localisation: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private geoloc: Geolocation,
    private geocode: NativeGeocoder,
    private navController: NavController,
    private translate: TranslateService,
    private storage: Storage
  ) {}

  ngOnInit(): void {
    this.checkStorageLoc();
  }

  ngOnDestroy(): void {
    this.removeMarker();
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
      this.localisation = choice.detail.value;
      // console.log(choice);
      // console.log('localis', this.localisation);
      const city = cities.find(res => res.code === choice.detail.value);
      if (city) {
        this.storage.set('localisation', {
          code: this.localisation,
          lat: city.latitude,
          long: city.longitude,
        });
        this.addMarker(city.latitude, city.longitude);
      }
    } else {
      this.localisation = 'marker';
      this.storage.set('localisation', {
        code: 'marker',
        lat: position.lat,
        long: position.lng,
      });
      this.addMarker(position.lat, position.lng);
    }
  }

  /**
   * @param lat {number}
   * @param long {number}
   * Chargement de la carte
   * */
  loadMap(lat: number, long: number): void {
    let mapOpt: ZoomPanOptions = {
      animate: true,
      duration: 1.2,
    };
    this.map = new Map('map_canvas_select').setView([lat, long], 3, mapOpt);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' <div style="font-size: 1em">&copy;<a href="https://www.openstreetmap.org/copyright">OSM</a></div>',
    }).addTo(this.map);

    this.addMarker(lat, long);

    this.map.on('click', params => {
      let latLng: LatLng = params['latlng'];
      this.selectedLoc(null, latLng);
    });
  }

  /**
   * @param lat {number}
   * @param long {number}
   * Permet de créer un marqueur
   * */
  addMarker(lat, long): void {
    this.removeMarker();

    this.reverseGeocode(lat, long);

    this.marker = marker([lat, long], {
      draggable: false,

      icon: icon({
        iconSize: [45, 45],
        iconUrl: 'assets/img/marker-icon.png',
      }),
    }).addTo(this.map);
  }

  /**
   * Permet de retirer le marqueur actuel
   * */
  removeMarker(): void {
    if (this.marker) this.marker.remove();
  }

  /**
   * Géoloc l'utilisateur et place marker sur la map
   * Set en localStorage les coords
   * */
  buttonMyPosition() {
    this.removeMarker();
    this.geoloc
      .getCurrentPosition()
      .then(resp => {
        this.addMarker(resp.coords.latitude, resp.coords.longitude);
        this.storage.set('localisation', {
          code: 'currentLocation',
          lat: resp.coords.latitude,
          long: resp.coords.longitude,
        });
      })
      .catch(error => {
        console.warn('Error getting current location', error);
      });
  }

  /**
   * @param lat {number}
   * @param long {number}
   * Récupérer l'adresse de l'emplacement est affiche un tooltip
   * */
  reverseGeocode(lat: number, long: number) {
    let options: NativeGeocoderOptions = {
      useLocale: false,
      maxResults: 2,
    };
    this.geocode
      .reverseGeocode(lat, long, options)
      .then((locale: NativeGeocoderResult[]) => {
        let infoWindow;
        if (locale[0].locality && locale[0].countryName) {
          // Ville - CODE
          infoWindow = locale[0].locality + ' - ' + locale[0].countryName;
        } else if (locale[0].countryName && !locale[0].locality && locale[0].administrativeArea) {
          // Des régions un peu lointaine
          infoWindow = locale[0].administrativeArea + ' - ' + locale[0].countryName;
        } else {
          locale[0].countryName ? (infoWindow = locale[0].countryName) : (infoWindow = this.translate.instant('global.unknown'));
        }
        this.createTooltip(infoWindow, lat, long);
      })
      .catch(err => {
        console.error('Error localisation', err);
        const infoWindow = this.translate.instant('global.unknown');
        this.createTooltip(infoWindow);
      });
  }

  /**
   * @param infoWindow {string}
   * @param lat {number}
   * @param long {number}
   * Affiche le tooltip
   * */
  createTooltip(infoWindow: string, lat?, long?) {
    if (lat && long) {
      this.marker
        .bindPopup(`<b>${infoWindow}</b> <br /> Lat: ${lat} <br/> Long: ${long}`)
        .openPopup()
        .on('click', () => {
          // console.log('clic on tooltip');
          this.router.navigate(['', 'tabs', 'tab1']);
        });
    } else {
      this.marker.bindPopup(`<b>${infoWindow}</b><br /> ${this.translate.instant('tab3.map.another')} `).openPopup();
    }
  }
}
