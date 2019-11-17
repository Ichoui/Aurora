import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

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
        private statusBar: StatusBar
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
        )
    }

    getKp(): void {
        this.storage.get('kp_notif').then(
            kp => this.selectedKp = kp
        );
        this.storage.get('current_kp').then(
            kp => this.currentKp = kp
        );

    }

}
