import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AuthService } from 'src/app/_providers/services/auth.service';
import { OpenShopsService } from 'src/app/_providers/services/open-shops.service';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_providers/services/user.service';
import { WebsocketService } from 'src/app/_providers/services/websocket.service';
import { WebsocketPush } from 'src/app/_models/websocket-push';
import { NotificationService } from 'src/app/_providers/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'topnav-bar',
  templateUrl: './topnav-bar.component.html',
  styleUrls: ['./topnav-bar.component.scss']
})
export class TopnavBarComponent implements OnInit {
  openshops_count: number = 0;
  currentPosition: any;
  user: User;
  messageList: WebsocketPush[] = [];
  messageCount: number = 0;

  constructor(private _authService : AuthService, private _userService: UserService, private _openshopsService: OpenShopsService,
    private _notificationService: NotificationService, private _websocketService: WebsocketService, private _router: Router) {
    this._openshopsService.shopsCountChange.subscribe((value) => {
      this.openshops_count = value.length;
    });
  }

  ngOnInit(): void {
    this.user = this._userService.getAuthenticatedUser();
    //fetch the unread notifications
    this.getNotifications();

    this._notificationService.messageChange.subscribe(m => {
      this.getNotifications();
    });

    this._openshopsService.currentPosition.subscribe(currentPosition => {
      this.currentPosition = currentPosition;
    });

    // 'topic/user_id/drop'
    // 'topic/user_id/shop_id/drop'
    this._websocketService.onMessage('/topic/'+this.user.id+'/drop').subscribe(message => {
      this.messageList.push(message);
      this.messageCount = this.messageCount + 1;
      console.log("MESSAGES")
      console.log(message)
    });

    //subscribe for the shops
    this.user.shops.forEach(s => {
      this._websocketService.onMessage('/topic/'+s.id+'/'+this.user.id+'/shop').subscribe(message => {
        this.messageList.push(message);
        this.messageCount = this.messageCount + 1;
        console.log("MESSAGES")
        console.log(message)
      });
    });
  }

  getNotifications() {
    this.messageList = [];
    this.messageCount = this.messageCount > 0 ? this.messageCount - 1 : 0;
    //fetch the unread notifications
    this._notificationService.getNotifications(null, null, null, this.user.id.toString(), '4', 'false')
      .subscribe(res => {
        this.messageList = res.data;
        this.messageCount = this.messageList.length;

        console.log(this.messageList)
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

  viewAll() {
    console.log("VIEW ALL")
    this._router.navigate(['/drop/notifications']);
  // [routerLink]="['/drop/notifications']"
  }

  openMessage(message: WebsocketPush) {
    // console.log("MESSAGE")
    // console.log(message)
    //update the notification to read
    if(!message.read) {
      message.read = true;
      this._notificationService.updateNotification(message.id.toString(), message)
        .subscribe(res => {
          console.log("RESPONSE")
          console.log(res.data)
          this._notificationService.changeNotification(res.data);
        });
    }


    // if(message.channel_id == 1) {
    //   //drop items
    //   if(message.notification_category == 5) {
    //     //drop status change
    //     //open items for the user
        
    //   }
    // }
    // else if(message.channel_id == 2) {
    //   //shop channel
    //   if(message.notification_category == 5) {
    //     //drop status change
    //     //open items list for the shop
    //   }
    // }
  }

}
