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
  selector: 'eapi-data-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends EffortlessComponentBase implements OnInit {
  user$: Observable<any>;
  user: any;
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
    this.user$ = this.data.onUserChange();
    this.safeSubscribe(this.user$.subscribe(data => {
      this.user = data
      if (this.editor) {
        this.editor.setValue(this.user)
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
      "properties": {
        "UserId": {
          $id: "#/properties/UserId",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          "pattern": "^(.*)$"
        },
        "UserName": {
          $id: "#/properties/UserName",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "FirstName": {
          $id: "#/properties/FirstName",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "LastName": {
          $id: "#/properties/LastName",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "EmailAddress": {
          $id: "#/properties/EmailAddress",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "MilesCompleted": {
          $id: "#/properties/MilesCompleted",
          type: "array",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "Completed": {
          $id: "#/properties/Completed",
          type: "array",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "HoursHiked": {
          $id: "#/properties/HoursHiked",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "MilesToComplete": {
          $id: "#/properties/MilesToComplete",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "TrailsToComplete": {
          $id: "#/properties/TrailsToComplete",
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
        "NumberOfTrailsCompleted": {
          $id: "#/properties/NumberOfTrailsCompleted",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "RoadsCompleted": {
          $id: "#/properties/RoadsCompleted",
          type: "array",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          "pattern": "^(.*)$"
        },
        "TrailsCompleted": {
          $id: "#/properties/TrailsCompleted",
          type: "array",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          "pattern": "^(.*)$"
        },
        "Gender": {
          $id: "#/properties/Gender",
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
        "RoadsToComplete": {
          $id: "#/properties/RoadsToComplete",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "Roles": {
          $id: "#/properties/Roles",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
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
    payload.User = this.editor.getValue();
    console.error(payload);
    (this.gds.smqUser || this.gds.smqGuest).UpdateUser(payload)
        .then(reply => {
          console.error(reply)
          this.user  = reply.User;
          if (reply.ErrorMessage) {
            this.toastr.show(reply.ErrorMessage)
          } else {
            this.toastr.show('User Saved...');
            this.goBack()
          }
        });
  }

  onGdsReady() {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.id = params['userId'];
      this.reload(this);
      this.allowSave = !!(this.gds.smqUser || this.gds.smqGuest)['UpdateTheater'];
    });
  }

  reload(self: this) {
    self.loading = true;
    self.data.reloadUserWhere(self.gds.smqUser || self.gds.smqGuest, "RECORD_ID()='" + self.id + "'");
  }

  goBack() {
    this.router.navigateByUrl('effortless/data/users')
  }
}
