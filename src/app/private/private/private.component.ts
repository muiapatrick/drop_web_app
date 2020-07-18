import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_providers/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/_providers/services/post.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {
  user: User;
  constructor(private _userService: UserService, private _router: Router, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.user = this._userService.getAuthenticatedUser();
    if (this.user.shops != undefined && this.user.shops.length > 0) {
      let pathname = window.location.pathname.split("/").pop();
      if(pathname == 'drop') {
        this._router.navigate(['drop/shops']);
      }
      return;
    }
  }

  signOut() {
    
  }

}
