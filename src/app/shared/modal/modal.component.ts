import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  @Input() map: string;
  @Input() titleMap: string;

  @Input() globe1: string;
  @Input() globeTitle1: string;

  @Input() globe2: string;
  @Input() globeTitle2: string;


  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  async close() {
    await this.modalController.dismiss()
  }

}
