import { Subscription, Observable, Subject, BehaviorSubject } from 'rxjs';
import { OnDestroy, OnInit } from '@angular/core';
import { GDS } from './services/gds.service';
import { NbMenuService, NbToastComponent, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { DataEndpoint } from './services/eapi-data-services/data-endpoint/data-endpoint';


export class EffortlessComponentBase implements OnDestroy, OnInit {

    constructor(public gds: GDS, public data: DataEndpoint,
        protected menuService: NbMenuService) {
        this.safeSubscribe(this.gds.onReady().subscribe(ready => {
            this.data.reloadStaticData(this.gds.smqUser);
        }));
    }

    public destroy$ : BehaviorSubject<any> = new BehaviorSubject(this);
    public loading: boolean;
    protected subscriptions: Subscription[] = [];

    public safeSubscribe(subscription: Subscription) {
        this.subscriptions.push(subscription);
    }

    public ngOnInit() {
        this.safeSubscribe(this.gds.onReady().subscribe(ready => {
            this.onGdsReady()
        }));
    }

    onGdsReady() {
        // Do nothing here in the base class
    }

    public ngOnDestroy() {
        this.destroy$.next(this);
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    goToHome() {
        this.menuService.navigateHome();
    }

    goToDashboard(router: Router, toastr: NbToastrService) {

        var url = '/effortless';
            setTimeout(() => {
                if ((router.url == "/") || (router.url == url)) {
    
                    if (this.gds.whoAmI) url = '/effortless/data';
                    else url = "/effortless/page1"
                    
                    router.navigateByUrl(url);
                }
            }, 1500)
    }

    stringify(obj) {
        return JSON.stringify(obj);
    }
}
