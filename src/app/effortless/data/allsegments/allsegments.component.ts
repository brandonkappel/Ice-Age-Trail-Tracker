import { Component, OnInit } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { EffortlessComponentBase } from '../../efforless-base-component';
import { GDS } from '../../services/gds.service';
import { DataEndpoint } from '../../services/eapi-data-services/data-endpoint/data-endpoint';
import { NbMenuService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { AllSegmentDialogComponent } from './allsegment-dialog/allsegment-dialog.component'

@Component({
  selector: 'eapi-data-allsegments',
  templateUrl: './allsegments.component.html',
  styleUrls: ['./allsegments.component.scss']
})
export class AllSegmentsComponent extends EffortlessComponentBase implements OnInit {
  searchText : string = '';
  allsegments: any[] = [];
  filteredAllSegments: any;
  allowDelete : boolean = false;
  allowAdd : boolean = false;

  constructor(public gds : GDS, public data : DataEndpoint, public route : ActivatedRoute,
            protected menuService : NbMenuService, public router : Router, public dialogService: NbDialogService) {
    super(gds, data, menuService);
    this.safeSubscribe(this.data.onAllSegmentsChange().subscribe(allsegments => {
      this.allsegments = allsegments;
      this.filterNow();
    }));
  }

  onGdsReady() {
    var user = this.gds.smqUser || this.gds.smqGuest;
    this.allowDelete = !!user.DeleteAllSegment;
    this.allowAdd = !!user.AddAllSegment;
    this.reload(this);
  }

  filterNow() {
    this.filteredAllSegments = this.allsegments.filter(allsegment => !this.searchText || allsegment.Segment.toLowerCase().includes((this.searchText + '').toLowerCase()));
  }

  reload(self: this) {
    self.data.reloadAllSegments(self.gds.smqUser || self.gds.smqGuest);
  }

  goToAllSegment(id) {
    this.router.navigateByUrl('effortless/data/allsegments/allsegment/' + id);
  }


  openAddDialog() {
    this.dialogService.open(AllSegmentDialogComponent, { context: null, autoFocus: false});
  }

  goBack() {
    this.router.navigateByUrl('effortless/data');
  }

  deleteAllSegment(allsegmentToDelete) {
    if (confirm('Are you sure?')) {
      var payload = this.gds.createPayload();
      payload.AllSegment = allsegmentToDelete;
      this.gds.smqUser.DeleteAllSegment(payload).then((reply) => {
        if (reply.ErrorMessage) {
          alert(reply.ErrorMessage)
        } else {
          this.reload(this)
        }
      });
    }
  }

  addAllSegment(allsegmentToAdd) {
    var payload = this.gds.createPayload();
    payload.AllSegment = allsegmentToAdd;
    (this.gds.smqUser || this.gds.smqGuest).AddAllSegment(payload).then((reply) => {
      if (reply.ErrorMessage) {
        alert(reply.ErrorMessage)
      } else {
        this.router.navigateByUrl('effortless/data/allsegments/allsegment/' + reply.AllSegment.AllSegmentId);
      }
    });
  }
}
