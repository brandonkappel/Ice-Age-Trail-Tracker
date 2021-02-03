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
  selector: 'eapi-data-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss']
})
export class CommentDialogComponent implements OnInit {

  private doc: any;
  mySchema: any = {};
  editor: any;

  commentToAdd: any;

  constructor(@Inject(DOCUMENT) document, protected dialogRef: NbDialogRef<CommentDialogComponent>,
    public gds: GDS, public router: Router) {
    this.doc = document;
    this.mySchema = {
      "definitions": {},
      "$schema": "http://json-schema.org/draft-07/schema#",
      "$id": "http://example.com/root.json",
      "type": "object",
      "title": "The Root Schema",
      "required": [
        "CommentId",
        "UserComments",
        "AllSegments",
        "Users",
        "Comments",
      ],
      properties: {
        "CommentId": {
          $id: "#/properties/CommentId",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          pattern: "^(.*)$"
        },
        "UserComments": {
          $id: "#/properties/UserComments",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          pattern: "^(.*)$"
        },
        "AllSegments": {
          $id: "#/properties/AllSegments",
          type: "array",
          title: "",
          default: "",
          options: {
            hidden: true,
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
        "Comments": {
          $id: "#/properties/Comments",
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

  addComment() {
    var payload = this.gds.createPayload();
    payload.Comment = this.editor.getValue();
    (this.gds.smqUser || this.gds.smqGuest).AddComment(payload).then((reply) => {
      if (reply.ErrorMessage) {
        alert(reply.ErrorMessage)
      } else {
        this.cancel();
        this.router.navigateByUrl('effortless/data/comments/comment/' + reply.Comment.CommentId);
      }
    });
  }

}