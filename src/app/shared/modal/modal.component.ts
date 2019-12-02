import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuroraService } from '../../aurora.service';
import { first, take, takeUntil } from 'rxjs/operators';

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

    @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;

    constructor(private modalController: ModalController, private auroraService: AuroraService) {
    }

    ngOnInit() {
        console.log('eee');



        this.auroraService.getOvations('north').pipe(first()).subscribe(
            e => {
                this.northCanvas = true;
                console.log(e);
            }
        );
    }

    async close() {
        await this.modalController.dismiss();
    }

    ngAfterViewInit(): void {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(0, 0, 5, 5);

    }


}
