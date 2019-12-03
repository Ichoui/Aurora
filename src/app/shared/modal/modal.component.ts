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
export class ModalComponent implements OnInit, AfterViewInit {

    @Input() map: string;
    @Input() titleMap: string;

    @Input() globe1: string;
    @Input() globeTitle1: string;

    @Input() globe2: string;
    @Input() globeTitle2: string;

    @Input() cgu: boolean = false;
    @Input() canvasInput: boolean = false;

    canvasModal: string = 'none';

    @ViewChild('canvas', {static: false}) canvas: ElementRef<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;

    constructor(private modalController: ModalController, private auroraService: AuroraService) {
    }

    ngOnInit() {
        console.log('eee');

    }

    async close() {
        await this.modalController.dismiss();
    }

    ngAfterViewInit(): void {

    }

    loadOvations(pole: string) {
        this.auroraService.getOvations(pole).pipe(first()).subscribe(
            (resp: Ovations[]) => {
                this.createCanvas(resp);
            }
        );
    }


    createCanvas(resp: Ovations[]) {
        const prefixUrl = 'https://services.swpc.noaa.gov/';
        let tab = [];
        const img = new Image();
        this.ctx = this.canvas.nativeElement.getContext('2d');

        this.canvas.nativeElement.width = 800;
        this.canvas.nativeElement.height = 800;

        resp.forEach(snapshot => tab.push(snapshot.url));

        let count = 0;
        const incrementImg = setInterval(() => {
        this.canvasModal = 'block';
            img.src = prefixUrl + tab[count];
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0);
            };
            count += 3;
            if (count > tab.length) {
                clearInterval(incrementImg);
                this.canvasModal = 'none';
            }
        }, 300);

    }
}
