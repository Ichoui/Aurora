import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuroraService } from '../../aurora.service';
import { first, take, takeUntil } from 'rxjs/operators';

export interface Ovations {
    url: string;
}

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

    @Input() map: string;
    @Input() titleMap: string;

    @Input() ovation1: string;
    @Input() ovationTitle1: string;

    @Input() ovation2: string;
    @Input() ovationTitle2: string;

    @Input() cgu: boolean = false;
    @Input() canvasInput: boolean = false;

    canvasModal: string = 'none'; //unused : canvas style

    tabNorth = [];
    minNorth: number = 0;
    maxNorth: number = 0;
    valueNorth: number = 0;

    tabSouth = [];
    minSouth: number = 0;
    maxSouth: number = 0;
    valueSouth: number = 0;


    @ViewChild('canvas', {static: false}) canvas: ElementRef<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;

    constructor(private modalController: ModalController, private auroraService: AuroraService) {
    }

    ngOnInit() {
        this.loadOvationNorth();
        this.loadOvationSouth();
        this.tabNorth.push(this.ovation1);
        this.tabSouth.push(this.ovation2);
    }

    async close() {
        await this.modalController.dismiss();
    }

    northChange(e) {
        console.log('val1', e.detail.value);
        this.valueNorth = e.detail.value;
    }

    southChange(e) {
        console.log('val2', e.detail.value);
        this.valueSouth = e.detail.value;
    }

    loadOvationNorth() {
        this.auroraService.getOvations('north').pipe(first()).subscribe(
            (resp: Ovations[]) => {
                this.maxNorth = resp.length;
                const prefixUrl = 'https://services.swpc.noaa.gov/';
                resp.forEach(snapshot => this.tabNorth.push(prefixUrl + snapshot.url));
                console.log(this.tabNorth[10]);
            }
        );
    }

    loadOvationSouth() {
        this.auroraService.getOvations('south').pipe(first()).subscribe(
            (resp: Ovations[]) => {
                this.maxSouth = resp.length;
                const prefixUrl = 'https://services.swpc.noaa.gov/';
                resp.forEach(snapshot => this.tabSouth.push(prefixUrl + snapshot.url));
                console.log(this.tabSouth[10]);
            }
        );
    }

    createCanvas(resp: Ovations[]) {
        let tab = [];
        const img = new Image();
        this.ctx = this.canvas.nativeElement.getContext('2d');
        const prefixUrl = 'https://services.swpc.noaa.gov/';

        this.canvas.nativeElement.width = 800;
        this.canvas.nativeElement.height = 800;

        resp.forEach(snapshot => tab.push(snapshot.url));

        let count = 0;
        const incrementImg = setInterval(() => {
            // this.canvasModal = 'block';
            img.src = prefixUrl + tab[count];
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0);
            };
            count += 3;
            if (count > tab.length) {
                clearInterval(incrementImg);
                // this.canvasModal = 'none';
            }
        }, 300);

    }
}
