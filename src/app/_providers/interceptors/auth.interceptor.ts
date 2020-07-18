import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { LocalStoreService } from '../services/local-store.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  baseUrl = environment.base_url;

  constructor(private _authService: AuthService, private _localStoreService: LocalStoreService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this._localStoreService.getItem('access_token');
    console.log("REQUEST :: "+request);
    if (request.params.has('username') && request.params.has('password')) {
      return next.handle(request);
    }
    if (request.params.has('grant_type') && request.params.get('grant_type') == 'password') {
      return next.handle(request);
    }
    if (request.params.has('grant-type') && request.params.get('grant_type') == 'client_credentials') {
      return next.handle(request);
    }
    if (token != null && token !== undefined) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer '+token.access_token,
          Accept: 'application/json'
        }
      });
    }
    return next.handle(request);
  }
}
