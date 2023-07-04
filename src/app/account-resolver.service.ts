import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageService } from './constants/storage/local-storage.service';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class AccountResolverService implements Resolve<any> {
  constructor(private accountService: AccountService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.getAccountInfoById();
  }
}
