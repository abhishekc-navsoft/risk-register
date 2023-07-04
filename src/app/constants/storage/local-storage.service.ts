import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  dont_delete_localstorage = [
    'ynw-locdet',
    'ynw-createprov',
    'supportName',
    'refreshToken',
    'supportPass',
    'userType',
    'version',
    'activeSkin',
    'qrp',
    'authToken',
    'reqForm',
    'source',
    'translatevariable',
    'order',
  ];
  constructor() {}
  public getItemFromLocalStorage(itemName: any) {
    if (localStorage.getItem(itemName) !== undefined) {
      let a: any = localStorage.getItem(itemName);
      return JSON.parse(a);
    }
  }
  public setItemLocalStorage(itemName: any, itemValue: any) {
    return localStorage.setItem(itemName, JSON.stringify(itemValue));
  }
  public removeItemFromLocalStorage(itemName: any) {
    return localStorage.removeItem(itemName);
  }
  // public clearLocalStorage(){
  //   this.removeItemFromLocalStorage('ynw-credentials');
  //   let localStorgaeKey:any=this.dont_delete_localstorage.indexOf(localStorage.key(index));
  //   for(let index=0;index<localStorage.length;index++){
  //     if(localStorgaeKey===-1){}
  //   }
  // }
}
