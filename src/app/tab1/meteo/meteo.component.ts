import { Component, Input, OnInit } from '@angular/core';
import { Coords } from '../../models/cities';
import * as moment from 'moment';
import 'moment/locale/fr';
import { Cloudy, Currently, Daily, DataDaily, Hourly } from '../../models/weather';
import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.scss'],
})
export class MeteoComponent implements OnInit {
  // INPUTs
  @Input() coords: Coords;

  @Input()
  set currentWeatherInput(value: Currently) {
    this.currentWeather$.next(value);
  }

  get currentWeatherInput() {
    return this.currentWeather$.getValue();
  }

  @Input()
  set hourlyWeatherInput(value: Hourly) {
    this.hourlyWeather$.next(value);
  }

  get hourlyWeatherInput() {
    return this.hourlyWeather$.getValue();
  }

  @Input()
  set sevenDayWeatherInput(value: Daily) {
    this.sevenDayWeather$.next(value);
  }

  get sevenDayWeatherInput() {
    return this.sevenDayWeather$.getValue();
  }

  @Input() utc: number;

  // Observable
  currentWeather$ = new BehaviorSubject<Currently>(null);
  hourlyWeather$ = new BehaviorSubject<Hourly>(null);
  sevenDayWeather$ = new BehaviorSubject<Daily>(null);

  // Var reflettant observables
  currentWeather: Currently;

  sunset;
  sunrise;
  actualDate: any;

  dataNumberInCharts: number = 8;
  temps: number[] = [];
  nextHours = [];

  cloudy: Cloudy[] = [];
  days: DataDaily[] = [];

  // lotties
  lottieConfig: Object;
  anim: any;

  language: string;

  constructor(private storage: Storage) {}

  ngOnInit() {
    this.todayForecast();
    this.nextHoursForecast();
    this.sevenDayForecast();
    this.getLanguage();
  }

  getLanguage(): void {
    this.storage.get('language').then(lg => (this.language = lg));
  }

  todayForecast() {
    this.currentWeather$.subscribe((res: Currently) => {
      // console.log(res);
      this.currentWeather = res;
      // this.lotties(this.currentWeather.icon);
      this.calculateLotties(this.currentWeather);
      this.actualDate = this.manageDates(res.time, 'dddd DD MMMM, HH:mm:ss');
    });
  }

  nextHoursForecast() {
    let i = 0;
    this.hourlyWeather$.subscribe((res: Hourly) => {
      res.data.forEach(hours => {
        if (this.temps.length < this.dataNumberInCharts && i % 2 === 0) {
          this.temps.push(Math.round(hours.temperature));
          this.nextHours.push(this.manageDates(hours.time, 'HH:mm'));
        }
        const cloudy: Cloudy = {
          percent: hours.cloudCover,
          time: this.manageDates(hours.time, 'HH:mm'),
        };
        if (this.cloudy.length < 8) {
          this.cloudy.push(cloudy);
        }
        i++;
      });
    });
    new Chart('next-hours', {
      type: 'line',
      plugins: [ChartDataLabels],
      data: {
        labels: this.nextHours,
        datasets: [
          {
            data: this.temps,
            backgroundColor: [
              'rgba(105, 191, 175, 0.4)',
              'rgba(105, 191, 175, 0.4)',
              'rgba(105, 191, 175, 0.4)',
              'rgba(105, 191, 175, 0.4)',
              'rgba(105, 191, 175, 0.4)',
              'rgba(105, 191, 175, 0.4)',
              'rgba(105, 191, 175, 0.4)',
              'rgba(105, 191, 175, 0.4)',
            ],
            borderColor: [
              'rgba(140, 255, 234, 0.4)',
              'rgba(105, 191, 175, 0.4)',
              'rgba(105, 191, 175, 0.4)',
              'rgba(105, 191, 175, 0.4)',
              'rgba(105, 191, 175, 0.4)',
              'rgba(105, 191, 175, 0.4)',
              'rgba(105, 191, 175, 0.4)',
              'rgba(105, 191, 175, 0.4)',
            ],
            borderWidth: 2,
            pointBorderWidth: 3,
            pointHitRadius: 10,
            pointHoverBackgroundColor: '#8cffea',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            align: 'end',
            color: '#8cffea',
            font: {
              family: 'Oswald-SemiBold',
              size: 15,
            },
            formatter: function (value) {
              return value + '°';
            },
          },
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                fontColor: '#949494',
                fontFamily: 'Oswald-SemiBold',
              },
            },
          ],
          yAxes: [
            {
              display: false,
              gridLines: {
                display: false,
              },
            },
          ],
        },
        layout: {
          padding: {
            top: 30,
          },
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }

  sevenDayForecast() {
    const today = moment().add(0, 'd');

    this.sevenDayWeather$.subscribe((res: Daily) => {
      res.data.forEach(day => {
        // Permet de calculer dans le jour en cours sunset/sunrise
        if (this.manageDates(day.time, 'MM DD') === today.format('MM DD')) {
          this.sunset = this.manageDates(day.sunsetTime, 'H:mm');
          this.sunrise = this.manageDates(day.sunriseTime, 'H:mm');
        }
        day.date = this.manageDates(day.time, 'ddd');
        this.days.push(day);
      });
    });
  }

  /**
   * Permet de gérer les dates qui sont au format Unix Timestamp (seconds)
   * @param date {number} Date retournée par l'API
   * @param format {string} Permet de choisir le formatage de la date. (ex: YYYY MM DD)
   * .utc() pour gérer l'heure au format UTC et Input() Offset pour ajouter/soustraires les heures
   * */
  manageDates(date: number, format?: string): string | moment.Moment {
    let unixToLocal;
    if (this.language === 'fr') {
      unixToLocal = moment.unix(date).utc().add(this.utc, 'h').locale('fr');
    } else {
      unixToLocal = moment.unix(date).add(this.utc, 'h').locale('en');
    }
    return unixToLocal.format(format);
  }

  /**
   * @param currentWeather {Currently}
   * Permet de calculer le lottie à afficher. Les cas particuliers hors API Dark Sky seront à traiter "à la mano"
   * */
  calculateLotties(currentWeather: Currently) {
    if (currentWeather.temperature <= 8 && currentWeather.icon === 'wind') {
      this.lotties('lottie-cold-wind');
    } else if (currentWeather.cloudCover >= 0.75 && currentWeather.icon === 'lottie-cloudy-night') {
      this.lotties('lottie-very-cloudy-night');
    } else {
      this.lotties(currentWeather.icon);
    }
  }

  lotties(icon: string): void {
    this.lottieConfig = {
      // path: `assets/lotties/lottie-${icon}.json`,
      path: `assets/lotties/lottie-very-cloudy-night.json`,
      renderer: 'canvas',
      autoplay: true,
      loop: true,
    };
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }
}