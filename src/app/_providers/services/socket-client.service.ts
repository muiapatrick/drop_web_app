import { Injectable, OnDestroy } from '@angular/core';
// import { StompSubscription } from '@stomp/stompjs';
// import { Client, over, Message } from 'stompjs';
import { Client, Message, over, StompSubscription } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketClientState } from 'src/app/_models/socket-client-state.enum';
import { environment } from 'src/environments/environment';
import * as SockJS from 'sockjs-client';
import { filter, first, switchMap, retry, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketClientService implements OnDestroy {
  private client: Client;
  private state: BehaviorSubject<SocketClientState>;

  constructor() {
    this.client = over(new SockJS(environment.api));
    // this.client = over(new SockJS(environment.wocket_url));
    // this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    // this.client.connect({}, () => {
    //   this.state.next(SocketClientState.CONNECTED);
    // });
  }

  private connect(): Observable<Client> {
    return new Observable<Client>(observer => {
      this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
        observer.next(this.client);
      })
    });
  }

  onMessage(topic: string, handler = SocketClientService.jsonHandler): Observable<any> {
    return this.connect().pipe(first(), switchMap(client => {
      return new Observable<any>(observer => {
        const subscription: StompSubscription = client.subscribe(topic, message => {
          observer.next(handler(message));
        });

        return () => client.unsubscribe(subscription.id);
      });
    }));
  }

  onPlainMessage(topic: string): Observable<string> {
    return this.onMessage(topic, SocketClientService.textHandler);
  }

  send(topic: string, payload: any): void {
    this.connect().pipe(first())
      .subscribe(client => client.send(topic, {}, JSON.stringify(payload)));
  }

  ngOnDestroy(): void {
    this.connect().pipe(first()).subscribe(client => client.disconnect(null));
  }

  static jsonHandler(message: Message) : any {
    return JSON.parse(message.body);
  }

  static textHandler(message: Message) : string {
    return message.body;
  }
}
