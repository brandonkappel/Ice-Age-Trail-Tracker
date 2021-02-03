import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { GDS } from '../services/gds.service';
import { BaseDataComponent } from './base-data-component';

@Component({
  selector: 'ngx-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent extends BaseDataComponent implements OnInit {
  availableTables: any[];

  constructor(public router: Router, public gds: GDS) {
    super()
   }

  ngOnInit() {
    this.availableTables = [];
    var user = this.gds.smqUser  || this.gds.smqGuest;
    if (user) {
      this.availableTables = this.tables.filter(table => user['Get' + table.title]);
    }
  }

  goToData(page) {
    this.router.navigateByUrl('effortless/data/' + page);
  }

  getAvailableTables() {
  }
}
