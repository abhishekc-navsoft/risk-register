import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { sessionStorageService } from './session-storage.service';
@Injectable({
  providedIn: 'root',
})
export class groupStorageService {
  constructor(
    private sessionStorageService: sessionStorageService,
    private localStorageSErvice: LocalStorageService
  ) {}
  public getGroup() {
    if (this.sessionStorageService.getItemFromSessionStorage('currentUser')) {
      return this.sessionStorageService.getItemFromSessionStorage(
        'currentUser'
      );
    } else {
      return 0;
    }
  }
  setItemToGroupStorage(itemname: any, itemValue: any) {
    const group = this.getGroup();
    let groupObj: any = {};
    if (this.localStorageSErvice.getItemFromLocalStorage(group)) {
      groupObj = JSON.parse(
        this.localStorageSErvice.getItemFromLocalStorage(group)
      )
        ? JSON.parse(this.localStorageSErvice.getItemFromLocalStorage(group))
        : {};
      if (groupObj) {
        groupObj[itemname] = itemValue;
      } else {
        groupObj[itemname] = itemValue;
      }
    }
  }
  getItemFromGroupStorage(itemname: any, type?: any) {
    let group;
    if (type) {
      group = 0;
    } else {
      group = this.getGroup();
    }
    if (this.localStorageSErvice.getItemFromLocalStorage(group)) {
      const groupObj = JSON.parse(
        this.localStorageSErvice.getItemFromLocalStorage(group)
      );
      if (
        groupObj[itemname] ||
        (itemname === 'isCheckin' && groupObj[itemname] !== undefined)
      ) {
        return groupObj[itemname];
      }
    }
  }
  removeItemFromGroupStorage(itemname: any) {
    const group = this.getGroup();
    const groupObj = JSON.parse(
      this.localStorageSErvice.getItemFromLocalStorage(group)
    );
    if (groupObj[itemname]) {
      delete groupObj[itemname];
      this.localStorageSErvice.setItemLocalStorage(
        group,
        JSON.stringify(groupObj)
      );
    }
  }
}
