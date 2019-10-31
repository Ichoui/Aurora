import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

    @ViewChild('test', {static: false}) test;

    constructor() {
    }

    ngOnInit(): void {
        this.interval();
    }

    /*
    * Permet d'afficher le logo Aurora
    * tag <a> est dans shadowRoot et ne se charge pas immédiatement
    * Interval enchaîne les itérations jusqu'à ce qu'il existe et s'arrête
    * */
    interval(): void {
        let inter = setInterval(() => {
            let fuckingA = this.test.el.shadowRoot.querySelector('a'); // null
            if (fuckingA !== null) {
                fuckingA.style.overflow = 'visible';
                clearInterval(inter);
            }
        }, 50);
    }


}
