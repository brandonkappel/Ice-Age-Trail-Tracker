import { Component, OnInit } from '@angular/core';
import { GDS } from '../services/gds.service';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public gds : GDS) { }

  ngOnInit() {
  }

  stringify(obj) {
    return JSON.stringify(obj);
  }

}
