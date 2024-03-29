import { Component, OnInit, ViewChild } from "@angular/core";
import { AnimationOptions } from "ngx-lottie";
import { NavigationEnd, Router } from "@angular/router";
import { AnimationItem } from "ngx-lottie/src/symbols";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  @ViewChild('auroraLogo', { static: false }) auroraLogo;

  // lotties
  lottieConfigWeather: AnimationOptions;
  lottieConfigSettings: AnimationOptions;

  activeRoute: number = null;

  style: Partial<CSSStyleDeclaration> = {
    width:'100%'
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.interval();
    this.lottieConfigWeather = {
      path: `assets/lotties/lottie-partly-cloudy-day.json`,
      renderer: "svg",
      autoplay: true,
      loop: true
    };
    this.lottieConfigSettings = {
      path: `assets/lotties/lottie-settings.json`,
      renderer: "svg",
      autoplay: true,
      loop: true,
    };

    this.router.events.subscribe((event: NavigationEnd) =>{
      if (event && event.url)
        this.selectTab(null, event.url)
    });

  }
  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(.4)
  }

  selectTab(index?: number, pathObs?: string): void {
    const path = pathObs ? pathObs : window.location.pathname;
    if (path.startsWith('/tabs/tab1') || index === 1) {
      this.activeRoute = 1;
    } else if (path.startsWith('/tabs/tab2') || index === 2) {
      this.activeRoute = null;
    } else if (path.startsWith('/tabs/tab3') || index === 3) {
      this.activeRoute = 3;
    }
  }

  /*
   * Permet d'afficher le logo Aurora
   * tag <a> est dans shadowRoot et ne se charge pas immédiatement
   * Interval enchaîne les itérations jusqu'à ce qu'il existe et s'arrête
   * */
  interval(): void {
    let inter = setInterval(() => {
      let fuckingA = this.auroraLogo.el.shadowRoot.querySelector('a'); // null
      if (fuckingA !== null) {
        fuckingA.style.overflow = 'visible';
        clearInterval(inter);
      }
    }, 50);
  }
}
