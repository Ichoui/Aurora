import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../../shared/modal/modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {

    constructor(private modalController: ModalController, private translateService: TranslateService ) {
    }

    ngOnInit() {
    }

    async showMap() {
        const modal = await this.modalController.create({
            component: ModalComponent,
            componentProps: {
                map: 'https://v2.api.auroras.live/images/embed/nowcast.png',
                titleMap: this.translateService.instant('tab2.maps.worldmap'),
            }
        });
        return await modal.present();
    }

  async showGlobes() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        globe1: 'https://v2.api.auroras.live/images/ovation-north.jpg',
        globeTitle1: this.translateService.instant('tab2.maps.ovation.north'),
        globe2: 'https://v2.api.auroras.live/images/ovation-south.jpg',
        globeTitle2: this.translateService.instant('tab2.maps.ovation.south'),
      }
    });
    return await modal.present();
  }
}
