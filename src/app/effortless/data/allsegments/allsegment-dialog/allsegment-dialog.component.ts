import { Component, OnInit } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { EffortlessComponentBase } from '../../../efforless-base-component';
import { GDS } from '../../../services/gds.service';
import { DataEndpoint } from '../../../services/eapi-data-services/data-endpoint/data-endpoint';
import { NbMenuService, NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import JSONEditor from '@json-editor/json-editor';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NbDialogRef } from '@nebular/theme'
import { JsonEditorComponent } from 'ng2-json-editor';

@Component({
  selector: 'eapi-data-allsegment-dialog',
  templateUrl: './allsegment-dialog.component.html',
  styleUrls: ['./allsegment-dialog.component.scss']
})
export class AllSegmentDialogComponent implements OnInit {

  private doc: any;
  mySchema: any = {};
  editor: any;

  allsegmentToAdd: any;

  constructor(@Inject(DOCUMENT) document, protected dialogRef: NbDialogRef<AllSegmentDialogComponent>,
    public gds: GDS, public router: Router) {
    this.doc = document;
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
        "SegmentNumber",
      ],
      properties: {
        "AllSegmentId": {
          $id: "#/properties/AllSegmentId",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          pattern: "^(.*)$"
        },
        "Segment": {
          $id: "#/properties/Segment",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "TotalMiles": {
          $id: "#/properties/TotalMiles",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "TrailMiles": {
          $id: "#/properties/TrailMiles",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "RoadMiles": {
          $id: "#/properties/RoadMiles",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "TownNearest": {
          $id: "#/properties/TownNearest",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "IsRoadSegment": {
          $id: "#/properties/IsRoadSegment",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "Users": {
          $id: "#/properties/Users",
          type: "array",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          pattern: "^(.*)$"
        },
        "IsTrailSegment": {
          $id: "#/properties/IsTrailSegment",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "Comments": {
          $id: "#/properties/Comments",
          type: "array",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          pattern: "^(.*)$"
        },
        "SegmentNumber": {
          $id: "#/properties/SegmentNumber",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
      }
    };
  }


  ngOnInit() {
    const element = this.doc.getElementById('editor_holder');
    var options = {
      theme: 'bootstrap4',
      iconlib: "fontawesome5",
      schema: this.mySchema,
    };
    this.editor = new window['JSONEditor'](element, options);
  }

  cancel() {
    this.dialogRef.close();
  }

  addAllSegment() {
    var payload = this.gds.createPayload();
    payload.AllSegment = this.editor.getValue();
    (this.gds.smqUser || this.gds.smqGuest).AddAllSegment(payload).then((reply) => {
      if (reply.ErrorMessage) {
        alert(reply.ErrorMessage)
      } else {
        this.cancel();
        this.router.navigateByUrl('effortless/data/allsegments/allsegment/' + reply.AllSegment.AllSegmentId);
      }
    });
  }

}