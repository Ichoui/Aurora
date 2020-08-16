import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { NavController, Platform } from '@ionic/angular';
import { AuroraService } from '../aurora.service';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { cities, CodeLocalisation, Coords } from '../models/cities';
import { Currently, Daily, Hourly, Unit, Weather } from "../models/weather";
import { ErrorTemplate } from '../tab2/tab2.page';

export interface ErrorTemplate {
  value: boolean;
  message: string;
}

const API_CALL_NUMBER = 1; // nombre de fois où une API est appelé sur cette page

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  loading: boolean = true;
  tabLoading: string[] = [];

  localisation: string;
  // getCode: string;
  coords: Coords;
  city: string;
  country: string;

  eventRefresh: any;

  // Data inputs
  dataCurrentWeather: Currently;
  dataHourly: Hourly[];
  dataSevenDay: Daily[];
  utcOffset: number;

  dataError: ErrorTemplate = {
    value: false,
    message: 'Error ...',
  };

  constructor(
    private geoloc: Geolocation,
    private storage: Storage,
    private navCtrl: NavController,
    private platform: Platform,
    private auroraService: AuroraService,
    private nativeGeo: NativeGeocoder
  ) {}

  ionViewWillEnter() {
    this.loading = true; // buffer constant
    this.tabLoading = [];

    // Cheminement en fonction si la localisation est pré-set ou si géoloc
    this.storage.get('localisation').then(
      (codeLocation: CodeLocalisation) => {
        if (!codeLocation) {
          this.userLocalisation();
          console.log('aa');
        } else if (codeLocation.code === 'currentLocation' || codeLocation.code === 'marker') {
          console.log('bb');
          this.reverseGeoloc(codeLocation.lat, codeLocation.long);
        } else {
          console.log('cc');
          this.chooseExistingCity(codeLocation.code);
        }
      },
      error => {
        console.warn('Local storage error', error);
        this.dataError = {
          value: true,
          message: error,
        };
      }
    );
  }

  /**
   * Seulement premier accès sur cette page
   * Déterminer la localisation actuelle de l'utilisateur
   */
  userLocalisation() {
    this.geoloc
      .getCurrentPosition()
      .then(resp => {
        this.reverseGeoloc(resp.coords.latitude, resp.coords.longitude);
      })
      .catch(error => {
        console.warn('Geolocalisation error', error);
        this.loading = false;
        this.dataError = {
          value: true,
          message: error,
        };
      });
  }

  /**
   * @param lat {number}
   * @param long {number}
   * Si utilisateur a déjà eu accès à cette page / utilisé la tab 3 / rentré coords dans tab3
   * reverseGeocode, retrouve le nom de la ville via Lat/long
   * */
  reverseGeoloc(lat: number, long: number) {
    this.coords = {
      latitude: lat,
      longitude: long,
    };
    this.getForecast(); // TODO pour tricker car reverseGeoloc plante avec cordopute
    /*    this.nativeGeo.reverseGeocode(lat, long).then(
      (res: NativeGeocoderResult[]) => {
        this.city = res[0].locality;
        this.country = res[0].countryName;
        this.getForecast();
      },
      error => {
        console.warn('Reverse geocode error ==> ');
        console.warn(error);
        this.loading = false;

        // if (environment)
        // this.dataError = {
        //   value: true,
        //   message: error,
        // };
      }
    );*/
  }

  /**
   * @param code slug de la ville pour pouvoir récupérer les données liées au code
   * Choisir une des villes pré-enregistrées
   */
  chooseExistingCity(code: string): void {
    const city = cities.find(res => res.code === code);
    this.city = city.ville;
    this.country = city.pays;

    this.coords = {
      latitude: city.latitude,
      longitude: city.longitude,
    };
    this.getForecast();
  }

  /**
   * API OpenWeatherMap
   * 4 variables pour aujourd'hui, les variables vont aux enfants via Input()
   */
  getForecast() {
    this.auroraService.openWeatherMapForecast$(this.coords.latitude, this.coords.longitude, Unit.METRIC).subscribe(
      (res: Weather) => {
        this.dataCurrentWeather = res.current;
        this.dataHourly = res.hourly;
        this.dataSevenDay = res.daily;
        this.utcOffset = res.timezone_offset; // in seconds
        this.trickLoading('1st');
        console.log(res);
      },
      error => {
        console.warn('DarkSky forecast error', error);
        this.loading = false;
        this.dataError = {
          value: true,
          message: error.status + ' ' + error.statusText,
        };
      }
    );
  }

  /**
   * @param count {string}
   * Gère le loader
   * Lorsque tout les appels API sont passés et le tableau égal à la valeur API_CALL_NUMBER, débloque le loader
   * */
  trickLoading(count: string): void {
    this.tabLoading.push(count);
    if (this.tabLoading.length === API_CALL_NUMBER) {
      this.loading = false;
      this.eventRefresh ? this.eventRefresh.target.complete() : '';
    }
  }

  /**
     @param event {event} renvoyé par le rafraichissement
     * Attends les retours des résultats d'API pour retirer l'animation visuelle
     * */
  doRefresh(event) {
    this.tabLoading = [];
    this.eventRefresh = event;
    this.getForecast();
  }
}
