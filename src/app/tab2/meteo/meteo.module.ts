import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeteoComponent } from './meteo.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    declarations: [
        MeteoComponent
    ],
    exports: [
        MeteoComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule
    ]
})
export class MeteoModule {
}
