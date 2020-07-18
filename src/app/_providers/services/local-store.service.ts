import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {
  private _localStorage = window.localStorage;

  constructor() { }

  public setItem(key, value) {
    value = JSON.stringify(value);
    this._localStorage.setItem(key, value);
    return true;
  }

  public getItem(key) {
    const value = this._localStorage.getItem(key);
    try {
      return JSON.parse(value);
    }
    catch(e) {
      console.log(e);
      return null;
    }
  }

  public clearLocalStorage() {
    this._localStorage.clear();
  }
}
