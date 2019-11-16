import { Component, Input, OnInit } from '@angular/core';
import { Coords } from '../../models/cities';

@Component({
  selector: 'app-kpindex',
  templateUrl: './kpindex.component.html',
  styleUrls: ['./kpindex.component.scss'],
})
export class KpindexComponent implements OnInit {

  @Input() coords: Coords;

  constructor() { }

  ngOnInit() {
    const reset = function(e) {
      e.target.className = 'star';
      setTimeout(function() {
        e.target.className = 'star star--animated';
      }, 0);
    };
    const stars = document.querySelectorAll('.star');
    for(let i = 0; i < stars.length; i++) {
      stars[i].addEventListener('animationend', reset);
    }
  }

}
