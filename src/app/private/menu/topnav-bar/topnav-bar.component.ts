import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AuthService } from 'src/app/_providers/services/auth.service';
import { OpenShopsService } from 'src/app/_providers/services/open-shops.service';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_providers/services/user.service';

@Component({
  selector: 'topnav-bar',
  templateUrl: './topnav-bar.component.html',
  styleUrls: ['./topnav-bar.component.scss']
})
export class TopnavBarComponent implements OnInit {
  openshops_count: number = 0;
  currentPosition: any;
  user: User;

  constructor(private _authService : AuthService, private _userService: UserService, private _openshopsService: OpenShopsService) {
    this._openshopsService.shopsCountChange.subscribe((value) => {
      this.openshops_count = value.length;
    });
  }

  ngOnInit(): void {
    this.user = this._userService.getAuthenticatedUser();
    this._openshopsService.currentPosition.subscribe(currentPosition => {
      this.currentPosition = currentPosition;
    });
  }

  ngAfterViewInit() {
  }

  toggleClicked(elementId: any) {
    // var target = event.srcElement.id;
    var body = $("#private_section");
    var menu = $("#sidebar-menu");

    // toggle small or large menu
    if (body.hasClass("nav-md")) {
      menu.find("li.active ul").hide();
      menu
        .find("li.active")
        .addClass("active-sm")
        .removeClass("active");
    } else {
      menu.find("li.active-sm ul").show();
      menu
        .find("li.active-sm")
        .addClass("active")
        .removeClass("active-sm");
    }
    body.toggleClass("nav-md nav-sm");
  }

  logout() {
    console.log("Logout");
    this._authService.logout();
  }

}
