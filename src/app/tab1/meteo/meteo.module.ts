import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MeteoComponent } from "./meteo.component";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import player from "lottie-web";
import { LottieModule } from "ngx-lottie";

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [MeteoComponent],
  exports: [MeteoComponent],
  imports: [CommonModule, IonicModule, TranslateModule, LottieModule.forRoot({ player: playerFactory })],
})
export class MeteoModule {}

