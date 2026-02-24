import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorage {
  private _localStorage: Storage;

  private localStorageClearEvent = new Subject<void>();
  public localStorageClearEvent$ = this.localStorageClearEvent.asObservable();

  constructor() {
    this._localStorage = localStorage;
  }

  public set(key: string, value: string): void {
    this._localStorage.setItem(key, value);
  }

  get(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  }

  public setObject(key: string, value: any): void {
    return this.set(key, JSON.stringify(value));
  }

  public getObject(key: string, defaultReturnValue = '{}'): any {
    return JSON.parse(this.get(key) || defaultReturnValue);
  }

  public clear(): void {
    this._localStorage.clear();
    this.localStorageClearEvent.next();
  }
  public destroy(key: string): void {
    this._localStorage.removeItem(key);
    this.localStorageClearEvent.next();
  }

}
