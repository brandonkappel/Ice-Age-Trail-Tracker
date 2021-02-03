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
  selector: 'eapi-data-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  private doc: any;
  mySchema: any = {};
  editor: any;

  userToAdd: any;

  constructor(@Inject(DOCUMENT) document, protected dialogRef: NbDialogRef<UserDialogComponent>,
    public gds: GDS, public router: Router) {
    this.doc = document;
    this.mySchema = {
      "definitions": {},
      "$schema": "http://json-schema.org/draft-07/schema#",
      "$id": "http://example.com/root.json",
      "type": "object",
      "title": "The Root Schema",
      "required": [
        "UserId",
        "UserName",
        "FirstName",
        "LastName",
        "EmailAddress",
        "MilesCompleted",
        "Completed",
        "HoursHiked",
        "MilesToComplete",
        "TrailsToComplete",
        "TotalMiles",
        "NumberOfTrailsCompleted",
        "RoadsCompleted",
        "TrailsCompleted",
        "Gender",
        "Comments",
        "RoadsToComplete",
        "Roles",
      ],
      properties: {
        "UserId": {
          $id: "#/properties/UserId",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          pattern: "^(.*)$"
        },
        "UserName": {
          $id: "#/properties/UserName",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "FirstName": {
          $id: "#/properties/FirstName",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "LastName": {
          $id: "#/properties/LastName",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "EmailAddress": {
          $id: "#/properties/EmailAddress",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "MilesCompleted": {
          $id: "#/properties/MilesCompleted",
          type: "array",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          pattern: "^(.*)$"
        },
        "Completed": {
          $id: "#/properties/Completed",
          type: "array",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          pattern: "^(.*)$"
        },
        "HoursHiked": {
          $id: "#/properties/HoursHiked",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "MilesToComplete": {
          $id: "#/properties/MilesToComplete",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "TrailsToComplete": {
          $id: "#/properties/TrailsToComplete",
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
        "NumberOfTrailsCompleted": {
          $id: "#/properties/NumberOfTrailsCompleted",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "RoadsCompleted": {
          $id: "#/properties/RoadsCompleted",
          type: "array",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          pattern: "^(.*)$"
        },
        "TrailsCompleted": {
          $id: "#/properties/TrailsCompleted",
          type: "array",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          pattern: "^(.*)$"
        },
        "Gender": {
          $id: "#/properties/Gender",
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
        "RoadsToComplete": {
          $id: "#/properties/RoadsToComplete",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "Roles": {
          $id: "#/properties/Roles",
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

  addUser() {
    var payload = this.gds.createPayload();
    payload.User = this.editor.getValue();
    (this.gds.smqUser || this.gds.smqGuest).AddUser(payload).then((reply) => {
      if (reply.ErrorMessage) {
        alert(reply.ErrorMessage)
      } else {
        this.cancel();
        this.router.navigateByUrl('effortless/data/users/user/' + reply.User.UserId);
      }
    });
  }

}