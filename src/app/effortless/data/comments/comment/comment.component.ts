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
  selector: 'eapi-data-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent extends EffortlessComponentBase implements OnInit {
  comment$: Observable<any>;
  comment: any;
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
    this.comment$ = this.data.onCommentChange();
    this.safeSubscribe(this.comment$.subscribe(data => {
      this.comment = data
      if (this.editor) {
        this.editor.setValue(this.comment)
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
        "CommentId",
        "UserComments",
        "AllSegments",
        "Users",
        "Comments",
      ],
      "properties": {
        "CommentId": {
          $id: "#/properties/CommentId",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: true,
          },
          "pattern": "^(.*)$"
        },
        "UserComments": {
          $id: "#/properties/UserComments",
          type: "string",
          title: "",
          default: "",
          options: {
            hidden: false,
          },
          "pattern": "^(.*)$"
        },
        "AllSegments": {
          $id: "#/properties/AllSegments",
          type: "array",
          title: "",
          default: "",
          options: {
            hidden: true,
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
        "Comments": {
          $id: "#/properties/Comments",
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
    payload.Comment = this.editor.getValue();
    (this.gds.smqUser || this.gds.smqGuest).UpdateComment(payload)
        .then(reply => {
          this.comment  = reply.Comment;
          if (reply.ErrorMessage) {
            this.toastr.show(reply.ErrorMessage)
          } else {
            this.toastr.show('Comment Saved...');
            this.goBack()
          }
        });
  }

  onGdsReady() {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.id = params['commentId'];
      this.reload(this);
      this.allowSave = !!(this.gds.smqUser || this.gds.smqGuest)['UpdateTheater'];
    });
  }

  reload(self: this) {
    self.loading = true;
    self.data.reloadCommentWhere(self.gds.smqUser || self.gds.smqGuest, "RECORD_ID()='" + self.id + "'");
  }

  goBack() {
    this.router.navigateByUrl('effortless/data/comments')
  }
}
