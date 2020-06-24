import { ElementRef, Inject, Injectable, Renderer2 } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Network } from "@capacitor/core";
import { GOOGLE_API_KEY } from "../environments/keep";

@Injectable({
  providedIn: "root",
})
export class GoogleMapsService {
  constructor(
    private renderer: Renderer2, // pbm avec renderer2 : NullInjectorError: No provider for Renderer2!
    private element: ElementRef,
    @Inject(DOCUMENT) private _document
  ) {}
  public map: any;
  public markers: any[] = [];
  private mapsLoaded: boolean = false;
  private networkHandler = null;

  loadSDK(): Promise<any> {
    console.log("Loading Google Maps SDK");

    return new Promise((resolve, reject) => {
      if (!this.mapsLoaded) {
        Network.getStatus().then(
          (status) => {
            if (status.connected) {
              this.injectSDK().then(
                (res) => {
                  resolve(true);
                },
                (err) => {
                  reject(err);
                }
              );
            } else {
              if (this.networkHandler == null) {
                this.networkHandler = Network.addListener(
                  "networkStatusChange",
                  (status) => {
                    if (status.connected) {
                      this.networkHandler.remove();

                      // this.init().then((res) => {
                      //   console.log("Google Maps ready.")
                      // }, (err) => {
                      //   console.log(err);
                      // });
                    }
                  }
                );
              }

              reject("Not online");
            }
          },
          (err) => {
            // NOTE: navigator.onLine temporarily required until Network plugin has web implementation
            if (navigator.onLine) {
              this.injectSDK().then(
                (res) => {
                  resolve(true);
                },
                (err) => {
                  reject(err);
                }
              );
            } else {
              reject("Not online");
            }
          }
        );
      } else {
        reject("SDK already loaded");
      }
    });
  }

  injectSDK(): Promise<any> {
    return new Promise((resolve, reject) => {
      window["mapInit"] = () => {
        this.mapsLoaded = true;
        resolve(true);
      };

      let script = this.renderer.createElement("script");
      script.id = "googleMaps";

      if (GOOGLE_API_KEY) {
        script.src =
          "https://maps.googleapis.com/maps/api/js?key=" +
          GOOGLE_API_KEY +
          "&callback=mapInit";
      } else {
        script.src = "https://maps.googleapis.com/maps/api/js?callback=mapInit";
      }

      this.renderer.appendChild(this._document.body, script);
    });
  }

  /*
   init(): Promise<any> {

    return new Promise((resolve, reject) => {

      this.loadSDK().then((res) => {

        this.initMap().then((res) => {
          resolve(true);
        }, (err) => {
          reject(err);
        });

      }, (err) => {

        reject(err);

      });

    });

  }
*/

  /*
   initMap(): Promise<any> {

    return new Promise((resolve, reject) => {

      Geolocation.getCurrentPosition().then((position) => {

        console.log(position);

        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        let mapOptions = {
          center: latLng,
          zoom: 15
        };

        this.map = new google.maps.Map(this.element.nativeElement, mapOptions);
        resolve(true);

      }, (err) => {

        reject('Could not initialise map');

      });

    });

  }
*/
}
