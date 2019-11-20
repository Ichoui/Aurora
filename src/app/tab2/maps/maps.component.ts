import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {

    constructor(public modalController: ModalController) {
    }

    ngOnInit() {
    }

    async showMap() {
        const modal = await this.modalController.create({
            component: ModalComponent,
            componentProps: {
                map: 'https://v2.api.auroras.live/images/embed/nowcast.png',
                titleMap: 'Carte live des Aurores',
            }
        });
        return await modal.present();
    }

  async showGlobes() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        globe1: 'https://v2.api.auroras.live/images/ovation-north.jpg',
        globeTitle1: 'Carte Pole Nord',
        globe2: 'https://v2.api.auroras.live/images/ovation-south.jpg',
        globeTitle2: 'Carte Pole Sud',
      }
    });
    return await modal.present();
  }
}
