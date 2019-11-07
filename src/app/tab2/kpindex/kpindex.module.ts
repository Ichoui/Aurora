import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpindexComponent } from './kpindex.component';



@NgModule({
  declarations: [
    KpindexComponent
  ],
  exports: [
    KpindexComponent
  ],
  imports: [
    CommonModule
  ]
})
export class KpindexModule { }
