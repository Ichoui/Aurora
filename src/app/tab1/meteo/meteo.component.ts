import { Component, Input, OnInit } from "@angular/core";
import { Coords } from "../../models/cities";
import * as moment from "moment";
import "moment/locale/fr";
import { Cloudy, Currently, Daily, DataDaily, DataHourly, Hourly } from "../../models/weather";
import * as Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { BehaviorSubject, Subject } from "rxjs";
import { Storage } from "@ionic/storage";
import { AnimationOptions } from "ngx-lottie";
import { AnimationItem } from "ngx-lottie/src/symbols";

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
    console.log(value);
    this.sevenDayWeather$.next(value);
  }

  get sevenDayWeatherInput() {
    return this.sevenDayWeather$.getValue();
  }

  @Input() utc: number;

  loading: boolean = false;

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
  lottieConfig: AnimationOptions;
  widthCurrent: number = 110;
  heightCurrent: number = 110;
  unsubscribeAll$ = new Subject<void>();

  lottie7Fcst: AnimationOptions;
  width7Fcst: number = 42;
  height7Fcst: number = 42;

  language: string;
  englishFormat: boolean = false; // h, hh : 12 && H,HH : 24


  constructor(private storage: Storage) {}

  ngOnInit() {
    // this.unsubscribeAll$.next();
    // this.unsubscribeAll$.complete();
    this.storage.get('language').then(lg => {
      this.language = lg;
      if (lg === 'en') this.englishFormat = true
      this.todayForecast();
      this.nextHoursForecast();
      this.sevenDayForecast();
    });
  }

  todayForecast() {
    this.currentWeather$.pipe().subscribe((res: Currently) => {
      this.currentWeather = res;
      this.actualDate = this.manageDates(moment().unix(), this.englishFormat ? 'dddd Do of MMMM, hh:mm:ss' : 'dddd DD MMMM, HH:mm:ss');
    });
  }

  nextHoursForecast() {
    this.hourlyWeather$.pipe().subscribe((res: Hourly) => {
      this.cloudy = [];
      res.data.forEach((hours: DataHourly, i) => {
        if (this.temps.length < this.dataNumberInCharts && i % 2 === 0) {
          this.temps.push(Math.round(hours.temperature));
          this.nextHours.push(this.manageDates(hours.time, this.englishFormat ? 'hh:mm' : 'HH:mm'));
        }
        const cloudy: Cloudy = {
          percent: hours.cloudCover,
          time: this.manageDates(hours.time, this.englishFormat ? 'hh:mm' : 'HH:mm'),
        };
        if (this.cloudy.length < 8) {
          this.cloudy.push(cloudy);
        }

        if (i === 0) {
          // lottie de la prévision de l'heure en cours pour moins de marge d'erreur
          this.calculateLotties(hours, true);
        }
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

    this.sevenDayWeather$.pipe().subscribe((res: Daily) => {
      this.days = [];
      res.data.forEach(day => {
        this.calculateLotties(day, false);
        // Permet de calculer dans le jour en cours sunset/sunrise
        if (this.manageDates(day.time, 'MM DD') === today.format('MM DD')) {
          this.sunset = this.manageDates(day.sunsetTime, this.englishFormat ? 'h:mm' : 'H:mm');
          this.sunrise = this.manageDates(day.sunriseTime, this.englishFormat ? 'h:mm' : 'H:mm');
        }
        day.date = this.manageDates(day.time, 'ddd');
        this.days.push(day);
      });
      console.log(this.days);
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
   * @param today {boolean} Détermine si on calcule le lottie du jour ou de la prévision des 7 jours
   * Permet de calculer le lottie à afficher. Les cas particuliers hors API Dark Sky seront à traiter "à la mano"
   * */
  calculateLotties(currentWeather: Currently | DataDaily, today: boolean = true) {
    if (currentWeather.cloudCover >= 0.75 && currentWeather.icon === 'cloudy-night') {
      this.lotties('lottie-very-cloudy-night', today);
      // } else if (currentWeather.temperature <= 8 && currentWeather.icon === 'wind') {
      // Améliorable avec un lottie-cold-wind
      // this.lotties('lottie-wind', today);
    } else {
      // console.log(currentWeather.icon);
      this.lotties(currentWeather.icon, today);
    }
  }

  lotties(icon: string, today: boolean): void {
    if (icon === 'fog' || icon === 'sleet' || icon === 'snow' || icon === 'wind') {
      this.widthCurrent = this.heightCurrent = 65;
      this.width7Fcst = this.height7Fcst = 35;
    }

    if (today) {
      this.lottieConfig = {
        path: `assets/lotties/lottie-${icon}.json`,
        // path: `assets/lotties/lottie-very-cloudy-night.json`,
        renderer: 'svg',
        autoplay: true,
        loop: true,
      };
    } else {
      // not use ATM
      this.lottie7Fcst = {
        path: `assets/lotties/lottie-${icon}.json`,
        renderer: 'svg',
        autoplay: true,
        loop: true,
      };
    }
  }

  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(0.6);
  }
}
