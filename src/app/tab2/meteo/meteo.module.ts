import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeteoComponent } from './meteo.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
    declarations: [
        MeteoComponent
    ],
    exports: [
        MeteoComponent
    ],
    imports: [
        CommonModule,
        IonicModule
    ]
})
export class MeteoModule {
}
