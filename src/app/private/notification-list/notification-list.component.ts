import { Component, OnInit } from '@angular/core';
import { WebsocketPush } from 'src/app/_models/websocket-push';
import { NotificationService } from 'src/app/_providers/services/notification.service';
import { UserService } from 'src/app/_providers/services/user.service';
import { User } from 'src/app/_models/user';
import { Page } from 'src/app/_models/page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  loading: boolean;
  messageList: WebsocketPush[] = [];
  user: User;
  page: Page = new Page();
  MAX_SIZE = 3;
  page_changed: boolean;


  constructor(private _userService: UserService, private _notificationService: NotificationService,
    private _router: Router) { }

  ngOnInit(): void {
    this.user = this._userService.getAuthenticatedUser();
    this.getNotifications();

    this._notificationService.messageChange.subscribe(m => {
      this.getNotifications();
    });
  }

  getNotifications() {
    this.messageList = [];
    this.loading = true;
    this.page.size = 13;
    this._notificationService.getNotifications((this.page.pageNumber).toString(), (this.page.size).toString(), null, this.user.id.toString(), '4', null)
      .subscribe(res => {
        console.log("Notifications : ")
        console.log(res.data)
        this.page.totalElements = res.meta.total_elements;

        this.page.totalPages = (res.meta.total_elements > 0 ? Math.ceil(res.meta.total_elements / this.page.size) : 0);
        this.messageList = res.data;
        this.loading = false;
      },
      error => {
        this.loading = false;
      });
  }

  pageChanged(event: any) {
    this.page.pageNumber = event.page;
    this.page_changed = true;
    this.getNotifications();
  }

  itemNumber(index: number) {
    return this.page_changed ? ((((this.page.pageNumber - 1) * this.page.size) + index) + 1) : index + 1;
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
