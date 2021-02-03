import { Component, OnInit } from '@angular/core';
import { GDS } from '../services/gds.service';

@Component({
  selector: 'ngx-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})
export class Page1Component implements OnInit {

  constructor(public gds : GDS) { }

  ngOnInit() {
  }

}
