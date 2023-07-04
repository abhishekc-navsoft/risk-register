import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth-service';
import { LocalStorageService } from './constants/storage/local-storage.service';
import { sessionStorageService } from './constants/storage/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private subject = new Subject<any>();
  getMessage() {
    this.subject.asObservable();
  }
  sendMessage(message: any) {
    this.subject.next(message);
  }
  constructor(
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private sessionStorage: sessionStorageService
  ) {}
  getAccountInfoById() {
    const _this = this;
    let target = _this.router['location'].href;
    _this.localStorageService.setItemLocalStorage('currentUser', target);
    console.log(
      'account servicre',
      _this.localStorageService.setItemLocalStorage('currentUser', target)
    );
    return new Promise((resolve, reject) => {
      this.authService.goThroughLogin().then((status: any) => {
        if (status) {
          console.log('status_account_service', status);
          resolve(true);
        } else {
          _this.router.navigate(['login']);
          resolve(true);
        }
      });
    });
  }
}
