import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { City } from '../models';


@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

    cities: City[] = [
        {
            'code': 'mtl',
            'label': 'Montréal - CA',
        },
        {
            'code': 'qc',
            'label': 'Québec - CA',
        },
        {
            'code': 'sgn',
            'label': 'Saguenay - CA',
        },
        {
            'code': 'bff',
            'label': 'Banff - CA',

        },
        {
            'code': 'edm',
            'label': 'Edmonton - CA',
        },
        {

            'code': 'ylk',
            'label': 'Yellowknife - CA',
        },
        {

            'code': 'jsp',
            'label': 'Jasper - CA',
        },
        {
            'code': 'bgn',
            'label': 'Bergen - NO',
        },
        {

            'code': 'trm',
            'label': 'Tromso - NO',
        },
        {
            'code': 'ryk',
            'label': 'Reykjavik - ISL',
        }
    ];

    constructor(private storage: Storage) {
    }

    ionViewWillEnter() {
        this.storage.set('localisation', 'current')
    }
}
