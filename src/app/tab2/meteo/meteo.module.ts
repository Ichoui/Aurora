import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeteoComponent } from './meteo.component';


@NgModule({
    declarations: [
        MeteoComponent
    ],
    exports: [
        MeteoComponent
    ],
    imports: [
        CommonModule
    ]
})
export class MeteoModule {
}
