import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocalStoreService } from './local-store.service';
import { Router } from '@angular/router';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Rawtoken } from 'src/app/_models/rawtoken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.base_url;
  authenticated: boolean;
  private jwtHelper = new JwtHelperService();

  constructor(private _localStorageServie: LocalStoreService, private _router: Router,
      private httpClient: HttpClient) {
        this.checkAuth();
  }

  
  checkAuth() {
    this.authenticated = this._localStorageServie.getItem('access_token');
  }

  login(credentials): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization': 'Basic '+btoa(environment.public_key + ':' + environment.private_key)
    });

    const params = new HttpParams()
      .set('username', credentials.username)
      .set('password', credentials.password)
      .set('grant_type', environment.grant_type);

    const options = { headers: httpHeaders, params: params };
    return this.httpClient.post<Token>(this.baseUrl + "authenticate", null, options);
  }

  authenticateApp() : Observable<Rawtoken> {
      const httpHeaders = new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization': 'Basic '+btoa(environment.public_key + ':' + environment.private_key)
      });

      const params = new HttpParams()
      .set('grant_type', environment.grant_type_client);

      const options = { headers: httpHeaders, params: params };
      return this.httpClient.post<Rawtoken>(this.baseUrl + "authenticate", null, options);
  }

  logout() {
    this.authenticated = false;
    this._localStorageServie.clearLocalStorage();
    location.reload(true);
    this._router.navigate(['/login']);
  }

  public get isTokenExpired(): boolean {
    let accessToken = null;
    try {
      accessToken = this._localStorageServie.getItem('access_token').access_token;
    }
    catch(e) {
      console.log("IS TOKEN EXPIRED :: "+e);
      accessToken = null;
    }
    return this.jwtHelper.isTokenExpired(accessToken, 15);
  }
}
