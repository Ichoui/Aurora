import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Plugins } from '@capacitor/core';

const { StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  selectedKp: number;
  currentKp: number;

  constructor(private platform: Platform, private translateService: TranslateService, private splashScreen: SplashScreen, private storage: Storage) {
    this.initializeApp();
  }

  initializeApp() {
    if (this.platform.is('hybrid')) StatusBar.setBackgroundColor({ color: '#69BFAF' }).then();
    this.platform.ready().then(() => {
      this.translateService.addLangs(['fr', 'en']);
      this.getLanguage();
      this.getUnit();

      // this.getKp();
      // this.isNotifsActive();
    });
  }

  isNotifsActive(): void {
    this.storage.get('notifications_active').then(notifs => {
      if (notifs) {
        console.log(this.selectedKp);
        console.log(this.currentKp);
        if (this.selectedKp === this.currentKp && this.selectedKp !== undefined) {
          console.log('Cool');
        } else {
          console.log('PAS Cool');
        }
      }
    });
  }

  getKp(): void {
    this.storage.get('kp_notif').then(kp => (this.selectedKp = kp));
    this.storage.get('current_kp').then(kp => (this.currentKp = kp));
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
        console.log('novalue of language', noValue);
      }
    );
  }

  getUnit(): void {
    this.storage.get('unit').then(
      unit => {
        if (unit) {
          this.storage.set('unit', unit);
        } else {
          this.storage.set('unit', 'metric');
        }
      },
      noValue => {
        this.storage.set('unit', 'metric');
        console.log('novalue of units', noValue);
      }
    );
  }
}
