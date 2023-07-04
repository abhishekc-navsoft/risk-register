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
  registerForm: any;
  submitted: boolean = false;
  organizationCountryName: string =
    projectConstantLocal['ORGANIZATION_COUNTRY_MSG_PLACEHOLDER'];
  organizationCountrynameValidation: string =
    projectConstantLocal['ORGANIZATION_COUNTRY_MSG_VALIDATION'];
  organizationCountryCode: string =
    projectConstantLocal['ORGANIZATION_COUNTRY_CODE'];
  organizationCounryCodeValidation: string =
    projectConstantLocal['ORGANIZATION_COUNTRY_CODE_VALIDATION'];
  countryCodeList: any[] = this.sharedService['COUNTRY_JSON'];
  countryNameList: any[] = this.sharedService['COUNTRY_JSON'];
  countryCodeListInfo: any;
  countryNameListInfo: any;
  header: string = 'Region Master';
  api_loading: boolean = false;
  color: any = '#ffffff';
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
    const activeUser =
      this.localstorageservice.getItemFromLocalStorage('currentUser');
    console.log('activeUser in region master', activeUser);
    this.InitFormGroup();
    this.translateInit();
    this.countryCodeListFilter();
    this.countryNameListFilter();
    this.getCountryDetails();
  }

  translateInit() {
    let language: any;
    language =
      this.localstorageservice.getItemFromLocalStorage('translatevariable');
    // console.log('language', language);
    this.translate.setDefaultLang(language);
    this.translate.use(language);
  }
  get f() {
    return this.registerForm.controls;
  }
  InitFormGroup() {
    this.registerForm = this.formBuilder.group({
      organizationCountryCode: ['', [Validators.required]],
      organizationCountryName: ['', [Validators.required]],
      organizationState: ['', [Validators.required]],
    });
  }
  countryCodeListFilter() {
    this.countryCodeListInfo = this.registerForm
      .get('organizationCountryCode')
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filterCountryCode(value || ''))
      );
  }
  private _filterCountryCode(value: any) {
    const filterValue = value.toLowerCase();
    return this.countryCodeList.filter((option: any) =>
      option['number'].toLowerCase().includes(filterValue)
    );
  }
  countryNameListFilter() {
    this.countryNameListInfo = this.registerForm
      .get('organizationCountryName')
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filterCountryName(value || ''))
      );
  }
  private _filterCountryName(value: any) {
    const filterValue = value.toLowerCase();
    return this.countryNameList.filter((option: any) =>
      option['name'].toLowerCase().includes(filterValue)
    );
  }
  onSubmitRegionMaster() {
    const post_data: any = {
      country_name: this.registerForm.controls.organizationCountryName.value,
      country_code: this.registerForm.controls.organizationCountryCode.value,
    };
    this.api_loading = true;
    let api_msg: any;
    this.countryDetailsPost(post_data).then((res: any) => {
      if (res && res['status'] && res['status'] === 400) {
        api_msg =
          res['message'].charAt(0).toUpperCase() + res['message'].slice(1);
        this.snackbarService.OpenSnackBar(api_msg, {
          panelClass: 'snackbarerror',
        });
        this.registerForm.reset();
      } else {
        this.snackbarService.OpenSnackBar(api_msg, {
          panelClass: 'snackbarnormal',
        });
      }
    });
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
  getCountryDetails() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.getCountryList().subscribe((res: any) => {
        console.log(res);
      });
    });
  }
}
