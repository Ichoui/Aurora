import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SettingsPage } from './settings.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderPageModule } from '../../shared/header/header.module';
import { ModalModule } from '../../shared/modal/modal.module';
import { Tab3Page } from '../tab3.page';
import { IonicStorageModule } from '@ionic/storage';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FormsModule,
    TranslateModule,
    HeaderPageModule,
    ModalModule,
    IonicStorageModule.forRoot({
      name: '__dbAurora',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
  ],
  declarations: [SettingsPage],
  providers: [
    Geolocation
  ]
})
export class SettingsPageModule {}
