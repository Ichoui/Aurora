import { Component } from '@angular/core';

import { AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { OneSignal } from '@ionic-native/onesignal/ngx';
import { GOOGLE_PROJECT_NUMBER, ONESIGNAL_APP_ID } from '../environments/keep';


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
        private alertCtrl: AlertController
    ) {
        this.initializeApp();
        translateService.setDefaultLang('fr');
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleLightContent();
            this.statusBar.backgroundColorByHexString('#2a2a2a');
            this.splashScreen.hide();
            this.getKp();
            this.isNotifsActive();

            if (this.platform.is('cordova')) {
                this.setupPush();
            }

            // const notificationOpenedCallback = function (jsonData) {
            //     console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            // };
            // const notificationReceivedCallback = function (jsonData) {
            //     console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            // };
            //
            // window['plugins'].OneSignal
            //     .startInit(ONESIGNAL_APP_ID, GOOGLE_PROJECT_NUMBER)
            //     .handleNotificationOpened(notificationOpenedCallback)
            //     .handleNotificationReceived(notificationReceivedCallback)
            //     .endInit();

            // soit c'est l'un soit c'est l'autre

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



    setupPush() {
        // //I recommend to put these into your environment.ts
            this.oneSignal.startInit(ONESIGNAL_APP_ID, GOOGLE_PROJECT_NUMBER);

        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

            // Notifcation was received in general
            this.oneSignal.handleNotificationReceived().subscribe(data => {
                console.log(data);
                let msg = data.payload.body;
                let title = data.payload.title;
                // let additionalData = data.payload.additionalData;
                // console.log(additionalData);
                this.showAlert(title, msg);
            });
        console.log(this.oneSignal);

            // Notification was really clicked/opened
            this.oneSignal.handleNotificationOpened().subscribe(data => {
                // Just a note that the data is a different place here!
                let additionalData = data.notification.payload.additionalData;

                this.showAlert('Notification opened', 'You already read this before', additionalData.task);
            });

            this.oneSignal.endInit();
        }

        async showAlert(title, msg, task?) {
        console.log('?');
            const alert = await this.alertCtrl.create({
                header: title,
                subHeader: msg,
                buttons: [
                    {
                        text: `OK`,
                        handler: e => {
                            console.log(e);
                            // E.g: Navigate to a specific screen
                        }
                    }
                ]
            });
            alert.present();
    }
}
