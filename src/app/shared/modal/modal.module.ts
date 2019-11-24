import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [ModalComponent],
  exports: [ModalComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  entryComponents: [ModalComponent]
})
export class ModalModule { }
