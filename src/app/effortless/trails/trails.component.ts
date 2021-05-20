import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbMenuService, NbDialogService, NbToastrService } from '@nebular/theme';
import { UserData } from '../../@core/data/users';
import { EffortlessComponentBase } from '../efforless-base-component';
import { DataEndpoint } from '../services/eapi-data-services/data-endpoint/data-endpoint';
import { GDS } from '../services/gds.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ngx-trails',
  templateUrl: './trails.component.html',
  styleUrls: ['./trails.component.scss']
})
export class TrailsComponent extends EffortlessComponentBase implements OnInit {
  allsegments: any[] = [];
  filteredAllSegments: any;
  searchText : string = '';
  allowDelete : boolean = false;
  allowAdd : boolean = false;
  user: any;
  segmentsComplete: any;
  check: boolean;


  constructor(public gds: GDS, public data: DataEndpoint, public route: ActivatedRoute,
              private userService: UserData, protected toastr : NbToastrService,
              protected menuService: NbMenuService, public router: Router, public dialogService: NbDialogService, ) {
    super(gds, data, menuService);

    this.safeSubscribe(this.data.onAllSegmentsChange().subscribe(allsegments => {
      this.allsegments = allsegments;
      // console.error(this.allsegments)
      // this.user = this.gds.whoAmI
    }));
    this.safeSubscribe(this.data.onUsersChange().subscribe(user => {
      this.user = user.filter(user => user.UserId == this.gds.whoAmI.UserId)
      // this.user = user.map((user)=> user)
      // console.error(this.user)
    this.parse();
    }))
  }

  parse(){
    this.filterNow()
    this.sortByDirection()
    this.checkCompleted()

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
    self.data.reloadUsers(self.gds.smqUser || self.gds.smqGuest)
    this.sortByDirection();
    this.isComplete(this.segmentsComplete)
  }

  public viewTrail(id){
    this.router.navigateByUrl('effortless/trails/trail/' + id);

  }

  sortByDirection(){
    this.allsegments.sort((a,b)=> a.SegmentNumber-b.SegmentNumber)
    // console.error('ALL SEGMENTS:', this.allsegments)
    this.filteredAllSegments = this.allsegments
  }

  checkCompleted(){
   let segmentsCompleted = []
   this.user.filter(user=> segmentsCompleted = user.Completed)
  //  console.error(segmentsCompleted)
   this.segmentsComplete = this.filteredAllSegments.filter((segment)=> segmentsCompleted.includes(segment.AllSegmentId))
  //  console.error(this.segmentsComplete)
  }

  public isComplete(segment: any):boolean{
    if (!this.segmentsComplete) {
      return
    }
    return this.segmentsComplete.includes(segment)
  }


  public toggleComplete(event: any, segment: any){
    if (event.target.checked == true) {
      this.markComplete(segment);
    }
    if (event.target.checked == false) {
      this.markIncomplete(segment);
    }

  }

  markIncomplete(segment: any) {
    console.error('INCOMPLETE',segment)
    let payload = this.gds.createPayload()
    payload.AllSegment = segment;
     payload.AllSegment.Users = [this.gds.whoAmI.UserId];
     delete payload.AllSegmentId.Users;
    // console.error(payload);
    (this.gds.smqUser || this.gds.smqUser).UpdateAllSegment(payload).then(reply=> {
      console.error(reply)
    })

  }

  markComplete(segment: any) {
    // console.error('COMPLETE',segment)
    let payload = this.gds.createPayload();
    payload.AllSegment = segment
    payload.AllSegment.Users = [this.gds.whoAmI.UserId];
    // console.error(payload);
    (this.gds.smqUser || this.gds.smqUser).UpdateAllSegment(payload).then(reply =>{
      // console.error(reply)
      if (reply.ErrorMessage){
        this.toastr.danger('Ooops we didnt get that!')
      } else {
        this.toastr.success('Congrats on completing' + segment.Segment + '!')
        this.reload(this)
      }
    })
  }

  filterSegments(event: any){
    console.error(event)
    if (event == 1){
      console.error('hello')

    }

  }

}
