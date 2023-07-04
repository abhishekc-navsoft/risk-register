import { catchError, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Observable, throwError, EMPTY, Subject } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { AccountService } from './account.service';
import { AuthService } from './auth-service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { base_url } from './constants/urls';
import { LocalStorageService } from './constants/storage/local-storage.service';
import { SnackbarService } from './snackbar/snackbar.service';
import { sessionStorageService } from './constants/storage/session-storage.service';

@Injectable()
export class ExtendHttpInterceptor implements HttpInterceptor {
  private refreshSubject: Subject<any> = new Subject<any>();
  private maintananceSubject: Subject<any> = new Subject<any>();
  target: any;
  activeUser: any;
  constructor(
    private router: Router,
    private accountService: AccountService,
    private authService: AuthService,
    private localstorageservice: LocalStorageService,
    private snackbarService: SnackbarService,
    private sessionStorage: sessionStorageService
  ) {
    this.activeUser =
      this.sessionStorage.getItemFromSessionStorage('currentUser');
    console.log('activeUser in extended', this.activeUser);
  }

  // intercept(
  //   request: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   if (request.url.substr(0, 4) === 'http') {
  //     return next.handle(request);
  //   }
  //   const _this = this;
  //   console.log('intercept request', request);
  //   return next.handle(
  //     // _this.updateHeader(request).pipe(
  //     //   catchError((error: HttpErrorResponse) => {
  //     //     if (_this._checkSessionExpiryErr(error)) {
  //     //       return _this._ifSeasonExpiredN().pipe(
  //     //         switchMap(() => {
  //     //           return next.handle(_this.updateHeader(request));
  //     //         })
  //     //       );
  //     //     }
  //     //     return throwError(error);
  //     //   })
  //     // )
  //     this.updateHeader(request)
  //   );
  // }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.activeUser && this.activeUser && this.activeUser['token']) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `Token ${this.activeUser['token']}`,
        },
      });
    }
    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err.status === 401) {
          this.authService.doLogout();
        }
        const error = err['error']['detail'];
        this.snackbarService.OpenSnackBar(error, {
          panelClass: 'snackbarerror',
        });
        return throwError(error);
      })
    );
  }

  _ifSeasonExpiredN(): any {
    const _this = this;
    _this.refreshSubject.subscribe({
      complete: () => {
        _this.refreshSubject = new Subject<any>();
      },
    });
    if (_this.refreshSubject.observers.length === 1) {
      _this.target = _this.router['location']._platformLocation.location.href;
      _this.authService.doLogout().then((refreshSubject: any) => {
        _this.refreshSubject.next(refreshSubject);
        let NavigationExtras: NavigationExtras = {
          queryParams: { target: _this.target },
        };
        _this.router.navigate(['login'], NavigationExtras);
      });
      return _this.refreshSubject;
    }
  }
  updateHeader(request: any) {
    console.log('request', request);
    request = request.clone({
      headers: request.headers.set('Accept', 'application/json'),
      withCredentials: false,
    });
    request = request.clone({
      headers: request.headers.append(
        'Cache-Control',
        'no-cache',
        'no-store',
        'must-revalidate',
        'post-check=0',
        'pre-check=0'
      ),
      withCredentials: true,
    });
    request = request.clone({
      headers: request.headers.append('Pragma', 'no-cache'),
      withCredentials: true,
    });
    request = request.clone({
      headers: request.headers.append('SameSite', 'None'),
      withCredentials: true,
    });
    request = request.clone({
      headers: request.headers.append('Expires', '0'),
      withCredentials: true,
    });
    request = request.clone({
      url: base_url + request.url,
      responseType: 'json',
    });
    request = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    console.log('modify request', request);
    return request;
  }
  _checkSessionExpiryErr(error: HttpErrorResponse) {
    return error.status && error.status === 419;
  }
}
