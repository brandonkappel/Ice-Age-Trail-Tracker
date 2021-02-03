/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
  NbMenuService,
  NbThemeService,
  NbTabsetModule,
} from '@nebular/theme';
import { GDS } from './effortless/services/gds.service';
import { DataEndpoint } from './effortless/services/eapi-data-services/data-endpoint/data-endpoint';
import { NbAuthService, NbAuthJWTToken } from './@core/auth';
import { AuthGuard } from './auth-guard.service';
import { Globals } from './app.globals';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    ThemeModule.forRoot(),

    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
  ],
  providers: [GDS, DataEndpoint, AuthGuard, Globals],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private nbMenuService: NbMenuService, public themeService: NbThemeService, private authService: NbAuthService, private gds: GDS) {
    var gds = this.gds;
    let self = this;
    gds.firstLoad = true;
    gds.menu = nbMenuService;
    gds.smqGuest = window['generateGuestActor']();
    gds.rabbitEndpoint = "wss://sassyapi-rmq.ssot.me:15673/ws";
    gds.smqGuest.rabbitEndpoint = gds.rabbitEndpoint;
    gds.accessToken = "";
    gds.createPayload = function () {
      return { "AccessToken": gds.accessToken };
    }

    gds.vhost = "brandon-iceagetrailtracker";
    gds.smqUsername = "smqPublic";
    gds.smqPassword = "smqPublic";

    this.gds.smqGuest.connect(gds.vhost, gds.smqUsername, gds.smqPassword, function () { }, function () {
      gds.isGuestConnected = true;
      self.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            gds.accessToken = token.getValue()
            gds.createPayload = function () {
              return { "AccessToken": gds.accessToken };
            };
            gds.smqGuest.WhoAmI(gds.createPayload())
              .then(function (waiReply) {
                gds.whoAmI = waiReply.SingletonAppUser;
                if (gds.firstLoad) gds.connect();
                gds.firstLoad = false;
              });
          }
          else {
            gds.accessToken = "";
            gds.createPayload = function () {
              return { "AccessToken": gds.accessToken };
            };
            gds.dontConnect();
          }
        });
    });

  }
}
