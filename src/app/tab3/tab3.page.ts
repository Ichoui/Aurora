import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

    constructor(private geoloc: Geolocation) {
    }

    ngOnInit(): void {
        this.geoloc.getCurrentPosition().then((resp) => {
            console.log(resp.coords);
        }).catch((error) => {
            console.log('Error getting location', error);
        });


        // let watch = this.geoloc.watchPosition();
        // watch.pipe(first()).subscribe((data) => {
        //     console.log(data.coords);
        // });
    }

}
