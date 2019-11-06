import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { HeaderPageModule } from '../header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule,
        IonicStorageModule.forRoot({
            name: '__dbAurora',
            driverOrder: ['indexeddb', 'sqlite', 'websql']
        }),
        RouterModule.forChild([{path: '', component: Tab2Page}]),
        HeaderPageModule
    ],
    declarations: [Tab2Page],
    providers: [
        Geolocation,
        NativeGeocoder
    ]
})
export class Tab2PageModule {
}
