import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuroraService } from '../../aurora.service';
import { first, take, takeUntil } from 'rxjs/operators';
import { Event } from '@angular/router';

export interface Ovations {
    url: string;
}

export interface DateTimes {
    hour: string;
    date: string;
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

    tabNorth = [];
    minNorth: number = 0;
    maxNorth: number = 0;
    valueNorth: number = 0;
    datetimeNorth = [];
    HourNorth: string = '00:00';
    DateNorth: string = '01/01';


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

    valueOvationsChange(e, pole: string) {
        pole === 'north' ? this.valueNorth = e.detail.value : this.valueSouth = e.detail.value;
        // décalage de 5 minutes, faut p'tet gérer un truc en plus :) mais marche
        if (this.datetimeNorth.length > 0 && pole === 'north') {
            this.HourNorth = this.datetimeNorth[e.detail.value][0];
            this.DateNorth = this.datetimeNorth[e.detail.value][1];
        }
    }

    loadOvationNorth() {
        this.auroraService.getOvations('north').pipe(first()).subscribe(
            (resp: Ovations[]) => {
                this.maxNorth = resp.length;
                const prefixUrl = 'https://services.swpc.noaa.gov/';
                resp.forEach(snapshot => this.tabNorth.push(prefixUrl + snapshot.url));
                console.log(this.tabNorth[10]);
                this.tabNorth.forEach(e => {
                    const fullUrl = e.split('/');
                    const segmentUrl = fullUrl[9];
                    if (segmentUrl) {
                        const segment_segmented = segmentUrl.split('_');
                        const date = segment_segmented[4];
                        const hourNotFormatted = segment_segmented[5];
                        const hour = hourNotFormatted.split('.');
                        this.formattedData(date, hour[0], 'north');
                    }
                });
            }
        );
    }

    loadOvationSouth() {
        this.auroraService.getOvations('south').pipe(first()).subscribe(
            (resp: Ovations[]) => {
                this.maxSouth = resp.length;
                const prefixUrl = 'https://services.swpc.noaa.gov/';
                resp.forEach(snapshot => this.tabSouth.push(prefixUrl + snapshot.url));
            }
        );
    }

    formattedData(date?: string, hour?: string, pole?) {
        const segment_date = date.split('');
        const day = segment_date[6] + segment_date[7];
        const month = segment_date[4] + segment_date[5];

        const segment_hour = hour.split('');
        const hr = segment_hour[0] + segment_hour[1];
        const min = segment_hour[2] + segment_hour[3];

        if (pole === 'north') {
            const dateNorth = day + '/' + month;
            const hourNorth = hr + ':' + min;
            this.datetimeNorth.push([hourNorth, dateNorth]);
            return;
        }
    }
}
