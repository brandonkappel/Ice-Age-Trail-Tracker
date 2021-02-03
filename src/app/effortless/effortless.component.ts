import { Component, OnInit } from '@angular/core';

import { MENU_ITEMS } from './effortless-menu';
import { GDS } from './services/gds.service';
import { NbMenuService, NbMenuItem, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { DataEndpoint } from './services/eapi-data-services/data-endpoint/data-endpoint';
import { EffortlessComponentBase } from './efforless-base-component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ngx-effortless',
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class EffortlessComponent extends EffortlessComponentBase implements OnInit {
  items:NbMenuItem[];
  constructor(public gds: GDS, public data : DataEndpoint, public toastr : NbToastrService,
    protected menuService: NbMenuService, public router: Router) {
    super(gds, data, menuService)
    // this.items = this.getMenu();
    gds.onReady().pipe(take(1)).subscribe(ready => {
      this.menu[4].hidden = this.gds.whoAmI;
    });
    
  }

  ngOnInit() {
    this.goToDashboard(this.router, this.toastr)
  }
  
  menu = MENU_ITEMS;  
}
