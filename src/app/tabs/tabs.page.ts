import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  @ViewChild('test', { static: false }) test;

  // lotties
  lottieConfigWeather: Object;
  lottieConfigSettings: Object;

  constructor() {}

  ngOnInit(): void {
    this.interval();
    this.lottieConfigWeather = {
      path: `assets/lotties/lottie-partly-cloudy-day.json`,
      renderer: 'canvas',
      autoplay: true,
      loop: true,
    };
      this.lottieConfigSettings = {
          path: `assets/lotties/lottie-settings.json`,
          renderer: 'canvas',
          autoplay: true,
          loop: true,
      };
  }

  trough(tab: number) {
      // this.router.
  }

  /*
   * Permet d'afficher le logo Aurora
   * tag <a> est dans shadowRoot et ne se charge pas immédiatement
   * Interval enchaîne les itérations jusqu'à ce qu'il existe et s'arrête
   * */
  interval(): void {
    let inter = setInterval(() => {
      let fuckingA = this.test.el.shadowRoot.querySelector('a'); // null
      if (fuckingA !== null) {
        fuckingA.style.overflow = 'visible';
        clearInterval(inter);
      }
    }, 50);
  }
}
