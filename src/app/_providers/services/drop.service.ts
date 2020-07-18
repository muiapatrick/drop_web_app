import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Dropitem } from 'src/app/_models/dropitem';
import { ShopLocation } from 'src/app/_models/shop-location';
import { ItemStatus } from 'src/app/_models/item-status';
import { ItemPay } from 'src/app/_models/item-pay';

@Injectable({
  providedIn: 'root'
})
export class DropService {
  private baseUrl = environment.base_url;
  private itemData = new BehaviorSubject(null);
  currentItemData = this.itemData.asObservable();
  private itemStatus = new BehaviorSubject(null);
  currentItemStatus = this.itemStatus.asObservable();
  private itemAction = new BehaviorSubject(null);
  currentItemAction = this.itemAction.asObservable();
  private shopLocation = new BehaviorSubject(null);
  selectedShopLoc = this.shopLocation.asObservable();

  constructor(private _httpClient: HttpClient, private _toastr: ToastrService) { }

  public setItemData(item: Dropitem) {
    this.itemData.next(item);
  }

  public setItemStatus(status: string) {
    this.itemStatus.next(status);
  }

  public setItemAction(action: string) {
    this.itemAction.next(action);
  }

  public setShopLocation(loc: ShopLocation) {
    this.shopLocation.next(loc);
  }

  dropItem(item) : Observable<any> {
    return this._httpClient.post<any>(this.baseUrl + "drop", item);
  }

  updateItem(id: string, item) : Observable<any> {
    return this._httpClient.put<any>(this.baseUrl + "drop/"+id, item);
  }

  updateItemStatus(id: string, statusInfo: ItemStatus): Observable<any> {
    return this._httpClient.put<any>(this.baseUrl + "drop/status/"+id, statusInfo);
  }

  payItem(id: string, payInfo: ItemPay) {
    return this._httpClient.post<any>(this.baseUrl + "fund/pay/"+id, payInfo);
  }
  
  getItems(page: string, pageSize: string, userId?:string, shopId?:string, searchField?: string, searchFieldValue?:string, statuses?: string, shopNumber?:string) : Observable<any>{
    let searchParams = new HttpParams()
    .set("page", page)
    .set("page_size", pageSize);
        
    if (userId != null) {
      searchParams = searchParams.append("user_id", userId);
    }
    if (shopId != null) {
      searchParams = searchParams.append("shop_id", shopId);
    }
    if (searchField != null && searchFieldValue != null) {
      searchParams = searchParams.append(searchField, searchFieldValue);
    }
    if (statuses != null && statuses != undefined) {
      searchParams = searchParams.append("statuses", statuses);
    }
    if(shopNumber != null) {
      searchParams = searchParams.append("shop_number", shopNumber);
    }

    return this._httpClient.get<any>(this.baseUrl + "drop", {params: searchParams})
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
          // this._toastr.error(error.error.api_code_description);
          return throwError(error);
        }),
      );
  }

  getDropStats(shopId?:string, shopNumber?:string, weekDate?:string) : Observable<any>{
    let searchParams = new HttpParams();
        
    if (shopId != null) {
      searchParams = searchParams.append("shop_id", shopId);
    }

    if(shopNumber != null) {
      searchParams = searchParams.append("shop_number", shopNumber);
    }

    if(weekDate != null) {
      searchParams = searchParams.append("week_date", weekDate);
    }

    return this._httpClient.get<any>(this.baseUrl + "drop/stats", {params: searchParams})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            //client side error
          }
          else{
            if (error.status === 500) {
              this._toastr.error("An error occurred while getting shop drop statistics");
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
          // this._toastr.error(error.error.api_code_description);
          return throwError(error);
        }),
      );
  }


}