import { Component, OnInit } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { EffortlessComponentBase } from '../../efforless-base-component';
import { GDS } from '../../services/gds.service';
import { DataEndpoint } from '../../services/eapi-data-services/data-endpoint/data-endpoint';
import { NbMenuService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { UserDialogComponent } from './user-dialog/user-dialog.component'

@Component({
  selector: 'eapi-data-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends EffortlessComponentBase implements OnInit {
  searchText : string = '';
  users: any[] = [];
  filteredUsers: any;
  allowDelete : boolean = false;
  allowAdd : boolean = false;

  constructor(public gds : GDS, public data : DataEndpoint, public route : ActivatedRoute, 
            protected menuService : NbMenuService, public router : Router, public dialogService: NbDialogService) { 
    super(gds, data, menuService);
    this.safeSubscribe(this.data.onUsersChange().subscribe(users => {
      this.users = users;
      this.filterNow();
    }));
  }

  onGdsReady() {
    var user = this.gds.smqUser || this.gds.smqGuest;
    this.allowDelete = !!user.DeleteUser;
    this.allowAdd = !!user.AddUser;
    this.reload(this);
  }

  filterNow() {
    this.filteredUsers = this.users.filter(user => !this.searchText || user.Name.toLowerCase().includes((this.searchText + '').toLowerCase()));      
  }

  reload(self: this) {
    self.data.reloadUsers(self.gds.smqUser || self.gds.smqGuest);
  }

  goToUser(id) {
    this.router.navigateByUrl('effortless/data/users/user/' + id);
  }

  
  openAddDialog() {
    this.dialogService.open(UserDialogComponent, { context: null, autoFocus: false});
  }

  goBack() {
    this.router.navigateByUrl('effortless/data');
  }

  deleteUser(userToDelete) {
    if (confirm('Are you sure?')) {
      var payload = this.gds.createPayload();
      payload.User = userToDelete;
      this.gds.smqUser.DeleteUser(payload).then((reply) => {
        if (reply.ErrorMessage) {
          alert(reply.ErrorMessage)
        } else {
          this.reload(this)
        }
      });
    }
  }
   
  addUser(userToAdd) {
    var payload = this.gds.createPayload();
    payload.User = userToAdd;
    (this.gds.smqUser || this.gds.smqGuest).AddUser(payload).then((reply) => {
      if (reply.ErrorMessage) {
        alert(reply.ErrorMessage)
      } else {
        this.router.navigateByUrl('effortless/data/users/user/' + reply.User.UserId);
      }
    });
  }
}
