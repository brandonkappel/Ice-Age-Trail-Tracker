import { Component, OnInit } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { EffortlessComponentBase } from '../../efforless-base-component';
import { GDS } from '../../services/gds.service';
import { DataEndpoint } from '../../services/eapi-data-services/data-endpoint/data-endpoint';
import { NbMenuService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { CommentDialogComponent } from './comment-dialog/comment-dialog.component'

@Component({
  selector: 'eapi-data-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent extends EffortlessComponentBase implements OnInit {
  searchText : string = '';
  comments: any[] = [];
  filteredComments: any;
  allowDelete : boolean = false;
  allowAdd : boolean = false;

  constructor(public gds : GDS, public data : DataEndpoint, public route : ActivatedRoute,
            protected menuService : NbMenuService, public router : Router, public dialogService: NbDialogService) {
    super(gds, data, menuService);
    this.safeSubscribe(this.data.onCommentsChange().subscribe(comments => {
      this.comments = comments;
      this.filterNow();
    }));
  }

  onGdsReady() {
    var user = this.gds.smqUser || this.gds.smqGuest;
    this.allowDelete = !!user.DeleteComment;
    this.allowAdd = !!user.AddComment;
    this.reload(this);
  }

  filterNow() {
    this.filteredComments = this.comments.filter(comment => !this.searchText || comment.Name.toLowerCase().includes((this.searchText + '').toLowerCase()));
  }

  reload(self: this) {
    self.data.reloadComments(self.gds.smqUser || self.gds.smqGuest);
  }

  goToComment(id) {
    this.router.navigateByUrl('effortless/data/comments/comment/' + id);
  }


  openAddDialog() {
    this.dialogService.open(CommentDialogComponent, { context: null, autoFocus: false});
  }

  goBack() {
    this.router.navigateByUrl('effortless/data');
  }

  deleteComment(commentToDelete) {
    if (confirm('Are you sure?')) {
      var payload = this.gds.createPayload();
      payload.Comment = commentToDelete;
      this.gds.smqUser.DeleteComment(payload).then((reply) => {
        if (reply.ErrorMessage) {
          alert(reply.ErrorMessage)
        } else {
          this.reload(this)
        }
      });
    }
  }

  addComment(commentToAdd) {
    var payload = this.gds.createPayload();
    payload.Comment = commentToAdd;
    (this.gds.smqUser || this.gds.smqGuest).AddComment(payload).then((reply) => {
      if (reply.ErrorMessage) {
        alert(reply.ErrorMessage)
      } else {
        this.router.navigateByUrl('effortless/data/comments/comment/' + reply.Comment.CommentId);
      }
    });
  }
}
