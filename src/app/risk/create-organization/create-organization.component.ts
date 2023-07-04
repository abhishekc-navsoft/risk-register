import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/constants/storage/local-storage.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { riskService } from '../risk.service';
import { sharedService } from 'src/app/constants/shared_services/shared-services';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { projectConstantLocal } from 'src/app/constants/project_constant/project-constantLocal';
import { Observable, map, startWith } from 'rxjs';
import { ChecklistDatabase } from './ChecklistDatabase';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss'],
})
export class CreateOrganizationComponent implements OnInit {
  type: any;
  header: string = '';
  subHeader: string = '';
  btnAction: string = 'Save';
  organizationForm: any;
  submitted: boolean = false;
  textareaMaxLength: any = 256;
  api_loading: boolean = false;
  userList: any;
  industryList: any;
  turnoverlist: any;
  empRangeList: any;
  exportCountryList: any;
  tempProfitableList: any;
  isShown: boolean = false;
  countryList: any;
  countryListOptions: any;
  stateList: any;
  stateListOptions: any;
  orgaTypeSelectId: any;

  selectedCountryId: any;
  selectedStateId: any;
  freePlanId: any;
  freePlanPrice: any;
  action: any;
  createdValue: any;

  // nested industry end here

  constructor(
    private localstorageservice: LocalStorageService,
    private riskService: riskService,
    private snackbarService: SnackbarService,
    private router: Router,
    private activated_router: ActivatedRoute,
    private location: Location,
    private sharedService: sharedService,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {
    this.queryParamsFn();
  }

  ngOnInit(): void {
    this.activeUserFromLStorage();
    this.InitFormGroup();
    // this.getUserTypeInit();
    this.getIndustryInit();
    this.getAnnualTurnoverInit();
    this.getEmployeeRangeInit();
    this.getExportCountryInit();
    this.getProfitableListInit();
    this.getCountryListInit();
    this.subscriptionPlanListInit();
    if (
      this.action &&
      this.action === 'edit' &&
      this.type &&
      this.type === 'createOrganization'
    ) {
      this.updateInitFormGroupValue();
    }
  }
  getProfitableListInit() {
    this.tempProfitableList = this.sharedService.profitableList;
  }
  getUserTypeInit() {
    this.getUserType().then((user: any) => {
      if (user && user['status'] && user['status'] === 200) {
        if (
          user &&
          user['data'] &&
          user['data'].length &&
          user['data'].length > 0
        ) {
          this.userList = user['data'].filter(function (_user: any) {
            return _user.user_type !== 'Individual';
          });
        }
      }
    });
  }
  getIndustryInit() {
    this.getIndustryType().then((industry: any) => {
      console.log('industry', industry);
      if (industry && industry['status'] && industry['status'] === 200) {
        if (
          industry &&
          industry['industry_data_id'] &&
          industry['industry_data_id'].length &&
          industry['industry_data_id'].length > 0
        ) {
          this.industryList = industry['industry_data_id'];
          this.getKeyByValue('industry_name', this.industryList);
          console.log('obj', Object.keys(this.industryList));
        }
      }
    });
  }
  getKeyByValue(obj: any, result: any) {}

  getAnnualTurnoverInit() {
    this.getAnnualTurnover().then((turnOver: any) => {
      if (turnOver && turnOver['status'] && turnOver['status'] === 200) {
        if (
          turnOver &&
          turnOver['data'] &&
          turnOver['data'].length &&
          turnOver['data'].length > 0
        ) {
          this.turnoverlist = turnOver['data'];
        }
      }
    });
  }
  getEmployeeRangeInit() {
    this.getEmpRange().then((empRange: any) => {
      if (empRange && empRange['status'] && empRange['status'] === 200) {
        if (
          empRange &&
          empRange['data'] &&
          empRange['data'].length &&
          empRange['data'].length > 0
        ) {
          this.empRangeList = empRange['data'];
        }
      }
    });
  }
  getExportCountryInit() {
    this.getExportCountry().then((exCountry: any) => {
      if (exCountry && exCountry['status'] && exCountry['status'] === 200) {
        if (
          exCountry &&
          exCountry['data'] &&
          exCountry['data'] &&
          exCountry['data'].length > 0
        ) {
          this.exportCountryList = exCountry['data'];
        }
      }
    });
  }
  getCountryListInit() {
    this.getCountryList().then((afterRes: any) => {
      if (afterRes && afterRes['status'] && afterRes['status'] === 200) {
        if (
          afterRes &&
          afterRes['data'] &&
          afterRes['data'].length &&
          afterRes['data'].length > 0
        )
          this.countryList = afterRes['data'];
        console.log('country list', this.countryList);
        this.countryInit();
      }
    });
  }
  countryInit() {
    this.countryListOptions = this.organizationForm
      .get('country')
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filter(value || ''))
      );
    console.log('countryListOptions', this.countryListOptions);
  }
  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countryList.filter((option: any) =>
      option['country_name'].toLowerCase().includes(filterValue)
    );
  }
  get f() {
    return this.organizationForm.controls;
  }
  InitFormGroup() {
    this.organizationForm = this.formBuilder.group({
      organizationName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalcode: ['', [Validators.required]],
      empRange: ['', [Validators.required]],
      annualTurnover: ['', [Validators.required]],
      industry: ['', [Validators.required]],
      exportCountry: [''],
      profitable: ['', [Validators.required]],
    });
  }
  activeUserFromLStorage() {
    const activeUser =
      this.localstorageservice.getItemFromLocalStorage('currentUser');
    console.log('activeUser', activeUser);
  }
  queryParamsFn() {
    this.activated_router.queryParams.subscribe((qparams: any) => {
      console.log('qparams', qparams);
      if (qparams && qparams['type'] && qparams['type']) {
        if (qparams && qparams['action']) {
          this.action = qparams['action'];
        }
        if (qparams && qparams['action'] && qparams['action'] === 'create') {
          this.header = 'Organization';
          this.subHeader = 'Add Organization';
          this.orgaTypeSelectId = qparams['id'];
        } else if (
          qparams &&
          qparams['action'] &&
          qparams['action'] === 'edit'
        ) {
          this.action = qparams['action'];
          this.type = qparams['type'];
          this.header = 'Organization';
          this.subHeader = 'Edit Organization';
          this.btnAction = 'Edit';
          this.createdValue = JSON.parse(qparams['dataToSend']);
        }
      }
    });
  }
  actionFormField(txt: any, value: any) {
    console.log('txt selected value', txt);
    console.log('value', value);
    if (txt && txt === 'profitable') {
      if (value === true) {
        this.isShown = !this.isShown;
      } else {
        this.isShown = false;
      }
    }
  }
  getUserType() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.getUserType().subscribe(
        (user: any) => {
          resolve(user);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }
  getIndustryType() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.getIndustryList().subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  getAnnualTurnover() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.getAnnualTurnOver().subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  getEmpRange() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.getEmployeeRange().subscribe(
        (res: any) => {
          resolve(res);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }
  getExportCountry() {
    const _this = this;
    return new Promise((resolve, reject) => {
      this.riskService.getExportCountry().subscribe(
        (res: any) => {
          resolve(res);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }
  getCountryList() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.getCountryList().subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  selectedCountry(countryInfo: any, txt: string) {
    console.log('countryInfo', countryInfo);
    if (txt && txt === 'country') {
      if (countryInfo && countryInfo['id']) {
        this.selectedCountryId = countryInfo['id'];
        this.selectStateListInit(countryInfo['id']);
      }
    } else {
      if (txt && txt === 'state') {
        this.selectedStateId = countryInfo['id'];
      }
    }
  }
  selectStateListInit(country_id: any) {
    console.log('country_id', country_id);
    this.selectStateList(country_id).then((afterRes: any) => {
      console.log('after res', afterRes);
      if (afterRes && afterRes['status'] && afterRes['status'] === 200) {
        if (
          afterRes &&
          afterRes['data'] &&
          afterRes['data'].length &&
          afterRes['data'].length > 0
        ) {
          this.stateList = afterRes['data'];
          this.stateInit();
        }
      }
    });
  }
  selectStateList(post_data: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.getStateList(post_data).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  stateInit() {
    this.stateListOptions = this.organizationForm
      .get('state')
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filterState(value || ''))
      );
    console.log('stateListOptions', this.stateListOptions);
  }
  _filterState(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.stateList.filter((option: any) =>
      option['state_name'].toLowerCase().includes(filterValue)
    );
  }
  subscriptionPlanListInit() {
    this.subscriptionPlanList().then((response: any) => {
      console.log('response in subscription', response);
      if (
        response &&
        response['data'] &&
        response['data'].length &&
        response['data'].length > 0
      ) {
        response['data'].map((plan: any) => {
          if (plan && plan['plan_name'] && plan['plan_name'] === 'Free') {
            if (plan && ['id']) {
              this.freePlanId = plan['id'];
              this.freePlanPrice = 0;
            }
          }
        });
        console.log('freePlanId', this.freePlanId);
        console.log('freePlanPrice', this.freePlanPrice);
      }
    });
  }
  subscriptionPlanList() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.getSubscriptionList().subscribe(
        (res: any) => {
          console.log('res', res);
          if (res) {
            resolve(res);
          }
        },
        (error: any) => {
          reject(error);
          this.api_loading = false;
        }
      );
    });
  }
  addOrganization(post_data: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.addOrganization(post_data).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error: any) => {
          reject(error);
          this.api_loading = false;
          this.snackbarService.OpenSnackBar(
            this.sharedService.firstLetterCapital(error['message']),
            {
              panelClass: 'snackbarerror',
            }
          );
        }
      );
    });
  }
  updateOrganization(post_data: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.editOrganizationData(post_data).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(error);
          this.api_loading = false;
        }
      );
    });
  }
  actionPerformed(actionType: any) {
    if (actionType && actionType === 'back') {
      this.sharedService.goBack();
    } else if (actionType && actionType === 'formSubmit') {
      if (this.action && this.action === 'create') {
        this.createOrganization();
      } else if (this.action && this.action === 'edit') {
        this.editOrganization(this.createdValue);
      }
    }
  }
  createOrganization() {
    this.api_loading = true;
    const tempUser: number = 103; //I need to chnage userid now its temporary
    const post_data: any = {
      user: tempUser,
      user_type: parseInt(this.orgaTypeSelectId),
      name: this.organizationForm.controls.organizationName.value,
      address: this.organizationForm.controls.address.value,
      emp_range: this.organizationForm.controls.empRange.value,
      annual_turnover: this.organizationForm.controls.annualTurnover.value,
      industry: this.organizationForm.controls.industry.value,
      country: this.selectedCountryId,
      state: this.selectedCountryId,
      postal_code: this.organizationForm.controls.postalcode.value,
    };
    if (this.organizationForm.controls.profitable.value === false) {
      post_data['is_profitable'] = 'False';
    } else {
      post_data['is_profitable'] = 'True';
      post_data['export_country'] =
        this.organizationForm.controls.exportCountry.value;
    }
    console.log('post_data', post_data);
    this.addOrganization(post_data).then((response: any) => {
      console.log('response', response);
      if (response && response['status'] && response['status'] === 200) {
        this.freePlanPost(tempUser, response);
      } else if (response && response['status'] && response['status'] === 400) {
        this.api_loading = false;
        this.snackbarService.OpenSnackBar(
          this.sharedService.firstLetterCapital(response['message']),
          {
            panelClass: 'snackbarerror',
          }
        );
        this.organizationForm.reset();
      } else {
        this.api_loading = false;
        this.organizationForm.reset();
      }
    });
  }
  editOrganization(value: any) {
    console.log('value', value);
    this.api_loading = true;
    const post_data: any = {
      id: value['id'],
      name: this.organizationForm.controls.organizationName.value,
      head: value['head'],
      address: this.organizationForm.controls.address.value,
      postal_code: this.organizationForm.controls.postalcode.value,
      is_profitable: this.organizationForm.controls.profitable.value,
      acct_status: value['acct_status'],
      emp_range: this.organizationForm.controls.empRange.value,
      annual_turnover: this.organizationForm.controls.annualTurnover.value,
      industry: this.organizationForm.controls.industry.value,
      country: this.selectedCountryId,
      state: this.selectedStateId,
      export_country: this.organizationForm.controls.exportCountry.value,
    };
    console.log('post_data', post_data);
    this.updateOrganization(post_data).then((response: any) => {
      console.log('respoonse on edit', response);
      if (response && response['status'] && response['status'] === 200) {
        this.api_loading = false;
        this.snackbarService.OpenSnackBar(
          this.sharedService.firstLetterCapital(response['message']),
          {
            panelClass: 'snackbarnormal',
          }
        );
        const navigationExtrasToOrganizationlist: NavigationExtras = {
          queryParams: {
            type: 'organizationlist',
          },
        };
        this.router.navigate(
          ['/organizationlist'],
          navigationExtrasToOrganizationlist
        );
      } else {
        this.api_loading = false;
        this.snackbarService.OpenSnackBar(
          this.sharedService.firstLetterCapital(response['message']),
          {
            panelClass: 'snackbarerror',
          }
        );
      }
    });
  }
  paymentDetails(post_body: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.addPaymentDetails(post_body).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error: any) => {
          reject(error);
          this.api_loading = false;
        }
      );
    });
  }
  freePlanPost(tempUser: any, data: any) {
    let organizationId: number = 0;
    if (data['data'] && data['data']['org_id']) {
      organizationId = data['data']['org_id'];
    }
    const paymentDetails: any = {
      user_id: tempUser,
      org_id: organizationId,
      plan_id: this.freePlanId,
      amount: this.freePlanPrice,
      transaction_id: '',
      currency: 'USD',
      payment_status: 'completed',
      payment_email_address: '',
    };
    this.paymentDetails(paymentDetails).then((response: any) => {
      // console.log('response after internal api cal', response);
      this.api_loading = false;
      if (response && response['status'] && response['status'] === 200) {
        this.api_loading = false;
        this.snackbarService.OpenSnackBar(
          this.sharedService.firstLetterCapital(response['message']),
          {
            panelClass: 'snackbarnormal',
          }
        );
        const navigationExtrasToOrganizationlist: NavigationExtras = {
          queryParams: {
            type: 'organizationlist',
          },
        };
        this.router.navigate(
          ['/organizationlist'],
          navigationExtrasToOrganizationlist
        );
      } else {
        this.api_loading = false;
        this.snackbarService.OpenSnackBar(
          this.sharedService.firstLetterCapital(response['message']),
          {
            panelClass: 'snackbarerror',
          }
        );
      }
    });
  }
  updateInitFormGroupValue() {
    console.log('createdValue', this.createdValue);
    if (this.createdValue && this.createdValue['is_profitable']) {
      this.isShown = true;
    }
    this.selectedCountryId = this.createdValue['country_id'];
    this.selectedStateId = this.createdValue['state_id'];
    this.organizationForm.patchValue({
      organizationName: this.createdValue['name'],
      address: this.createdValue['address'],
      country: this.createdValue['country_id__country_name'],
      state: this.createdValue['state_id__state_name'],
      postalcode: this.createdValue['postal_code'],
      empRange: this.createdValue['emp_range_id'],
      annualTurnover: this.createdValue['annual_turnover_id'],
      industry: this.createdValue['industry_id'],
      exportCountry: this.createdValue['export_country_id'],
      profitable: this.createdValue['is_profitable'],
    });
  }
  formFieldChange(fieldData: any) {
    console.log('data', fieldData);
    if (!fieldData) {
      this.organizationForm.controls.state.disable();
      this.organizationForm.controls.state.setValue('');
      this.snackbarService.OpenSnackBar(projectConstantLocal['ENABLE_STATE'], {
        panelClass: 'snackbarerror',
      });
    } else {
      this.organizationForm.controls.state.enable();
    }
  }
}
