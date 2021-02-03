import { Component, OnInit } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { EffortlessComponentBase } from '../../../efforless-base-component';
import { GDS } from '../../../services/gds.service';
import { DataEndpoint } from '../../../services/eapi-data-services/data-endpoint/data-endpoint';
import { NbMenuService, NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { JSONEditor } from '@json-editor/json-editor';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'eapi-data-allsegment',
  templateUrl: './allsegment.component.html',
  styleUrls: ['./allsegment.component.scss']
})
export class AllSegmentComponent extends EffortlessComponentBase implements OnInit {
  allsegment$: Observable<any>;
  allsegment: any;
  id: any;
  config: any;
  mySchema: any;
  editor: any;
  private doc: any;
  allowSave : boolean = false;
  
  
  constructor(public gds : GDS, public data : DataEndpoint, public route : ActivatedRoute, 
            protected toastr : NbToastrService, protected menuService : NbMenuService, public router : Router,
            @Inject(DOCUMENT) document) { 
    super(gds, data, menuService);
    this.doc = document;
    this.allsegment$ = this.data.onAllSegmentChange();
    this.safeSubscribe(this.allsegment$.subscribe(data => {
      this.allsegment = data
      if (this.editor) {
        this.editor.setValue(this.allsegment)
      }
      this.loading = false;
    }));
    
    this.config = {};
    this.mySchema = {
      "definitions": {},
      "$schema": "http://json-schema.org/draft-07/schema#",
      "$id": "http://example.com/root.json",
      "type": "object",
      "title": "The Root Schema",
      "required": [
        "AllSegmentId",
        "Segment",
        "TotalMiles",
        "TrailMiles",
        "RoadMiles",
        "TownNearest",
        "IsRoadSegment",
        "Users",
        "IsTrailSegment",
        "Comments",
      ],
      "properties": {
        "AllSegmentId": {
          $id: "#/properties/AllSegmentId",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          "pattern": "^(.*)$"
        },
        "Segment": {
          $id: "#/properties/Segment",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "TotalMiles": {
          $id: "#/properties/TotalMiles",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "TrailMiles": {
          $id: "#/properties/TrailMiles",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "RoadMiles": {
          $id: "#/properties/RoadMiles",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "TownNearest": {
          $id: "#/properties/TownNearest",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "IsRoadSegment": {
          $id: "#/properties/IsRoadSegment",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "Users": {
          $id: "#/properties/Users",
          type: "array",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          "pattern": "^(.*)$"
        },
        "IsTrailSegment": {
          $id: "#/properties/IsTrailSegment",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "Comments": {
          $id: "#/properties/Comments",
          type: "array",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          "pattern": "^(.*)$"
        },
      }
    };
  }

  ngOnInit() {
    super.ngOnInit()
    const element = this.doc.getElementById('editor_holder');
    var options = {
      theme: 'bootstrap4',
      iconlib: "fontawesome5",
      schema: this.mySchema,
    };
    this.editor = new JSONEditor(element, options);
    this.editor.on('change',() => {
      console.log(this.editor.getValue())
    });
  }
  
  save() {
    var payload = this.gds.createPayload();
    payload.AllSegment = this.editor.getValue();
    (this.gds.smqUser || this.gds.smqGuest).UpdateAllSegment(payload)
        .then(reply => {
          this.allsegment  = reply.AllSegment;
          if (reply.ErrorMessage) {
            this.toastr.show(reply.ErrorMessage)
          } else {
            this.toastr.show('AllSegment Saved...');
            this.goBack()
          }
        });
  }

  onGdsReady() {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.id = params['allsegmentId'];
      this.reload(this);
      this.allowSave = !!(this.gds.smqUser || this.gds.smqGuest)['UpdateTheater'];
    });
  }

  reload(self: this) {
    self.loading = true;
    self.data.reloadAllSegmentWhere(self.gds.smqUser || self.gds.smqGuest, "RECORD_ID()='" + self.id + "'");
  }

  goBack() {
    this.router.navigateByUrl('effortless/data/allsegments')
  }
}
