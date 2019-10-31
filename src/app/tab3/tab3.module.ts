import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { HeaderPageModule } from '../header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule,
        HeaderPageModule,
        RouterModule.forChild([{path: '', component: Tab3Page}]),
        IonicStorageModule.forRoot(),
    ],
    declarations: [Tab3Page],
})
export class Tab3PageModule {
}
