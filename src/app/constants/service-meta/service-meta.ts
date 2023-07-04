import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class ServiceMeta {
  constructor(private http: HttpClient) {}

  getJSON(path: any): Observable<any> {
    return this.http.get(path);
  }
  httpGet(url: any, header?: any, params?: any) {
    const options: any = {}; //cretae a req option
    if (header) {
      const httpHeads = new HttpHeaders(header);
      options.headers = httpHeads;
    }
    if (params) {
      let httpParams = new HttpParams();
      Object.keys(params).forEach((key: any) => {
        httpParams = httpParams.append(key, params[key]);
      });
      options.params = httpParams;
      options.showLoader = true;
    }
    return this.http.get(url, options);
  }
  httpPost(url: any, body?: any, header?: any, params?: any) {
    const options: any = {}; //cretae a req option
    if (header) {
      const httpHeads = new HttpHeaders(header);
      options.headers = httpHeads;
    }
    if (params) {
      let httpParams = new HttpParams();
      Object.keys(params).forEach((key: any) => {
        httpParams = httpParams.append(key, params[key]);
      });
      options.params = httpParams;
      options.showLoader = true;
    }
    return this.http.post(url, body, options);
  }
  httpPatch(url: any, body?: any, header?: any, params?: any) {
    const options: any = {}; //cretae a req option
    if (header) {
      const httpHeads = new HttpHeaders(header);
      options.headers = httpHeads;
    }
    if (params) {
      let httpParams = new HttpParams();
      Object.keys(params).forEach((key: any) => {
        httpParams = httpParams.append(key, params[key]);
      });
      options.params = httpParams;
      options.showLoader = true;
    }
    return this.http.patch(url, body, options);
  }
  httpPut(url: any, body?: any, header?: any, params?: any) {
    const options: any = {}; //cretae a req option
    if (header) {
      const httpHeads = new HttpHeaders(header);
      options.headers = httpHeads;
    }
    if (params) {
      let httpParams = new HttpParams();
      Object.keys(params).forEach((key: any) => {
        httpParams = httpParams.append(key, params[key]);
      });
      options.params = httpParams;
      options.showLoader = true;
    }
    return this.http.put(url, body, options);
  }
  httpDelete(url: any, body?: any, header?: any, params?: any) {
    const options: any = {}; //cretae a req option
    if (header) {
      const httpHeads = new HttpHeaders(header);
      options.headers = httpHeads;
    }
    if (params) {
      let httpParams = new HttpParams();
      Object.keys(params).forEach((key: any) => {
        httpParams = httpParams.append(key, params[key]);
      });
      options.params = httpParams;
      options.showLoader = true;
    }
    return this.http.delete(url, options);
  }
}
