import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapsComponent } from './maps.component';
import { ModalModule } from '../../shared/modal/modal.module';


@NgModule({
    declarations: [MapsComponent],
    imports: [
        CommonModule,
        ModalModule
    ],
    exports: [
        MapsComponent
    ]
})
export class MapsModule {
}
