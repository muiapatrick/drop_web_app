import { Injectable, OnDestroy } from '@angular/core';
import { over, Client, StompSubscription, Message } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketClientState } from 'src/app/_models/socket-client-state.enum';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { LocalStoreService } from './local-store.service';
import { User } from 'src/app/_models/user';
import { filter, first, switchMap, map } from 'rxjs/operators';
import { WebsocketPush } from 'src/app/_models/websocket-push';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy{
  private client: Client;
  private state: BehaviorSubject<SocketClientState>;
  private user: User;

  constructor(private _userService: UserService, private _ls: LocalStoreService) {
    let accessToken = _ls.getItem("access_token");
    this.user = _userService.getAuthenticatedUser();

    this.client = over(new SockJS(environment.base_url+"socket?access_token="+accessToken.access_token));
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.client.connect({}, () => {
      this.state.next(SocketClientState.CONNECTED);
    });
  }

  ngOnDestroy(): void {
    this.connect().pipe(first()).subscribe(client => client.disconnect(null));
  }

  private connect(): Observable<Client> {
    return new Observable<Client>(observer => {
      this.state.pipe(filter(state => state === SocketClientState.CONNECTED))
        .subscribe(() => {
          observer.next(this.client);
        });
    });
  }

  onMessage(topic: string, handler = WebsocketService.jsonHandler): Observable<any> {
    return this.connect().pipe(first(), switchMap(client => {
      return new Observable<any>(observer => {
        const subscription: StompSubscription = client.subscribe(topic, message => {
          observer.next(handler(message));
        });
        return ()=> client.unsubscribe(subscription.id);
      });
    }));
  }

  onPlainMessage(topic: string): Observable<string> {
    return this.onMessage(topic, WebsocketService.textHandler);
  }

  //sending messages
  send(topic: string, payload: any): void {
    this.connect().pipe(first()).subscribe(client => client.send(topic, {}, JSON.stringify(payload)));
  }

  static jsonHandler(message: Message): any {
    return JSON.parse(message.body);
  }

  static textHandler(message: Message): string {
    return message.body;
  }

  findAll(topic: string): Observable<WebsocketPush[]>  {
    return this.onMessage(topic)
      .pipe(first(), map(messages => messages.map(WebsocketService.getWebSocketMessages)))
  }

  static getWebSocketMessages(message: any): WebsocketPush {
    return {...message};
  }
  



}
