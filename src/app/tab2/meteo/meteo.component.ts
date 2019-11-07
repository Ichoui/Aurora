import { Component, Input, OnInit } from '@angular/core';
import { Coords } from '../../cities';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.scss'],
})
export class MeteoComponent implements OnInit {

  @Input() coords: Coords;

  constructor() { }

  ngOnInit() {}

}
