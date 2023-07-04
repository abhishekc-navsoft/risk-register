import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class sessionStorageService {
  constructor() {}
  setItemOnSessionStorage(itemName: any, itemValue: any) {
    sessionStorage.setItem(itemName, JSON.stringify(itemValue));
  }
  getItemFromSessionStorage(itemname: any) {
    const itemValue = sessionStorage.getItem(itemname);
    return itemValue;
    // if (sessionStorage.getItem(itemname) !== undefined) {
    //   return JSON.parse(itemValue !== null ? JSON.parse(itemValue) : null);
    // }
  }
  removeItemFromSessionStorage(itemName: any) {
    sessionStorage.removeItem(itemName);
  }
  clearSessionStorage() {
    for (let index = 0; index < sessionStorage.length; index++) {
      const itemValue = sessionStorage.key(index);
      sessionStorage.removeItem(itemValue !== null ? itemValue : '');
      index = index - 1;
    }
  }
}
