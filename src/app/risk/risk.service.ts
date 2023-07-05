import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { base_url } from '../constants/urls';
import { LocalStorageService } from '../constants/storage/local-storage.service';
import { sessionStorageService } from '../constants/storage/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class riskService {
  activeUser = this.localstorageservice.getItemFromLocalStorage('currentUser');
  activeuserfromSession: any =
    this.sessionStorage.getItemFromSessionStorage('currentUser');
  token: any = '';

  constructor(
    private http: HttpClient,
    private localstorageservice: LocalStorageService,
    private sessionStorage: sessionStorageService
  ) {
    console.log('activeUser risk service', this.activeUser);
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Token ${this.activeUser['token']}`,
    }),
  };
  logoutAdmin(body: any) {
    return this.http.post(base_url + 'logout/', body, this.httpOptions);
  }

  getOrganizationList() {
    return this.http.get(
      base_url + 'superadmin/organization_getupdate/',
      this.httpOptions
    );
  }
  postCountryData(body: any) {
    return this.http.post(
      base_url + 'superadmin/country/',
      body,
      this.httpOptions
    );
  }
  getCountryList() {
    return this.http.get(base_url + 'superadmin/country/', this.httpOptions);
  }
  getStateList(id?: any) {
    return this.http.get(
      base_url + 'superadmin/state/?country_id=' + id,
      this.httpOptions
    );
  }
  postStateData(body: any) {
    return this.http.post(
      base_url + 'superadmin/state/',
      body,
      this.httpOptions
    );
  }
  getSubscriptionList(body?: any) {
    const httpoptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Token ${this.activeUser['token']}`,
      }),
      body: body,
    };
    return this.http.get(
      base_url + 'superadmin/subscription_details/',
      httpoptions
    );
  }
  postSubscriptionData(body: any) {
    return this.http.post(
      base_url + 'superadmin/subscription_details/',
      body,
      this.httpOptions
    );
  }
  getUserType() {
    return this.http.get(base_url + 'superadmin/user_type/', this.httpOptions);
  }
  getIndustryList() {
    return this.http.get(base_url + 'superadmin/industry/', this.httpOptions);
  }
  getAnnualTurnOver() {
    return this.http.get(
      base_url + 'superadmin/annualturnover/',
      this.httpOptions
    );
  }
  getEmployeeRange() {
    return this.http.get(base_url + 'superadmin/emprange', this.httpOptions);
  }
  getExportCountry() {
    return this.http.get(
      base_url + 'superadmin/export_country/',
      this.httpOptions
    );
  }
  addOrganization(body: any) {
    return this.http.post(base_url + 'organization/', body, this.httpOptions);
  }
  deleteSubscription(body: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Token ${this.activeUser['token']}`,
      }),
      body: body,
    };
    return this.http.delete(
      base_url + 'superadmin/subscription_details/',
      options
    );
  }
  editSubscriptionData(body: any) {
    return this.http.put(
      base_url + 'superadmin/subscription_details/',
      body,
      this.httpOptions
    );
  }
  addPaymentDetails(body: any) {
    return this.http.post(
      base_url + 'payment_details/',
      body,
      this.httpOptions
    );
  }
  organizationDelete(body: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Token ${this.activeUser['token']}`,
      }),
      body: body,
    };
    return this.http.delete(
      base_url + 'superadmin/org_status_updatedelete/',
      options
    );
  }
  editOrganizationData(body: any) {
    return this.http.put(
      base_url + 'superadmin/organization_getupdate/',
      body,
      this.httpOptions
    );
  }
  editIndividualData(body: any) {
    return this.http.put(
      base_url + 'superadmin/organization_getupdate/',
      body,
      this.httpOptions
    );
  }
  organizationStatusUpdate(body: any) {
    return this.http.put(
      base_url + 'superadmin/org_status_updatedelete/',
      body,
      this.httpOptions
    );
  }
  addIndividualUser(body: any) {
    return this.http.post(
      base_url + 'individual_organization/',
      body,
      this.httpOptions
    );
  }
  searchOrganizationData(body?: any) {
    return this.http.get(
      base_url + 'superadmin/organization_getupdate/' + '?search=' + body,
      this.httpOptions
    );
  }
  getOrganizationInfo(body?: any) {
    return this.http.get(
      base_url + 'superadmin/organization_getupdate/?' + body,
      this.httpOptions
    );
  }
  orgMemberList(orgId: any) {
    return this.http.get(
      base_url + 'organization/memberlist/?organization_id=' + orgId,
      this.httpOptions
    );
  }
  getCategoryData() {
    return this.http.get(base_url + 'superadmin/category/', this.httpOptions);
  }
  craeteCategory(body: any) {
    return this.http.post(
      base_url + 'superadmin/category/',
      body,
      this.httpOptions
    );
  }
  editCategory(body: any) {
    return this.http.put(
      base_url + 'superadmin/category/',
      body,
      this.httpOptions
    );
  }
  categoryDelete(body: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Token ${this.activeUser['token']}`,
      }),
      body: body,
    };
    return this.http.delete(base_url + 'superadmin/category/', options);
  }
}
