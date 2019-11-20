import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { HeaderPageModule } from '../shared/header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { MeteoModule } from './meteo/meteo.module';
import { KpindexModule } from './kpindex/kpindex.module';
import { MapsModule } from './maps/maps.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule,
        RouterModule.forChild([{path: '', component: Tab2Page}]),
        HeaderPageModule,
        MeteoModule,
        KpindexModule,
        MapsModule
    ],
    declarations: [Tab2Page],
    providers: [
        Geolocation,
        NativeGeocoder
    ]
})
export class Tab2PageModule {
}
