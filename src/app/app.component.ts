import { Component } from '@angular/core';

import { AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Notifications } from './notifications';
import { AuroraService } from './aurora.service';
import { Environment } from '@ionic-native/google-maps';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    selectedKp: number;
    currentKp: number;

    constructor(
        private platform: Platform,
        private translateService: TranslateService,
        private splashScreen: SplashScreen,
        private storage: Storage,
        private statusBar: StatusBar,
        private oneSignal: OneSignal,
        private alertCtrl: AlertController,
        private auroraService: AuroraService
    ) {
        this.initializeApp();


    }

    initializeApp() {
        this.platform.ready().then(() => {
            // this.statusBar.styleLightContent();
            // this.statusBar.backgroundColorByHexString('#2a2a2a');
            // this.splashScreen.hide();
            // Environment.setBackgroundColor('#2a2a2a'); // Permet d'éviter un soucis de couleur d'affichage dûe à gmap

            this.translateService.addLangs(['fr', 'en']);
            this.getLanguage();

            // this.getKp();
            // this.isNotifsActive();
            // const notificationFile = new Notifications(this.platform, this.oneSignal, this.auroraService, this.alertCtrl);
            // notificationFile.isCordova();
            // notificationFile.invokePush()
        });
    }

    isNotifsActive(): void {
        this.storage.get('notifications_active').then(
            notifs => {
                if (notifs) {
                    console.log(this.selectedKp);
                    console.log(this.currentKp);
                    if (this.selectedKp === this.currentKp && this.selectedKp !== undefined) {
                        console.log('Cool');
                    } else {
                        console.log('PAS Cool');
                    }
                }
            }
        );
    }

    getKp(): void {
        this.storage.get('kp_notif').then(
            kp => this.selectedKp = kp
        );
        this.storage.get('current_kp').then(
            kp => this.currentKp = kp
        );

    }

    getLanguage(): void {
        this.storage.get('language').then(
            lg => {
                if (lg) {
                    this.translateService.setDefaultLang(lg);
                    this.storage.set('language', lg);
                } else {
                    this.translateService.setDefaultLang('fr');
                    this.storage.set('language', 'fr');
                }
            },
            noValue => {
                this.storage.set('language', 'fr');
                console.log('novalue', noValue);
            }
        );
    }

}
