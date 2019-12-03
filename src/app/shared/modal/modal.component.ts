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

    northCanvas: boolean = false;

    @ViewChild('canvas', {static: false}) canvas: ElementRef<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;

    constructor(private modalController: ModalController, private auroraService: AuroraService) {
    }

    ngOnInit() {
        console.log('eee');
        this.auroraService.getOvations('north').pipe(first()).subscribe(
            (resp: Ovations[]) => {
                this.northCanvas = true;
                this.createCanvas(resp);
            }
        );
    }

    async close() {
        await this.modalController.dismiss();
    }

    ngAfterViewInit(): void {

    }

    createCanvas(resp: Ovations[]) {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        // this.ctx.fillStyle = 'red';
        // this.ctx.fillRect(50, 50, 55, 55);
        const prefixUrl = 'https://services.swpc.noaa.gov/';

        let tab = [
            '/images/animations/ovation-north/ovation/images/swpc_aurora_map_n_20191203_1200.jpg',
            '/images/animations/ovation-north/ovation/images/swpc_aurora_map_n_20191203_1205.jpg',
            '/images/animations/ovation-north/ovation/images/swpc_aurora_map_n_20191203_1210.jpg'
        ];
        const img = new Image();
        img.src = prefixUrl + tab[0];
        // const width = 900;
        // const height = 900;
        this.canvas.nativeElement.width = 800;
        this.canvas.nativeElement.height = 800;
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0);
        };

    }
}
