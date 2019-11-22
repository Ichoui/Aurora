import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../../shared/modal/modal.component';
import { TranslateService } from '@ngx-translate/core';
import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Kp27day } from '../../models/aurorav2';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {

    kpForecast$ = new BehaviorSubject<Kp27day>(null);

    @Input()
    set kpForecastInput(value: Kp27day) {
        this.kpForecast$.next(value);
    }
    get kpForecastInput() {
        return this.kpForecast$.getValue();
    }

    constructor(private modalController: ModalController, private translateService: TranslateService ) {
    }

    ngOnInit() {
        this.chartForecast();
    }

    async showMap() {
        const modal = await this.modalController.create({
            component: ModalComponent,
            componentProps: {
                map: 'https://v2.api.auroras.live/images/embed/nowcast.png',
                titleMap: this.translateService.instant('tab2.maps.worldmap'),
            }
        });
        return await modal.present();
    }

  async showGlobes() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        globe1: 'https://v2.api.auroras.live/images/ovation-north.jpg',
        globeTitle1: this.translateService.instant('tab2.maps.ovation.north'),
        globe2: 'https://v2.api.auroras.live/images/ovation-south.jpg',
        globeTitle2: this.translateService.instant('tab2.maps.ovation.south'),
      }
    });
    return await modal.present();
  }

  chartForecast() {
        this.kpForecast$.subscribe(
            res => {
                console.log(res);
            }
        );
        // 14 values
      new Chart('kpforecast', {
          type: 'bar',
          plugins: [ChartDataLabels],
          data: {
              labels: ['a','b','c','d','a','b','c','d','a','b','c','d','a','b'],
              datasets: [{
                  data: [1,5,3,8,9,5,4,6,1,5,3,8,9,50],
                  backgroundColor: [
                      'rgba(105, 191, 175, 0.4)',
                      'rgba(105, 191, 175, .8)',
                      'rgba(105, 191, 175, 0.4)',
                      'rgba(105, 191, 175, .8)',
                      'rgba(105, 191, 175, 0.4)',
                      'rgba(105, 191, 175, .8)',
                      'rgba(105, 191, 175, 0.4)',
                      'rgba(105, 191, 175, .8)',
                      'rgba(105, 191, 175, 0.4)',
                      'rgba(105, 191, 175, .8)',
                      'rgba(105, 191, 175, 0.4)',
                      'rgba(105, 191, 175, .8)',
                      'rgba(105, 191, 175, 0.4)',
                      'rgba(105, 191, 175, .8)'
                  ],
                  borderColor: [
                      'rgba(105, 191, 175, 0.4)',
                      'rgba(105, 191, 175, .8)',
                      'rgba(105, 191, 175, 0.4)',
                      'rgba(105, 191, 175, .8)',
                      'rgba(105, 191, 175, 0.4)',
                      'rgba(105, 191, 175, .8)',
                      'rgba(105, 191, 175, 0.4)',
                      'rgba(105, 191, 175, .8)',
                      'rgba(105, 191, 175, 0.4)',
                      'rgba(105, 191, 175, .8)',
                      'rgba(105, 191, 175, 0.4)',
                      'rgba(105, 191, 175, .8)',
                      'rgba(105, 191, 175, 0.4)',
                      'rgba(105, 191, 175, .8)'
                  ],
                  borderWidth: 2,
              }]
          },
          options: {
              responsive: true,
              plugins: {
                  datalabels: {
                      anchor: 'end',
                      align: 'end',
                      color: '#8cffea',
                      font: {
                          family: 'Oswald-SemiBold',
                          size: 15
                      }
                  }
              },
              legend: {
                  display: false
              },
              scales: {
                  xAxes: [{
                      gridLines: {
                          display: false
                      },
                      ticks: {
                          fontColor: '#949494',
                          fontFamily: 'Oswald-SemiBold'
                      }
                  }],
                  yAxes: [{
                      display: false,
                      gridLines: {
                          display: false
                      }
                  }]
              },
              layout: {
                  padding: {
                      top: 30
                  }
              },
              tooltips: {
                  enabled: false
              }
          }
      });

  }
}
