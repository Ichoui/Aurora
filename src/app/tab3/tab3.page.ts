import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, RendererFactory2, ViewChild, } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CodeLocalisation, Coords } from '../models/cities';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalComponent } from '../shared/modal/modal.component';
import { Language, Languages } from '../models/languages';
import { TranslateService } from '@ngx-translate/core';
import { icon, Map, Marker, marker, tileLayer, ZoomPanOptions } from 'leaflet';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DOCUMENT } from '@angular/common';
import { Browser } from '@capacitor/core';

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page implements AfterViewInit, OnInit {
  kpindex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  localisation: string;
  notifications: boolean = false;
  notifKp;

  marker: Marker;
  coords: Coords = {} as any;
  map: Map;

  language: string = "fr";
  languages: Language[] = Languages;
  private renderer: Renderer2;

  @ViewChild("map_canvas", { static: false }) mapElement: ElementRef;

  constructor(
    private storage: Storage,
    private router: Router,
    private geoloc: Geolocation,
    private navController: NavController,
    private modalController: ModalController,
    private translateService: TranslateService,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private _document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  ngOnInit() {

  // ionViewWillEnter() {
    this.minimapLocation();
    this.getLanguage();
    // this.storageNotif();
  }
  ngAfterViewInit() {
  }

  /**
   *  Si la localisation n'a jamais été remplie, on set avec "currentLocation" && on localise l'utilisateur pour la minimap
   * Sinon charge la map avec les lat/long envoyée depuis la page popup (Marker et Ville Préselectionnées)
   * */
  minimapLocation() {
    // localisation format json ? {code: 'currentlocation', lat: 41.1, long: 10.41} --> pas besoin de call à chaque fois lat et long comme ça...
    this.storage.get("localisation").then((codeLocation: CodeLocalisation) => {
      if (!codeLocation) {
        this.userLocalisation();
      } else {
        this.mapInit(codeLocation.lat, codeLocation.long);
      }
    });
  }

  /**
   * localise l'utilisateur et lance l'affichage de la map
   * */
  userLocalisation() {
    this.geoloc
      .getCurrentPosition()
      .then((resp) => {
        // Geolocation.getCurrentPosition().then((resp) => {
        this.coords = resp.coords;
        this.mapInit(this.coords.latitude, this.coords.longitude);
        this.storage.set("localisation", {
          code: "currentLocation",
          lat: this.coords.latitude,
          long: this.coords.longitude,
        });
      })
      .catch((error) => {
        console.warn("Error getting location", error);
      });
  }

  /**
   * @param lat
   * @param long
   * */
  mapInit(lat?, long?): void {
    let mapOpt: ZoomPanOptions = {
      noMoveStart: false,
      animate: false,
    };

    console.log(lat, long);
    if (lat && long) {
      this.map = new Map("map_canvas").setView([lat, long], 10, mapOpt);
    } else {
      this.map = new Map("map_canvas").setView(
        [43.60803, 1.467292],
        10,
        mapOpt
      );
    }
    this.marker = marker([lat, long], {
      icon: icon({
        iconSize: [25, 25],
        iconUrl: "assets/img/marker-icon.png",
        shadowUrl: "assets/img/marker-shadow.png",
      }),
    }).addTo(this.map);

    this.map.dragging.disable();
    this.map.zoomControl.remove();

    tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        ' <div style="font-size: 1em">&copy;<a href="https://www.openstreetmap.org/copyright">OSM</a></div>',
    }).addTo(this.map);
  }

  async CGU() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        cgu: true,
      },
    });
    return await modal.present();
  }

  /**
   * Sélection de la langue à utiliser et update du storage
   * */
  selectedLanguage(event) {
    this.language = event.detail.value;
    this.translateService.use(this.language);
    this.storage.set("language", this.language);
  }

  getLanguage(): void {
    this.storage.get("language").then((lg) => {
      this.translateService.use(lg);
      this.language = lg;
    });
  }

  // need backend
  // storageNotif(): void {
  //   this.storage.get("notifications_active").then(
  //     (notif) => {
  //       this.notifications = notif;
  //       if (notif) this.storageKP();
  //     },
  //     (error) => console.warn("Problème de récupération notification", error)
  //   );
  // }

  // storageKP(): void {
  //   this.storage.get("kp_notif").then(
  //     (kp) => {
  //       this.notifKp = kp;
  //     },
  //     (error) => console.warn("Problème de récupération notification", error)
  //   );
  // }

  // activeNotif(e): void {
  //   this.notifications = e.detail.checked;
  //   this.storage.set("notifications_active", this.notifications);
  // }

  // selectedKp(choice?: any): void {
  //   if (choice) {
  //     this.notifKp = choice.detail.value;
  //     this.storage.set("kp_notif", this.notifKp);
  //   }
  // }

  /**
   * @param url {string} Url navigable
   * Demande à l'utilisateur d'ouvrir dans l'application au choix le lien
   **/
  openUrl(url: string): void {
    Browser.open({url})
  }
}
