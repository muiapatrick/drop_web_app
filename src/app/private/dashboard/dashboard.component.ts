import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { LocalStoreService } from 'src/app/_providers/services/local-store.service';
import { UserService } from 'src/app/_providers/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading: boolean;
  
  constructor() {}

  ngOnInit(): void {

  }


  // sidenav_slim: boolean
  // showSpinner: boolean;
  // user: User;
  
  // items = [
  //   {tag_number: "Item 1"},
  //   {tag_number: "Item 2"},
  //   {tag_number: "Item 2"},
  //   {tag_number: "Item 2"},{tag_number: "Item 2"},{tag_number: "Item 2"},{tag_number: "Item 2"},{tag_number: "Item 2"},
  //   {tag_number: "Item 2"},{tag_number: "Item 2"},{tag_number: "Item 2"},{tag_number: "Item 2"},{tag_number: "Item 2"},
  //   {tag_number: "Item 2"}
  // ];

  // constructor(private _ls : LocalStoreService, private _userService: UserService) { }

  // ngOnInit(): void {
  //   this.showSpinner = true;
  //   this.user = this._userService.getAuthenticatedUser();
    
  // }

  // slimNavBar(sidenav: any) {
  //   sidenav.toggleSlim();
  //   this.sidenav_slim = true;
  // }

  // expandSideNavBar(sidenav: any) {
  //   sidenav.toggleSlim();
  //   this.sidenav_slim = false;
  // }

}
