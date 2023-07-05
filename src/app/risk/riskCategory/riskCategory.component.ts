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
  selector: 'app-riskCategory',
  templateUrl: './riskCategory.component.html',
  styleUrls: ['./riskCategory.component.scss'],
})
export class riskcategoryComponent implements OnInit {
  type: any;
  header: string = '';
  subHeader: string = '';
  categoryListInfo: any;
  api_loading: boolean = false;
  tableActionBtnList: any = [
    {
      id: 1,
      content: 'Edit',
      icon: 'edit',
    },
    {
      id: 2,
      content: 'Delete',
      icon: 'delete',
    },
    {
      id: 3,
      content: 'Status',
      icon: 'lock',
    },
  ];
  color: ThemePalette = 'primary';
  allChecked: boolean = false;
  indeterminate: boolean = false;
  perPage = projectConstantLocal.PERPAGING_LIMIT;
  filter = {
    address: '',
    planName: '',
    acct_status: '',
    page_count: projectConstantLocal['PERPAGING_LIMIT'],
    page: 1,
  };
  p: any = 1;
  checkboxSelectValueList: any;
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
        this.type = qparams['type'];
        this.header = 'Category';
        this.subHeader = 'category list';
      }
    });
  }
  ngOnInit(): void {
    this.activeUserFromLStorage();
    this.categoryListInIt();
  }
  activeUserFromLStorage() {
    const activeUser =
      this.localstorageservice.getItemFromLocalStorage('currentUser');
    console.log('activeUser', activeUser);
  }
  categoryListInIt() {
    this.categoryList().then((response: any) => {
      console.log('response category', response);
      if (
        response &&
        response['data'] &&
        response['data'].length &&
        response['data'].length > 0
      ) {
        this.categoryListInfo = response['data'];
        this.api_loading = false;
      }
    });
  }
  categoryList() {
    const _this = this;
    _this.api_loading = true;
    return new Promise((resolve, reject) => {
      _this.riskService.getCategoryData().subscribe(
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
  actionPerformed(actionHeader: any) {
    console.log('actionheader', actionHeader);
    if (
      actionHeader &&
      actionHeader['content'] &&
      actionHeader['content'] === 'Delete'
    ) {
      this.actionPerformedDelete(actionHeader);
    } else if (
      actionHeader &&
      actionHeader['content'] &&
      actionHeader['content'] === 'Edit'
    ) {
      this.actionPerformedEdit(actionHeader);
    } else if (
      actionHeader &&
      actionHeader['content'] &&
      actionHeader['content'] === 'Status'
    ) {
      this.actionPerformedStatus(actionHeader);
    }
  }
  actionPerformedStatus(actionHeader: any) {}
  actionPerformedEdit(actionHeader: any) {}
  actionPerformedDelete(actionHeader: any) {}
  applySearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filterValue', filterValue);
    this.sharedService.tableSearch();
  }
  sortData(sort: Sort) {
    const data = this.categoryListInfo.slice();
    if (!sort.active || sort.direction === '') {
      this.categoryListInfo = data;
      return;
    }
    this.categoryListInfo = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'category_name':
          return this.compare(a['category_name'], b['category_name'], isAsc);
        case 'category_description':
          return this.compare(
            a['category_description'],
            b['category_description'],
            isAsc
          );
        default:
          return 0;
      }
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  all(value: boolean) {
    console.log('all value', value);
    this.allChecked = value;
    this.categoryListInfo = this.categoryListInfo.map((m: any) => ({
      ...m,
      checked: value,
    }));
    console.log('categoryListInfo checkbox::::::::', this.categoryListInfo);
    console.log('allChecked', this.allChecked);
    if (this.allChecked && this.allChecked === true) {
      this.checkboxSelectValueList = this.categoryListInfo;
    } else {
      this.checkboxSelectValueList = [];
    }
    console.log('checkboxSelectValueList', this.checkboxSelectValueList);
  }
  checkboxSelect(value: any, index: any) {
    console.log('after checkboz select value', value);
    console.log('inddex', index);
    this.indeterminate = true;
    console.log('indeterminate', this.indeterminate);
    if (value && value['checked'] && value['checked'] === true) {
      this.checkboxSelectValueList.push(value);
    } else {
      this.checkboxSelectValueList = this.checkboxSelectValueList.filter(
        (check: any) => {
          return check['checked'] !== false;
        }
      );
    }
    console.log('checkboxSelectValueList', this.checkboxSelectValueList);
  }
}
