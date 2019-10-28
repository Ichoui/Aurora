import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

    constructor(private geoloc: Geolocation) {
    }

//https://ionicframework.com/docs/native/geolocation
    ngOnInit(): void {
        this.geoloc.getCurrentPosition().then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude
            console.log(resp);
        }).catch((error) => {
            console.log('Error getting location', error);
        });


        let watch = this.geoloc.watchPosition();
        watch.subscribe((data) => {
            console.log(data);
            // data can be a set of coordinates, or an error (if an error occurred).
            // data.coords.latitude
            // data.coords.longitude
        });
    }

}
