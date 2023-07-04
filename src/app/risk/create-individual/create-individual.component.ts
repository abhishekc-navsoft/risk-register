import { Component, Injectable, OnInit } from '@angular/core';
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
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-create-individual',
  templateUrl: './create-individual.component.html',
  styleUrls: ['./create-individual.component.scss'],
})
export class CreateIndividualComponent implements OnInit {
  individualForm: any;
  header: string = '';
  subHeader: string = '';
  api_loading: boolean = false;
  btnAction: string = 'Save';
  countryListOptions: any;
  countryList: any;
  selectedCountryId: any;
  selectedStateId: any;
  stateList: any;
  stateListOptions: any;
  empRangeList: any;
  action: any;
  createdValue: any;
  individualTypeSelectId: any;
  type: any;
  freePlanId: any;
  freePlanPrice: any;

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
  queryParamsFn() {
    this.activated_router.queryParams.subscribe((qparams: any) => {
      console.log('qparams', qparams);
      if (qparams && qparams['type'] && qparams['type']) {
        if (qparams && qparams['action']) {
          this.action = qparams['action'];
        }
        if (qparams && qparams['action'] && qparams['action'] === 'create') {
          this.header = 'Individual';
          this.subHeader = 'Add Individual';
          this.individualTypeSelectId = qparams['id'];
        } else if (
          qparams &&
          qparams['action'] &&
          qparams['action'] === 'edit'
        ) {
          this.action = qparams['action'];
          this.type = qparams['type'];
          this.header = 'Individual';
          this.subHeader = 'Edit Individual';
          this.btnAction = 'Edit';
          this.createdValue = JSON.parse(qparams['dataToSend']);
        }
      }
    });
  }
  ngOnInit() {
    this.activeUserFromLStorage();
    this.InitFormGroup();
    this.getCountryListInit();
    this.getEmployeeRangeInit();
    this.subscriptionPlanListInit();
    if (
      this.action &&
      this.action === 'edit' &&
      this.type &&
      this.type === 'createIndividual'
    ) {
      this.updateInitFormGroupValue();
    }
  }
  updateInitFormGroupValue() {
    console.log('createdValue', this.createdValue);
    this.selectedCountryId = this.createdValue['country_id'];
    this.selectedStateId = this.createdValue['state_id'];
    this.individualForm.patchValue({
      individualName: this.createdValue['name'],
      address: this.createdValue['address'],
      country: this.createdValue['country_id__country_name'],
      state: this.createdValue['state_id__state_name'],
      postalcode: this.createdValue['postal_code'],
      empRange: this.createdValue['emp_range_id'],
      familyHead: this.createdValue['head'],
    });
  }
  get f() {
    return this.individualForm.controls;
  }
  InitFormGroup() {
    this.individualForm = this.formBuilder.group({
      individualName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalcode: ['', [Validators.required]],
      empRange: ['', [Validators.required]],
      familyHead: ['', [Validators.required]],
    });
  }
  activeUserFromLStorage() {
    const activeUser =
      this.localstorageservice.getItemFromLocalStorage('currentUser');
    console.log('activeUser', activeUser);
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
    this.countryListOptions = this.individualForm
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
        if (countryInfo && countryInfo['id']) {
          this.selectedStateId = countryInfo['id'];
        }
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
    this.stateListOptions = this.individualForm.get('state').valueChanges.pipe(
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
  actionPerformed(actionType: any) {
    if (actionType && actionType === 'back') {
      this.sharedService.goBack();
    } else if (actionType && actionType === 'formSubmit') {
      if (this.action && this.action === 'create') {
        this.createIndividual();
      } else if (this.action && this.action === 'edit') {
        this.editIndividual(this.createdValue);
      }
    }
  }
  createIndividual() {
    this.api_loading = true;
    const tempUser: number = 104; //107 I need to chnage userid now its temporary
    const post_data: any = {
      user: tempUser,
      user_type: parseInt(this.individualTypeSelectId),
      name: this.individualForm.controls.individualName.value,
      address: this.individualForm.controls.address.value,
      head: this.individualForm.controls.familyHead.value,
      emp_range: this.individualForm.controls.empRange.value,
      country: this.selectedCountryId,
      state: this.selectedStateId,
      postal_code: this.individualForm.controls.postalcode.value,
    };
    this.addIndividual(post_data).then((response: any) => {
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
        this.individualForm.reset();
      } else {
        this.api_loading = false;
        this.individualForm.reset();
      }
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
  addIndividual(post_data: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.addIndividualUser(post_data).subscribe(
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
  editIndividual(value: any) {
    console.log('value', value);
    const post_data: any = {
      id: value['id'],
      name: this.individualForm.controls.individualName.value,
      head: value['head'],
      address: this.individualForm.controls.address.value,
      postal_code: this.individualForm.controls.postalcode.value,
      emp_range: this.individualForm.controls.empRange.value,
      country: this.selectedCountryId,
      state: this.selectedStateId,
      acct_status: value['acct_status'],
      is_profitable: value['is_profitable'],
      annual_turnover: '',
      industry: '',
    };
    this.updateIndividual(post_data).then((response: any) => {
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
  updateIndividual(post_data: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.editIndividualData(post_data).subscribe(
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
  formFieldChange(fieldData: any) {
    console.log('data', fieldData);
    if (!fieldData) {
      this.individualForm.controls.state.disable();
      this.individualForm.controls.state.setValue('');
      this.snackbarService.OpenSnackBar(projectConstantLocal['ENABLE_STATE'], {
        panelClass: 'snackbarerror',
      });
    } else {
      this.individualForm.controls.state.enable();
    }
  }
}
