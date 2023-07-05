import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { riskService } from '../risk.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { LocalStorageService } from 'src/app/constants/storage/local-storage.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { projectConstantLocal } from 'src/app/constants/project_constant/project-constantLocal';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { sharedService } from 'src/app/constants/shared_services/shared-services';

@Component({
  selector: 'app-region-master',
  templateUrl: './regionmaster.component.html',
  styleUrls: ['./regionmaster.component.scss'],
})
export class RegionMasterComponent implements OnInit {
  countryForm: any;
  submitted: boolean = false;
  organizationCountryName: string =
    projectConstantLocal['ORGANIZATION_COUNTRY_MSG_PLACEHOLDER'];
  organizationCountrynameValidation: string =
    projectConstantLocal['ORGANIZATION_COUNTRY_MSG_VALIDATION'];
  organizationCountryCode: string =
    projectConstantLocal['ORGANIZATION_COUNTRY_CODE'];
  organizationCounryCodeValidation: string =
    projectConstantLocal['ORGANIZATION_COUNTRY_CODE_VALIDATION'];
  countryCodeList: any = []; //this.sharedService['COUNTRY_JSON'];
  countryNameList: any = []; //this.sharedService['COUNTRY_JSON'];
  countryCodeListInfo: any;
  countryNameListInfo: any;
  header: string = 'Region Master';
  subHeader: string = 'Region information';
  api_loading: boolean = false;
  color: any = '#ffffff';
  countryList: any;
  bCountryFormInit: boolean = true;

  //stae form variable
  stateForm: any;
  bStateFormInit: boolean = false;
  stateNameList: any = [];
  stateNameListInfo: any;
  selectedstateid: any;
  api_loading_state: boolean = false;
  constructor(
    private localstorageservice: LocalStorageService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private snackbarService: SnackbarService,
    private router: Router,
    private sharedService: sharedService,
    private riskService: riskService
  ) {}
  ngOnInit(): void {
    this.activeUserInfo();
    this.InitFormGroup();
    this.InitFormGroupAsState();
    this.translateInit();
    this.getCountryDetailsInit();
    // this.countryCodeListFilter();
    // this.countryNameListFilter();
  }
  activeUserInfo() {
    const activeUser =
      this.localstorageservice.getItemFromLocalStorage('currentUser');
    console.log('activeUser in region master', activeUser);
  }
  translateInit() {
    let language: any;
    language =
      this.localstorageservice.getItemFromLocalStorage('translatevariable');
    // console.log('language', language);
    this.translate.setDefaultLang(language);
    this.translate.use(language);
  }
  get country() {
    return this.countryForm.controls;
  }
  get state() {
    return this.stateForm.controls;
  }
  InitFormGroup() {
    this.countryForm = this.formBuilder.group({
      organizationCountryCode: ['', [Validators.required]],
      organizationCountryName: ['', [Validators.required]],
    });
  }
  InitFormGroupAsState() {
    this.stateForm = this.formBuilder.group({
      organizationStateName: ['', [Validators.required]],
    });
  }
  countryCodeListFilter() {
    this.countryCodeListInfo = this.countryForm
      .get('organizationCountryCode')
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filterCountryCode(value || ''))
      );
  }
  _filterCountryCode(value: any) {
    const filterValue = value.toLowerCase();
    return this.countryCodeList.filter((option: any) =>
      option['number'].toLowerCase().includes(filterValue)
    );
  }
  countryNameListFilter() {
    this.countryNameListInfo = this.countryForm
      .get('organizationCountryName')
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filterCountryName(value || ''))
      );
  }
  _filterCountryName(value: any) {
    const filterValue = value.toLowerCase();
    return this.countryList.filter((option: any) =>
      option['country_name'].toLowerCase().includes(filterValue)
    );
  }
  formFieldState(data: any) {
    console.log('data', data);
    this.selectedstateid = data['id'];
  }
  onSubmitCountryDetails() {
    const post_data: any = {
      country_name: this.countryForm.controls.organizationCountryName.value,
      country_code: this.countryForm.controls.organizationCountryCode.value,
    };
    this.api_loading = true;
    this.countryDetailsPost(post_data).then((res: any) => {
      console.log('res in country', res);
      if (res && res['status'] && res['status'] === 400) {
        this.snackbarService.OpenSnackBar(
          this.sharedService.firstLetterCapital(res['message']),
          {
            panelClass: 'snackbarerror',
          }
        );
        this.countryForm.reset();
      } else {
        const country_data_id: any = 3; //res['country_data_id']
        this.getStateListInit(country_data_id);
        this.snackbarService.OpenSnackBar(
          this.sharedService.firstLetterCapital(res['message']),
          {
            panelClass: 'snackbarnormal',
          }
        );
      }
    });
  }
  onSubmitStateDetails() {
    const post_data: any = {
      state_name: this.stateForm.controls.organizationStateName.value,
      country: this.selectedstateid,
    };
    this.api_loading = true;
    this.stateDetailsPOst(post_data).then((res: any) => {
      console.log('res in country', res);
      if (res && res['status'] && res['status'] === 400) {
        this.snackbarService.OpenSnackBar(
          this.sharedService.firstLetterCapital(res['message']),
          {
            panelClass: 'snackbarerror',
          }
        );
        this.countryForm.reset();
      } else {
        const country_data_id: any = res['country_data_id']; //3;
        this.getStateListInit(country_data_id);
        this.snackbarService.OpenSnackBar(
          this.sharedService.firstLetterCapital(res['message']),
          {
            panelClass: 'snackbarnormal',
          }
        );
      }
    });
  }
  onSubmitRegionMaster(txt: any) {
    if (txt && txt === 'country') {
      this.onSubmitCountryDetails();
    } else if (txt && txt === 'state') {
      this.onSubmitStateDetails();
    }
  }
  countryDetailsPost(post_data: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.postCountryData(post_data).subscribe(
        (response: any) => {
          resolve(response);
          console.log('response', response);
          this.api_loading = false;
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  stateDetailsPOst(post_data: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.postStateData(post_data).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }
  getCountryDetailsInit() {
    this.getCountryDetails().then((response: any) => {
      console.log('response country details', response);
      if (
        response &&
        response['data'] &&
        response['data'].length &&
        response['data'].length > 0
      ) {
        this.countryList = response['data'];
        console.log('this.countryList', this.countryList);
        this.countryNameListFilter();
      }
    });
  }
  getCountryDetails() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.getCountryList().subscribe(
        (res: any) => {
          resolve(res);
          console.log(res);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }
  getStateListInit(id: any) {
    this.getStateList(id).then((response: any) => {
      console.log('response stae name', response);
      this.bStateFormInit = true;
      this.disableCountryForm();
      this.stateNameList = response['data'];
      this.stateNameListFilter();
      this.api_loading_state = false;
    });
  }
  stateNameListFilter() {
    this.stateNameListInfo = this.stateForm
      .get('organizationStateName')
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filterStateName(value || ''))
      );
  }
  _filterStateName(value: any) {
    const filterValue = value.toLowerCase();
    return this.stateNameList.filter((option: any) =>
      option['state_name'].toLowerCase().includes(filterValue)
    );
  }
  getStateList(id: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.getStateList(id).subscribe(
        (res: any) => {
          console.log('res state', res);
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  disableCountryForm() {
    this.countryForm.controls.organizationCountryName.disable();
    this.countryForm.controls.organizationCountryCode.disable();
  }
  enableCountryForm() {
    this.countryForm.controls.organizationCountryName.enable();
    this.countryForm.controls.organizationCountryCode.enable();
  }
}
