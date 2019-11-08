import { Component, Input, OnInit } from '@angular/core';
import { Coords } from '../../cities';

@Component({
  selector: 'app-kpindex',
  templateUrl: './kpindex.component.html',
  styleUrls: ['./kpindex.component.scss'],
})
export class KpindexComponent implements OnInit {

  @Input() coords: Coords;

  constructor() { }

  ngOnInit() {}

}
