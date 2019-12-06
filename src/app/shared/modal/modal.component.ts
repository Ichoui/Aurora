import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuroraService } from '../../aurora.service';
import { first, take, takeUntil } from 'rxjs/operators';
import { Event } from '@angular/router';

export interface Ovations {
    url: string;
}

export const SWPC_URL_PREFIX = 'https://services.swpc.noaa.gov/';

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

    tabNorth = [];
    minNorth: number = 0;
    maxNorth: number = 0;
    valueNorth: number = 0;
    datetimeNorth = [];
    HourNorth: string = '';
    DateNorth: string = '';

    tabSouth = [];
    minSouth: number = 0;
    maxSouth: number = 0;
    valueSouth: number = 0;
    datetimeSouth = [];
    HourSouth: string = '';
    DateSouth: string = '';

    @ViewChild('canvas', {static: false}) canvas: ElementRef<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;

    constructor(private modalController: ModalController, private auroraService: AuroraService) {
    }

    ngOnInit() {
        if (this.ovation1 && this.ovation2) {
            this.loadOvations('north');
            this.loadOvations('south');
            this.tabNorth.push(this.ovation1);
            this.tabSouth.push(this.ovation2);
        }
    }

    async close(): Promise<void> {
        await this.modalController.dismiss();
    }

    /**
     * @param e {event}
     * @param pole {string}
     * Calcule lorsqu'on bouge l'item ion-range l'image à afficher en fonction de la valeur
     * Même chose pour le timing en dessous de l'image
     * */
    valueOvationsChange(e, pole: string): void {
        pole === 'north' ? this.valueNorth = e.detail.value : this.valueSouth = e.detail.value;
        if (this.datetimeNorth.length > 0 && pole === 'north') {
            this.HourNorth = this.datetimeNorth[e.detail.value][0];
            this.DateNorth = this.datetimeNorth[e.detail.value][1];
            return;
        }
        if (this.datetimeSouth.length > 0 && pole === 'south') {
            this.HourSouth = this.datetimeSouth[e.detail.value][0];
            this.DateSouth = this.datetimeSouth[e.detail.value][1];
            return;
        }
    }

    /**
     * @param pole {string} north / south
     * Récupére le service pour afficher ovation north / south
     * Découpe en segment l'url pour récupérer la date et l'heure avant formattage
     * */
    loadOvations(pole: string): void {
        this.auroraService.getOvations(pole).pipe(first()).subscribe(
            (resp: Ovations[]) => {
                if (pole === 'north') {
                    this.maxNorth = resp.length;
                    this.tabNorth = [];
                    resp.forEach(snapshot => this.tabNorth.push(SWPC_URL_PREFIX + snapshot.url));
                    this.tabNorth.forEach(e => {
                        this.splitDatetime(e, pole);
                    });
                    return;
                }
                if (pole === 'south') {
                    this.maxSouth = resp.length;
                    this.tabSouth = [];
                    resp.forEach(snapshot => this.tabSouth.push(SWPC_URL_PREFIX + snapshot.url));
                    this.tabSouth.forEach(e => {
                        this.splitDatetime(e, pole);
                    });
                    return;
                }
            }
        );
    }

    /**
     * @param dateToSplit {string} url de type SWPC_URL_PREFIX + images/animations/ovation-south/ovation/images/swpc_aurora_map_s_20191205_2205.jpg
     * @param pole {string} North / South
     * Découpe l'url de chaque image contenu dans le callback de chaque ovations
     * */
    splitDatetime(dateToSplit: string, pole?: string): void {
        const fullUrl = dateToSplit.split('/');
        const segmentUrl = fullUrl[9];
        if (segmentUrl) {
            const segment_segmented = segmentUrl.split('_');
            const date = segment_segmented[4];
            const hourNotFormatted = segment_segmented[5];
            const hour = hourNotFormatted.split('.');
            this.formattedDatetime(date, hour[0], pole);
        }
    }

    /**
     * @param date {string} format yyyymmdd
     * @param hour {string} format hhmm
     * @param pole {string} north / south
     * Formatte la date et l'heure pour un affichage clean, à partir d'une string récupérée sur le nom de chaque image
     * */
    formattedDatetime(date: string, hour: string, pole: string): void {
        const segment_date = date.split('');
        const day = segment_date[6] + segment_date[7];
        const month = segment_date[4] + segment_date[5];

        const segment_hour = hour.split('');
        const hr = segment_hour[0] + segment_hour[1];
        const min = segment_hour[2] + segment_hour[3];

        if (pole === 'north') {
            const dateNorth = day + '/' + month;
            const hourNorth = hr + ':' + min;
            this.datetimeNorth.push([hourNorth + ' - ', dateNorth]);
            return;
        }

        if (pole === 'south') {
            const dateSouth = day + '/' + month;
            const hourSouth = hr + ':' + min;
            this.datetimeSouth.push([hourSouth + ' - ', dateSouth]);
            return;
        }
    }
}
