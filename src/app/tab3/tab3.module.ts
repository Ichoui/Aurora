import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { HeaderPageModule } from '../shared/header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalModule } from '../shared/modal/modal.module';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule,
        HeaderPageModule,
        ModalModule,
        RouterModule.forChild([{path: '', component: Tab3Page}]),
        IonicStorageModule.forRoot({
            name: '__dbAurora',
            driverOrder: ['indexeddb', 'sqlite', 'websql']
        }),
    ],
    declarations: [Tab3Page],
    providers: [
        InAppBrowser,
        Geolocation,
    ]
})
export class Tab3PageModule {
}
