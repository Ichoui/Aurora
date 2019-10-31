import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    text;
    tabOpen = [];

    constructor(private translateService: TranslateService) {
    }

    visibility(event, index): void {
        if (this.tabOpen.includes(index)) {
            const remove = this.tabOpen.indexOf(index);
            this.tabOpen.splice(remove);
            event.target.nextElementSibling.style.display = 'none';
        } else {
            this.tabOpen.push(index);
            event.target.nextElementSibling.style.display = 'block';
        }
    }
}
