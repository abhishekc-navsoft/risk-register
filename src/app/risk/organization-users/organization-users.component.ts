import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { riskService } from '../risk.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { LocalStorageService } from 'src/app/constants/storage/local-storage.service';
import { sharedService } from 'src/app/constants/shared_services/shared-services';
import { projectConstantLocal } from 'src/app/constants/project_constant/project-constantLocal';
import { MatDialog } from '@angular/material/dialog';
import { confirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Sort } from '@angular/material/sort';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-organization-users',
  templateUrl: './organization-users.component.html',
  styleUrls: ['./organization-users.component.scss'],
})
export class OrganizationUserlistComponent implements OnInit {
  type: any;
  header: string = '';
  subHeader: string = '';
  api_loading: boolean = false;
  organizationId: number = 0;
  organizationInfo: any;
  orgMemberList: any;
  color: ThemePalette = 'primary';
  allChecked: boolean = false;
  indeterminate: boolean = false;
  checkboxSelectValueList: any = [];
  filter = {
    address: '',
    planName: '',
    acct_status: '',
    page_count: projectConstantLocal['PERPAGING_LIMIT'],
    page: 1,
  };
  p: any = 1;
  bExpansionPanel: boolean = false;
  constructor(
    private riskService: riskService,
    private snackbarService: SnackbarService,
    private router: Router,
    private activated_router: ActivatedRoute,
    private localstorageservice: LocalStorageService,
    private sharedService: sharedService,
    private dialog: MatDialog
  ) {
    this.queryParamsFn();
  }
  queryParamsFn() {
    this.activated_router.queryParams.subscribe((qparams: any) => {
      console.log('qparams', qparams);
      if (qparams && qparams['type'] && qparams['type']) {
        this.type = qparams['type'];
        console.log('type', this.type);
        this.header = 'Members';
        this.subHeader = 'Members List';
        this.organizationInfo = JSON.parse(qparams['dataToSend']);
        if (this.organizationInfo && this.organizationInfo['id']) {
          const orgaId: any = 44; //this.organizationInfo['id'];
          const acct_status: any = this.organizationInfo['acct_status'];
          this.orgMemberListInit(orgaId, acct_status);
        }
      }
    });
  }
  ngOnInit(): void {
    this.activeUserFromLStorage();
  }
  activeUserFromLStorage() {
    const activeUser =
      this.localstorageservice.getItemFromLocalStorage('currentUser');
    console.log('activeUser', activeUser);
  }
  orgMemberListInit(id: any, acct_status: any) {
    this.orgMemberLists(id).then((response: any) => {
      console.log('response member', response);
      if (
        response &&
        response['data'] &&
        response['data'].length &&
        response['data'].length > 0
      ) {
        this.orgMemberList = response['data'];
        this.orgMemberList = this.orgMemberList.map((m: any) => ({
          ...m,
          isExpand: false,
          acct_status: acct_status,
        }));
        this.orgMemberList = this.orgMemberList.slice();
        this.api_loading = false;
      }
      //   else {
      //     this.orgMemberList = [];
      //   }
    });
  }
  orgMemberLists(id: number) {
    const _this = this;
    _this.api_loading = true;
    return new Promise((resolve, reject) => {
      _this.riskService.orgMemberList(id).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error: any) => {
          reject(error);
          _this.api_loading = false;
        }
      );
    });
  }
  applySearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filterValue', filterValue);
    this.sharedService.tableSearch();
    // this.riskService
    //   .searchOrganizationData(filterValue)
    //   .subscribe((res: any) => {
    //     console.log('res', res);
    //     if (
    //       res &&
    //       res['data'] &&
    //       res['data'].length &&
    //       res['data'].length > 0
    //     ) {
    //       this.orgMemberList = res['data'];
    //     } else {
    //       this.snackbarService.OpenSnackBar(
    //         projectConstantLocal['SEARCH_ERROR'],
    //         {
    //           panelClass: 'snackbarerror',
    //         }
    //       );
    //     }
    //   });
  }
  sortData(sort: Sort) {
    const data = this.orgMemberList.slice();
    if (!sort.active || sort.direction === '') {
      this.orgMemberList = data;
      return;
    }
    this.orgMemberList = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'organization_id__name':
          return this.compare(
            a['organization_id__name'],
            b['organization_id__name'],
            isAsc
          );
        case 'user_id__email':
          return this.compare(a['user_id__email'], b['user_id__email'], isAsc);
        case 'user_id__user_details__phone_number':
          return this.compare(
            a['user_id__user_details__phone_number'],
            b['user_id__user_details__phone_number'],
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
    this.orgMemberList = this.orgMemberList.map((m: any) => ({
      ...m,
      checked: value,
    }));
    console.log('orgMemberList checkbox::::::::', this.orgMemberList);
    console.log('allChecked', this.allChecked);
    if (this.allChecked && this.allChecked === true) {
      this.checkboxSelectValueList = this.orgMemberList;
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
