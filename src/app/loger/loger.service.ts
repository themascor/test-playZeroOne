import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogerService {
  /** Show or hide console log */
  public show = false;
  constructor() {}
  /** Use for replace console.log */
  public log(...args) {
    if (this.show) {
      console.log(...args);
    }
  }
}
