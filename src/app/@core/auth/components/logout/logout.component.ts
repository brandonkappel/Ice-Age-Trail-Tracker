/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NB_AUTH_OPTIONS } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';
import { NbAuthService } from '../../services/auth.service';
import { NbAuthResult } from '../../services/auth-result';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'nb-logout',
  templateUrl: './logout.component.html',
})
export class NbLogoutComponent implements OnInit {

  redirectDelay: number = 0;
  strategy: string = '';

  constructor(protected service: NbAuthService,
              private themeService: NbThemeService,
              @Inject(NB_AUTH_OPTIONS) protected options = {},
              protected router: Router) {
    this.redirectDelay = this.getConfigValue('forms.logout.redirectDelay');
    this.strategy = this.getConfigValue('forms.logout.strategy');
  }

  ngOnInit(): void {
    this.logout(this.strategy);
  }

  logout(strategy: string): void {
    let self = this;
    this.service.logout(strategy).subscribe((result: NbAuthResult) => {      
      // self.themeService.changeTheme('cosmic');
      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
