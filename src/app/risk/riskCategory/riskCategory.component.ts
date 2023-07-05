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
import { MatDialog } from '@angular/material/dialog';
import { confirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
    // {
    //   id: 3,
    //   content: 'Status',
    //   icon: 'lock',
    // },
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
  checkboxSelectValueList: any = [];
  constructor(
    private localstorageservice: LocalStorageService,
    private riskService: riskService,
    private snackbarService: SnackbarService,
    private router: Router,
    private activated_router: ActivatedRoute,
    private location: Location,
    private sharedService: sharedService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private dialog: MatDialog
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
    if (actionHeader && actionHeader === 'create') {
      this.actionPerformCreate();
    } else if (
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
  actionPerformCreate() {
    const navigationExtrasToAddCategory: NavigationExtras = {
      queryParams: {
        type: 'addCategory',
        action: 'create',
      },
    };
    this.router.navigate(['/addRiskCategory'], navigationExtrasToAddCategory);
  }
  actionPerformedStatus(actionHeader: any) {}
  actionPerformedEdit(actionHeader: any) {
    if (
      this.checkboxSelectValueList &&
      this.checkboxSelectValueList.length &&
      this.checkboxSelectValueList.length === 1
    ) {
      let dataToSend: any;
      for (let i = 0; i < this.checkboxSelectValueList.length; i++) {
        dataToSend = {
          category_name: this.checkboxSelectValueList[i]['category_name'],
          category_description:
            this.checkboxSelectValueList[i]['category_description'],
          id: this.checkboxSelectValueList[i]['id'],
        };
      }
      console.log('dataToSend', dataToSend);
      const navigationExtrasToOrganization: NavigationExtras = {
        queryParams: {
          type: 'addCategory',
          action: 'edit',
          dataToSend: JSON.stringify(dataToSend),
        },
      };
      this.router.navigate(
        ['/addRiskCategory'],
        navigationExtrasToOrganization
      );
    } else {
      const error: string =
        projectConstantLocal.TABLE_ACTION_VALIDATION + ' edit';
      this.snackbarService.OpenSnackBar(error, {
        panelClass: 'snackbarerror',
      });
    }
  }
  actionPerformedDelete(data: any) {
    if (
      this.checkboxSelectValueList &&
      this.checkboxSelectValueList.length &&
      this.checkboxSelectValueList.length > 0
    ) {
      this.dialogConfirmation(
        this.checkboxSelectValueList,
        'categoryListDelete'
      );
    } else {
      const error: string =
        projectConstantLocal.SUBSCRIPTION_TABLE_ACTION_VALIDATION + ' delete';
      this.snackbarService.OpenSnackBar(error, {
        panelClass: 'snackbarerror',
      });
    }
  }
  dialogConfirmation(value: any, txt: string) {
    console.log('value from checkbox', value);
    console.log('txt', txt);
    const dialogRef = this.dialog.open(confirmDialogComponent, {
      width: '650px',
      data: {
        requestType: txt,
        categoryDetails: value,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('result', result);
      if (
        result &&
        result['confirmation'] &&
        result['confirmation'] === 'yes'
      ) {
        if (
          result &&
          result['actionValue'] &&
          result['actionValue'] === 'delete'
        ) {
          if (
            result &&
            result['ids'] &&
            result['ids'].length &&
            result['ids'].length > 0
          ) {
            this.api_loading = true;
            console.log(result['ids']);
            const post_body = {
              ids: result['ids'],
            };
            this.deleteAction(post_body).then((afterRes: any) => {
              console.log('afterRes', afterRes);
              if (
                afterRes &&
                afterRes['status'] &&
                afterRes['status'] === 200
              ) {
                this.categoryListInIt();
                this.api_loading = false;
              }
            });
          }
        }
      }
    });
  }
  deleteAction(post_body: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.categoryDelete(post_body).subscribe(
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
