import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NearestShop } from 'src/app/_models/nearest-shop';
import { Shop } from 'src/app/_models/shop';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private baseUrl = environment.base_url;
  private shopIdSource = new BehaviorSubject('default message');
  shopId = this.shopIdSource.asObservable();
  openShopsChange = new BehaviorSubject(null);
  nearOpenShop = this.openShopsChange.asObservable();

  constructor(private _httpClient: HttpClient, private _toastr: ToastrService) {
  }

  createShop(shop) : Observable<any> {
    return this._httpClient.post<any>(this.baseUrl + "shop", shop);
  }

  updateShop(id: string, shop) : Observable<any> {
    return this._httpClient.put<any>(this.baseUrl + "shop/"+id, shop);
  }

  getShops(page: string, pageSize: string, userId?:string, shopIds?:string, shopName?: string, shopNumber?:string) : Observable<any>{
    let searchParams = new HttpParams()
    .set("page", page)
    .set("page_size", pageSize);
    if (shopName != null) {
      searchParams = searchParams.append("shop_name", shopName);
    }
    if (shopIds != null) {
      searchParams = searchParams.append("ids", shopIds);
    }
    if(userId != null) {
      searchParams = searchParams.append("operator_id", userId);
    }
    if(shopNumber != null) {
      searchParams = searchParams.append("shop_number", shopNumber);
    }

    
    return this._httpClient.get<any>(this.baseUrl + "shop", {params: searchParams})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            //client side error
          }
          else{
            if (error.status === 500) {
              this._toastr.error("An error occurred while getting shops");
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

  changeShopId(shopId: string) {
    this.shopIdSource.next(shopId);
  }

  changeOpenShops(openShops: any) {
    console.log("CHANGE SHOPS");
    console.log(openShops);
    this.openShopsChange.next(openShops);
  }
}
