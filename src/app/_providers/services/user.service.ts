import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStoreService } from './local-store.service';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { ShopOperator } from 'src/app/_models/shop-operator';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.base_url;
  private user: null;

  constructor(private _router: Router, private _localStoreService: LocalStoreService,
      private _httpClient: HttpClient, private _toastr: ToastrService) { }

  getAuthenticatedUser(): User {
    const jwtHelper = new JwtHelperService();
    try {
      const decode = jwtHelper.decodeToken(this._localStoreService.getItem('access_token').access_token);
      this.user = decode.user;
      return decode.user;
    }
    catch(e) {
      this._localStoreService.clearLocalStorage();
      location.reload(true);
      this._router.navigate(['/login']);
    }
  }


  register(user) : Observable<any> {
    return this._httpClient.post<any>(this.baseUrl + "user", user);
  }

  updateShopOperator(id: string, operatorInfo: ShopOperator) {
    return this._httpClient.put<any>(this.baseUrl + "shop/operator/"+id, operatorInfo);
  }

  createShopOperator(operatorInfo: ShopOperator) {
    return this._httpClient.post<any>(this.baseUrl + "shop/operator", operatorInfo);
  }

  forgotPassword(username: string) : Observable<any> {
    return this._httpClient.post(this.baseUrl + "user/forgot_password?username="+username, null);
  }

  confirmToken(token: string) : Observable<any> {
    const params = new HttpParams()
      .set("token", token);
    return  this._httpClient.get(this.baseUrl + "user/confirmToken", {params : params});
  }

  resetPasswordByToken(credentials): Observable<any> {
    return this._httpClient.post<any>(this.baseUrl + 'user/confirm/reset_password', credentials);
  }

  resetPassword(credentials): Observable<any> {
    return this._httpClient.post<any>(this.baseUrl + 'user/reset_password', credentials);
  }

  getUsers(page: string, pageSize: string, id?:string, shopId?:string, shopNumber?:string, name?: string, phoneNumber?:string, emailAddress?:string, userNumber?:string,
    searchField?: string, searchValue?: string) : Observable<any>{
    let searchParams = new HttpParams()
    .set("page", page)
    .set("page_size", pageSize);
    if (id != null) {
      searchParams = searchParams.append("id", id);
    }
    if (name != null) {
      searchParams = searchParams.append("name", name);
    }
    if (shopId != null) {
      searchParams = searchParams.append("shop_id", shopId);
    }
    if(phoneNumber != null) {
      searchParams = searchParams.append("phone_number", phoneNumber);
    }
    if(emailAddress != null) {
      searchParams = searchParams.append("email_address", emailAddress);
    }
    if (shopNumber != null) {
      searchParams = searchParams.append("shop_number", shopNumber);
    }
    if (userNumber != null) {
      searchParams = searchParams.append("user_number", userNumber);
    }
    if (searchField != null && searchValue != null) {
      searchParams = searchParams.append(searchField, searchValue);
    }
    
    return this._httpClient.get<any>(this.baseUrl + "user", {params: searchParams})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            //client side error
          }
          else{
            if (error.status === 500) {
              this._toastr.error("An error occurred while getting users");
              return throwError(error);
            }
            if (error.status === 401) {
              return throwError(error);
            }
            if (error.status === 0) {
              this._toastr.error("Something went wrong, Please try again later");
              return throwError(error);
            }
          }
          this._toastr.error(error.error.api_code_description);
          return throwError(error);
        }),
      );
  }

  getSystemRoles(roleCategory?: string) : Observable<any>{
    let searchParams = new HttpParams();

    if (roleCategory != null) {
      searchParams = searchParams.append("category_id", roleCategory);
    }
    
    return this._httpClient.get<any>(this.baseUrl + "user/roles", {params: searchParams})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            //client side error
          }
          else{
            if (error.status === 500) {
              this._toastr.error("An error occurred while getting roles");
              return throwError(error);
            }
            if (error.status === 401) {
              return throwError(error);
            }
            if (error.status === 0) {
              this._toastr.error("Something went wrong, Please try again later");
              return throwError(error);
            }
          }
          this._toastr.error(error.error.api_code_description);
          return throwError(error);
        }),
      );
  }

}
