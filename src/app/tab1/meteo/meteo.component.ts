import { Component, Input, OnInit } from '@angular/core';
import { Coords } from '../../models/cities';
import * as moment from 'moment';
import 'moment/locale/fr';
import { Cloudy, Currently, Daily, Hourly, IconsOWM, LottiesValues } from '../../models/weather';
import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BehaviorSubject, Subject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'ngx-lottie/src/symbols';

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
  set hourlyWeatherInput(value: Hourly[]) {
    this.hourlyWeather$.next(value);
  }

  get hourlyWeatherInput() {
    return this.hourlyWeather$.getValue();
  }

  @Input()
  set sevenDayWeatherInput(value: Daily[]) {
    this.sevenDayWeather$.next(value);
  }

  get sevenDayWeatherInput() {
    return this.sevenDayWeather$.getValue();
  }

  @Input() utc: number;

  loading: boolean = false;

  // Observable
  currentWeather$ = new BehaviorSubject<Currently>(null);
  hourlyWeather$ = new BehaviorSubject<Hourly[]>(null);
  sevenDayWeather$ = new BehaviorSubject<Daily[]>(null);

  // Var reflettant observables
  currentWeather: Currently;

  sunset;
  sunrise;
  actualDate: any;

  dataNumberInCharts: number = 8;
  temps: number[] = [];
  nextHours = [];

  cloudy: Cloudy[] = [];
  days: Daily[] = [];

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
      if (lg === 'en') this.englishFormat = true;
      this.todayForecast();
      this.nextHoursForecast();
      this.sevenDayForecast();
    });
  }

  todayForecast() {
    this.currentWeather$.pipe().subscribe((res: Currently) => {
      console.log(res);
      this.currentWeather = res;
      this.lotties(this.calculateLotties(res));
      this.actualDate = this.manageDates(moment().unix(), this.englishFormat ? 'dddd Do of MMMM, hh:mm:ss' : 'dddd DD MMMM, HH:mm:ss');
    });
  }

  nextHoursForecast() {
    this.hourlyWeather$.pipe().subscribe((res: Hourly[]) => {
      this.cloudy = [];
      res.forEach((hours: Hourly, i) => {
        if (this.temps.length < this.dataNumberInCharts && i % 2 === 0) {
          this.temps.push(Math.round(hours.temp));
          this.nextHours.push(this.manageDates(hours.dt, this.englishFormat ? 'hh:mm' : 'HH:mm'));
        }
        const cloudy: Cloudy = {
          percent: hours.clouds,
          time: this.manageDates(hours.dt, this.englishFormat ? 'hh:mm' : 'HH:mm'),
        };
        if (this.cloudy.length < 8) {
          this.cloudy.push(cloudy);
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

    this.sevenDayWeather$.pipe().subscribe((res: Daily[]) => {
      this.days = [];
      res.forEach(day => {
        // Permet de calculer dans le jour en cours sunset/sunrise
        if (this.manageDates(day.dt, 'MM DD') === today.format('MM DD')) {
          this.sunset = this.manageDates(day.sunset, this.englishFormat ? 'h:mm' : 'H:mm');
          this.sunrise = this.manageDates(day.sunrise, this.englishFormat ? 'h:mm' : 'H:mm');
        }
        day.date = this.manageDates(day.dt, 'ddd');
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
   * Permet de calculer le lottie à afficher. Comporte des cas regroupés ou cas particulier
   * https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
   * */
  calculateLotties(currentWeather: Currently): LottiesValues {
    const mainIcon = currentWeather.weather[0].main;
    const idIcon = currentWeather.weather[0].id;
    const icon = currentWeather.weather[0].icon;

    let day = true;
    let night = false;

    switch (mainIcon) {
      case IconsOWM.DRIZZLE:
      case IconsOWM.RAIN:
        return LottiesValues.RAIN;

      case IconsOWM.CLEAR:
        if (currentWeather.wind_speed >= 50) {
          return LottiesValues.WIND;
        } else {
          if (day) {
            return LottiesValues.CLEAR_DAY;
          }

          if (night) {
            return LottiesValues.CLEAR_NIGHT;
          }
        }
        break;

      case IconsOWM.CLOUDS:
        if (idIcon === 804) {
          return LottiesValues.VERY_CLOUDY;
        }
        if (day) {
          if (idIcon === 803) {
            return LottiesValues.PARTLY_CLOUDY_DAY;
          } else {
            return LottiesValues.CLOUDY_DAY;
          }
        }
        if (night) {
          if (idIcon === 803) {
            return LottiesValues.PARTLY_CLOUDY_NIGHT;
          } else {
            return LottiesValues.CLOUDY_NIGHT;
          }
        }
        break;

      case IconsOWM.THUNDERSTORM:
        return LottiesValues.THUNDERSTORM;

      case IconsOWM.SNOW:
        return LottiesValues.SNOW;

      default:
        if (day) {
          return LottiesValues.CLEAR_DAY;
        }
        if (night) {
          return LottiesValues.CLEAR_NIGHT;
        }
    }
  }

  lottieConfig1: AnimationOptions;
  lottieConfig2: AnimationOptions;

  lotties(icon: string /*Icons*/): void {
    // if (icon === 'fog' || icon === 'snow' || icon === 'wind') {
    // not used atm, keep for sevenDays lotties evol
    //   this.widthCurrent = this.heightCurrent = 65;
    //   this.width7Fcst = this.height7Fcst = 35;
    // }

    this.lottieConfig = {
      path: `assets/lotties/lottie-${icon}.json`,
      // path: `assets/lotties/lottie-very-cloudy-night.json`,
      renderer: 'svg',
      autoplay: true,
      loop: true,
    };

    this.lottieConfig1 = {
      path: `assets/lotties/lottie-very-cloudy-night.json`,
      renderer: 'svg',
      autoplay: true,
      loop: true,
    };
    this.lottieConfig2 = {
      // path: `assets/lotties/lottie-tornado.json`,
      renderer: 'svg',
      autoplay: true,
      loop: true,
    };
  }

  // animationCreated(animationItem: AnimationItem): void {
  //   animationItem.setSpeed(0.6);
  // }
}
