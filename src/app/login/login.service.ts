import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { base_url } from '../constants/urls';
import { SnackbarService } from '../snackbar/snackbar.service';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  loginMember(body: any) {
    return this.http.post(
      base_url + 'superadmin/superadminlogin/',
      body,
      this.httpOptions
    );
  }
}
