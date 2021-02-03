declare var generateAdminActor: any;
declare var generateCustomerActor: any;
declare var generateUserActor: any;
declare var generateEmployeeActor: any;


import { Injectable, ɵConsole } from '@angular/core';
import { NbMenuService } from '@nebular/theme';
import { Observable, BehaviorSubject, Subscription, timer, combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { filter, share, map, catchError, take, tap } from 'rxjs/operators';
interface TSWindow {
  [id: string]: any;
}

@Injectable()
export class GDS {
  dontConnect() {
    this.readiness$.next({});
  }


  public menu: NbMenuService;
  public smqPassword: string;
  public smqUsername: string;
  public vhost: string;
  public window: TSWindow = {};
  public isGuestConnected: boolean;
  public smqGuest: any;
  public rabbitEndpoint: string;
  public accessToken: string;
  public createPayload: () => any;
  public whoAmI: any;
  public smqUser: any;
  public smqPayroll: any;
  public isAdmin: boolean;
  public isEmployee: boolean;
  public isPayroll: boolean;
  public isManager: boolean;
  public role: string;
  public phases: any;
  public applicant: any;
  public firstLoad: boolean;
  public customer: any;
  public employee: any;
  public timers: Subscription[] = [];
  private readiness$: BehaviorSubject<{}> = new BehaviorSubject(null);

  public onReady(): Observable<any> {
    return this.readiness$
      .pipe(
        filter(value => !!value),
        share()
      )
  }

  constructor(private router: Router) {
    var self = this;
  }

  saveAccessToken(accessToken: string) {
    if (!accessToken) return;
    var gds = this;
    gds.accessToken = accessToken;
    localStorage.setItem('accessToken', accessToken);
    gds.smqGuest.WhoAmI(gds.createPayload())
      .then(function (waiReply) {
        gds.whoAmI = waiReply.SingletonAppUser;
        gds.connect();
      });
  }

  public logout() {
    this.isAdmin = false;
    this.isEmployee = false;
    this.whoAmI = null;
    Object.keys(this).forEach(key => {
      if (this[key] instanceof BehaviorSubject) {
        this[key].next(null);
      }
    })
  }

  connect() {
    console.error("LOADING ALL DATA.");
    var gds = this;
    var currentRolesAssigned = gds.whoAmI ? gds.whoAmI.Roles : [];

    if (!gds.whoAmI || !currentRolesAssigned) {
      console.error('ERROR AUTHENTICATING - WHOAMI: ', gds.whoAmI);
      return;
    }
    gds.isAdmin = false;
    gds.isEmployee = false;
    gds.isPayroll = false;


    if (currentRolesAssigned.indexOf("Admin") >= 0) {
      gds.role = 'Admin';
      gds.isAdmin = true;
      gds.smqUser = generateAdminActor();
    } else if (currentRolesAssigned.indexOf("Employee") >= 0) {
      gds.role = 'Employee';
      gds.isEmployee = true;
      gds.smqUser = generateEmployeeActor();
    }
    else if (currentRolesAssigned.indexOf("Customer") >= 0) {
      gds.role = 'Customer';
      gds.isEmployee = true;
      gds.smqUser = generateCustomerActor();
    }
    else if (currentRolesAssigned.indexOf("User") >= 0) {
      gds.role = 'User';
      gds.isEmployee = true;
      gds.smqUser = generateUserActor();
    }


    if (gds.smqPayroll) {
      gds.smqPayroll.rabbitEndpoint = gds.rabbitEndpoint;
      gds.smqPayroll.connect(gds.vhost, gds.smqUsername, gds.smqPassword, null, function () {
      });
    }


    if (gds.smqUser) {
      gds.smqUser.rabbitEndpoint = gds.rabbitEndpoint;

      gds.smqUser.connect(gds.vhost, gds.smqUsername, gds.smqPassword, function () { }, function () {
        gds.isGuestConnected = true;
        gds.readiness$.next({});
      });

      gds.smqUser.createPayload = gds.smqUser.createPayload || function () {
        return { "AccessToken": gds.smqUser.accessToken || gds.accessToken };
      };
    } else {
      gds.isGuestConnected = true;
      gds.readiness$.next({});
    }
  }
}

/*

        */