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
import { Sort } from '@angular/material/sort';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-addRiskCategory',
  templateUrl: './addriskcategory.component.html',
  styleUrls: ['./addriskcategory.component.scss'],
})
export class riskAddcategoryComponent implements OnInit {
  type: any;
  header: string = '';
  subHeader: string = '';
  api_loading: boolean = false;
  btnAction: string = 'Save';
  createdValue: any;
  action: any;
  categoryForm: any;

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
          this.header = 'Category';
          this.subHeader = 'Add Category';
        } else if (
          qparams &&
          qparams['action'] &&
          qparams['action'] === 'edit'
        ) {
          this.action = qparams['action'];
          this.type = qparams['type'];
          this.header = 'Category';
          this.subHeader = 'Edit Category';
          this.btnAction = 'Edit';
          this.createdValue = JSON.parse(qparams['dataToSend']);
          console.log(' this.createdValue', this.createdValue);
        }
      }
    });
  }
  ngOnInit(): void {
    this.activeUserFromLStorage();
    this.InitFormGroup();
    if (
      this.action &&
      this.action === 'edit' &&
      this.type &&
      this.type === 'addCategory'
    ) {
      this.updateInitFormGroupValue();
    }
  }
  updateInitFormGroupValue() {
    this.categoryForm.patchValue({
      categoryName: this.createdValue['category_name'],
      categoryDes: this.createdValue['category_description'],
    });
  }
  actionPerformed(actionType: any) {
    if (actionType && actionType === 'back') {
      this.sharedService.goBack();
    } else if (actionType && actionType === 'formSubmit') {
      if (this.action && this.action === 'create') {
        this.createCategory();
      } else if (this.action && this.action === 'edit') {
        this.editCategory(this.createdValue);
      }
    }
  }
  createCategory() {
    this.api_loading = true;
    const post_data: any = {
      category_name: this.categoryForm.controls.categoryName.value,
      category_description: this.categoryForm.controls.categoryDes.value,
      is_active: true,
      is_deleted: false,
    };
    this.craeteCategoryPerform(post_data).then((response: any) => {
      console.log('response aftre craete ', response);
      if (response && response['status'] && response['status'] === 200) {
        this.api_loading = false;
        this.categoryForm.reset();
        this.snackbarService.OpenSnackBar(
          this.sharedService.firstLetterCapital(response['message']),
          {
            panelClass: 'snackbarnormal',
          }
        );
        const navigationExtrasToAddCategory: NavigationExtras = {
          queryParams: {
            type: 'category',
          },
        };
        this.router.navigate(['/riskCategory'], navigationExtrasToAddCategory);
      }
    });
  }
  craeteCategoryPerform(post_body: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.craeteCategory(post_body).subscribe(
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
  editCategory(data: any) {
    console.log(this.categoryForm.value);
    this.api_loading = true;
    const post_data: any = {
      id: this.createdValue['id'],
      category_name: this.categoryForm.controls.categoryName.value,
      category_description: this.categoryForm.controls.categoryDes.value,
      is_active: true,
      is_deleted: false,
    };
    this.editCategoryFn(post_data).then((response: any) => {
      console.log('after edit res', response);
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
            type: 'category',
          },
        };
        this.router.navigate(
          ['/riskCategory'],
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
  editCategoryFn(post_body: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.editCategory(post_body).subscribe(
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
  get f() {
    return this.categoryForm.controls;
  }
  InitFormGroup() {
    this.categoryForm = this.formBuilder.group({
      categoryName: ['', [Validators.required]],
      categoryDes: ['', [Validators.required]],
    });
  }
  activeUserFromLStorage() {
    const activeUser =
      this.localstorageservice.getItemFromLocalStorage('currentUser');
    console.log('activeUser', activeUser);
  }
  autoGrowTextarea(e: any) {
    this.sharedService.auto_grow(e);
  }
}
