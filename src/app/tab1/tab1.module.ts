import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { HeaderPageModule } from '../header/header.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: Tab1Page}]),
        HeaderPageModule
    ],
    declarations: [Tab1Page],
    providers: []
})
export class Tab1PageModule {
}
