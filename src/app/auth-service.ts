import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ServiceMeta } from './constants/service-meta/service-meta';
import { LocalStorageService } from './constants/storage/local-storage.service';
import { LoginService } from './login/login.service';
import { sessionStorageService } from './constants/storage/session-storage.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private subject = new Subject<any>();
  getMessage() {
    this.subject.asObservable();
  }
  sendMessage(message: any) {
    this.subject.next(message);
  }
  constructor(
    private serviceMeta: ServiceMeta,
    private localstorageservice: LocalStorageService,
    private loginService: LoginService,
    private sessionStorage: sessionStorageService
  ) {}
  login(post_data: any) {
    console.log('post_data', post_data);
    const _this = this;
    _this.localstorageservice.setItemLocalStorage('currentUser', true);
    // post_data.mUniqueid =
    //   _this.localstorageservice.getItemFromLocalStorage('currentUser');
    console.log(post_data);
    const promise = new Promise((resolve, reject) => {
      _this.loginService.loginMember(post_data).subscribe(
        (data: any) => {
          console.log('login data', data);
          // _this.localstorageservice.removeItemFromLocalStorage('currentUser');
          // _this.setLoginData(data, post_data);
          resolve(data);
          _this.localstorageservice.setItemLocalStorage(
            'currentUser',
            data['data']
          );
          this.sessionStorage.setItemOnSessionStorage('currentUser', data);
        },
        (error: any) => {
          console.log('auth service error', error);
          if (error && error.status === 401) {
            _this.doLogout().then(() => {
              _this.login(post_data);
            });
          }
          reject(error);
        }
      );
    });
    return promise;
  }
  setLoginData(data: any, post_data: any) {
    this.localstorageservice.setItemLocalStorage('isBusinessOwner', 'true');
    if (post_data['password']) {
      delete post_data['password'];
    }
    this.localstorageservice.setItemLocalStorage(
      'currentUser',
      JSON.stringify(post_data)
    );
    this.sessionStorage.setItemOnSessionStorage('currentUser', data['data']);
  }
  doLogout() {
    const _this = this;
    return new Promise((resolve, reject) => {
      this.localstorageservice.removeItemFromLocalStorage('currentUser');
      _this.localstorageservice.removeItemFromLocalStorage('logout');
      resolve(true);
    });
  }
  forgetPassword(post_data: any) {
    this.serviceMeta.httpPost('', post_data);
  }
  chnagePassword(type: string, otp: any, post_data: { password: any }) {
    return this.serviceMeta.httpPost('', post_data);
  }

  logout() {
    this.serviceMeta.httpDelete('');
  }
  goThroughLogin() {
    const _this = this;
    return new Promise((resolve, reject) => {
      if (
        _this.localstorageservice.getItemFromLocalStorage('ynw_credentials')
      ) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }
}
