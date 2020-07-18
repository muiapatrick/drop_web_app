import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LocalStoreService } from '../services/local-store.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private _router: Router, private _authService: AuthService, private _localStoreService: LocalStoreService,
    private _toastService: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          if (request.params.has('username') && request.params.has('password')) {
            this._toastService.error(error.error.error_description, 'Authentication Failed');
          }
          else if (request.params.has('grant_type') && request.params.get('grant_type') == 'password') {
            this._toastService.error(error.error.error_description, 'Authentication Failed');
          }
          else if (request.params.has('grant_type') && request.params.get('grant_type') == 'client_credentials') {
            this._toastService.error(error.error.error_description, 'Authentication Failed');
          }
          else {
            this._toastService.error('Your Session has expired!', 'Signed out');
            this._authService.logout();
            this._router.navigate(['/login']);
          }
          throwError(error);
        }

        if (error.status == 500) {
          this._toastService.error('An error occured, please try again later!');
        }
        
        if (error.status == 0) {
          this._toastService.error('Please check your connection', 'Network Error!');
        }

        return throwError(error);
      })
    );
  }
}
