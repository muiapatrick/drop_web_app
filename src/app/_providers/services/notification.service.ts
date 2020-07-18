import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { WebsocketPush } from 'src/app/_models/websocket-push';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // // messageList: WebsocketPush[] = [];
  // messageList: Subject<WebsocketPush[]> = new Subject<WebsocketPush[]>();
  // messageListChange: any = this.messageList.asObservable();
  private message = new BehaviorSubject(null);
  messageChange = this.message.asObservable();

  constructor(private _httpClient: HttpClient, private _websocketService: WebsocketService) { }

  public changeNotification(message: WebsocketPush) {
    this.message.next(message);
  }

  getNotifications(page?: string, pageSize?: string, id?:string, userId?:string, notificationId?:string, read?:string) : Observable<any>{
    let searchParams = new HttpParams();

    if (page != null) {
      searchParams = searchParams.append("page", page);
    }
    if (pageSize != null) {
      searchParams = searchParams.append("page_size", pageSize);
    }
    if (id != null) {
      searchParams = searchParams.append("id", id);
    }
    if(userId != null) {
      searchParams = searchParams.append("user_id", userId);
    }
    if(notificationId != null) {
      searchParams = searchParams.append("notification_id", notificationId);
    }
    if(read != null) {
      searchParams = searchParams.append("read", read);
    }

    return this._httpClient.get<any>(environment.base_url + "wspush", {params: searchParams})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            //client side error
          }
          else{
            if (error.status === 500) {
              return throwError(error);
            }
            if (error.status === 401) {
              return throwError(error);
            }
            if (error.status === 0) {
              return throwError(error);
            }
          }
          return throwError(error);
        }),
      );
  }

  updateNotification(id: string, message: WebsocketPush) {
    return this._httpClient.put<any>(environment.base_url + "wspush/"+id, message);
  }
}
