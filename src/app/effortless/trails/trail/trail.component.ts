import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbMenuService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { EffortlessComponentBase } from '../../efforless-base-component';
import { DataEndpoint } from '../../services/eapi-data-services/data-endpoint/data-endpoint';
import { GDS } from '../../services/gds.service';

@Component({
  selector: 'ngx-trail',
  templateUrl: './trail.component.html',
  styleUrls: ['./trail.component.scss']
})
export class TrailComponent extends EffortlessComponentBase implements OnInit {
  segment$: Observable<any>;
  segment: any;
  id: any;
  comments$: Observable<any>;
  comments: any;

  constructor(public gds : GDS, public data : DataEndpoint, public route : ActivatedRoute,
    protected toastr : NbToastrService, protected menuService : NbMenuService, public router : Router) {
super(gds, data, menuService);

    this.segment$ = this.data.onAllSegmentChange()
    this.safeSubscribe(this.segment$.subscribe(data => {
      this.segment = data
      console.error(this.segment )
    }));

    this.comments$ = this.data.onCommentChange()
    this.safeSubscribe(this.comments$.subscribe(comments => {
      this.comments = comments
    }))
  }



  onGdsReady() {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.id = params['trailId'];
      this.reload(this);
      // this.allowSave = !!(this.gds.smqUser || this.gds.smqGuest)['UpdateTheater'];
    });
  }

  reload(self: this) {
    self.loading = true;
    self.data.reloadAllSegmentWhere(self.gds.smqUser || self.gds.smqGuest, "RECORD_ID()='" + self.id + "'");
  }

}
