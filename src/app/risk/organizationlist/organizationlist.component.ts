import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { riskService } from '../risk.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { LocalStorageService } from 'src/app/constants/storage/local-storage.service';
import { sharedService } from 'src/app/constants/shared_services/shared-services';
import { ThemePalette } from '@angular/material/core';
import { projectConstantLocal } from 'src/app/constants/project_constant/project-constantLocal';
import { MatDialog } from '@angular/material/dialog';
import { confirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Sort } from '@angular/material/sort';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-organizationlist',
  templateUrl: './organizationlist.component.html',
  styleUrls: ['./organizationlist.component.scss'],
})
export class OrganizationlistComponent implements OnInit {
  type: any;
  header: any;
  organizationList: any = [];
  api_loading: boolean = true;
  filterapplied: boolean = false; // hidden by default
  activeUser: any;
  subHeader: string = '';
  color: ThemePalette = 'primary';
  checked: any = [];
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
  allChecked: boolean = false;
  indeterminate: boolean = false;
  checkboxSelectValueList: any = [];
  userList: any;
  isShownSidenav: boolean = false;
  //filter variable
  searchPlanName: any;
  searchAddress: any;
  searchAcctStatus: any;
  tempAddressList: any = [];
  tempSubscriptionList: any = [];
  searchOrganizationForm: any;
  addressOptions: any;
  planOptions: any;
  perPage = projectConstantLocal.PERPAGING_LIMIT;
  filter = {
    address: '',
    planName: '',
    acct_status: '',
    page_count: projectConstantLocal['PERPAGING_LIMIT'],
    page: 1,
  };
  p: any = 1;
  constructor(
    private riskService: riskService,
    private snackbarService: SnackbarService,
    private router: Router,
    private activated_router: ActivatedRoute,
    private lStorageService: LocalStorageService,
    private sharedService: sharedService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.queryParamsFn();
  }

  ngOnInit(): void {
    this.activeUserFromLStorage();
    this.inItOrganizationFn();
    this.getUserTypeInit();
    this.InitFormGroupSearch();
  }
  activeUserFromLStorage() {
    this.activeUser =
      this.lStorageService.getItemFromLocalStorage('currentUser');
    console.log('activeUser', this.activeUser);
  }
  inItOrganizationFn() {
    this.getOrganizationInfo().then((orgaInfo: any) => {
      if (orgaInfo && orgaInfo['data']) {
        this.organizationList = orgaInfo['data'];
        console.log('organizationList', this.organizationList);
        this.api_loading = false;
        this.organizationList = this.organizationList.slice();
        this.addressList();
      }
    });
  }
  queryParamsFn() {
    this.activated_router.queryParams.subscribe((qparams: any) => {
      console.log('qparams', qparams);
      if (qparams && qparams['type'] && qparams['type']) {
        this.type = qparams['type'];
        console.log('type', this.type);
        this.header = 'Organization';
        this.subHeader = 'Organization List';
      }
    });
  }

  getOrganizationInfo() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.getOrganizationList().subscribe(
        (res: any) => {
          console.log(res);
          resolve(res);
        },
        (error) => {
          reject(error);
          console.log('error', error);

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
  toggleShow() {
    this.filterapplied = !this.filterapplied;
  }
  all(value: boolean) {
    console.log('all value', value);
    this.allChecked = value;
    this.organizationList = this.organizationList.map((m: any) => ({
      ...m,
      checked: value,
    }));
    console.log('organizationList checkbox::::::::', this.organizationList);
    console.log('allChecked', this.allChecked);
    if (this.allChecked && this.allChecked === true) {
      this.checkboxSelectValueList = this.organizationList;
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
  getUserTypeInit() {
    this.getUserType().then((user: any) => {
      console.log('user', user);
      if (user && user['status'] && user['status'] === 200) {
        if (
          user &&
          user['data'] &&
          user['data'].length &&
          user['data'].length > 0
        ) {
          this.userList = user['data'].filter(function (_user: any) {
            return _user.user_type !== 'Member';
          });
          this.userList = [
            {
              id: 1,
              user_type: 'Organization',
              img: '/assets/images/business.png',
            },
            {
              id: 2,
              user_type: 'Individual',
              img: '/assets/images/add-user.png',
            },
          ];
          console.log('userList', this.userList);
        }
      }
    });
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
  addOrganization(data: any) {
    console.log('data', data);
    if (data && data['user_type'] && data['user_type'] === 'Organization') {
      const navigationExtrasToCreateOrganization: NavigationExtras = {
        queryParams: {
          type: 'createOrganization',
          action: 'create',
          id: data['id'],
          userType: data['user_type'],
        },
      };
      this.router.navigate(
        ['/create-organization'],
        navigationExtrasToCreateOrganization
      );
    } else if (
      data &&
      data['user_type'] &&
      data['user_type'] === 'Individual'
    ) {
      const navigationExtrasToCreateOrganization: NavigationExtras = {
        queryParams: {
          type: 'createIndividual',
          action: 'create',
          id: data['id'],
          userType: data['user_type'],
        },
      };
      this.router.navigate(
        ['/create-individual'],
        navigationExtrasToCreateOrganization
      );
    }
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
  actionPerformedDelete(data: any) {
    if (
      this.checkboxSelectValueList &&
      this.checkboxSelectValueList.length &&
      this.checkboxSelectValueList.length > 0
    ) {
      this.dialogConfirmation(
        this.checkboxSelectValueList,
        'organizationListDelete'
      );
    } else {
      const error: string =
        projectConstantLocal.SUBSCRIPTION_TABLE_ACTION_VALIDATION + ' delete';
      this.snackbarService.OpenSnackBar(error, {
        panelClass: 'snackbarerror',
      });
    }
  }
  actionPerformedEdit(data: any) {
    if (
      this.checkboxSelectValueList &&
      this.checkboxSelectValueList.length &&
      this.checkboxSelectValueList.length === 1
    ) {
      let dataToSend: any;
      for (let i = 0; i < this.checkboxSelectValueList.length; i++) {
        dataToSend = {
          acct_status: this.checkboxSelectValueList[i]['acct_status'],
          id: this.checkboxSelectValueList[i]['id'],
          name: this.checkboxSelectValueList[i]['name'],
          head: this.checkboxSelectValueList[i]['head'],
          user_type__user_type:
            this.checkboxSelectValueList[i]['user_type__user_type'],
          address: this.checkboxSelectValueList[i]['address'],
          postal_code: this.checkboxSelectValueList[i]['postal_code'],
          created_date: this.checkboxSelectValueList[i]['created_date'],
          country_id__country_name:
            this.checkboxSelectValueList[i]['country_id__country_name'],
          state_id__state_name:
            this.checkboxSelectValueList[i]['state_id__state_name'],
          plan_id__plan_name:
            this.checkboxSelectValueList[i]['plan_id__plan_name'],
          plan_start_date: this.checkboxSelectValueList[i]['plan_start_date'],
          plan_end_date: this.checkboxSelectValueList[i]['plan_end_date'],
          user_id__first_name:
            this.checkboxSelectValueList[i]['user_id__first_name'],
          user_id__last_name:
            this.checkboxSelectValueList[i]['user_id__last_name'],
          user_id__email: this.checkboxSelectValueList[i]['user_id__email'],
          annual_turnover__annual_turnover_range:
            this.checkboxSelectValueList[i][
              'annual_turnover__annual_turnover_range'
            ],
          export_country__country_name:
            this.checkboxSelectValueList[i]['export_country__country_name'],
          industry__industry_name:
            this.checkboxSelectValueList[i]['industry__industry_name'],
          emp_range__emp_range:
            this.checkboxSelectValueList[i]['emp_range__emp_range'],
          emp_range_id: this.checkboxSelectValueList[i]['emp_range_id'],
          annual_turnover_id:
            this.checkboxSelectValueList[i]['annual_turnover_id'],
          industry_id: this.checkboxSelectValueList[i]['industry_id'],
          is_profitable: this.checkboxSelectValueList[i]['is_profitable'],
          country_id: this.checkboxSelectValueList[i]['country_id'],
          state_id: this.checkboxSelectValueList[i]['state_id'],
          export_country_id:
            this.checkboxSelectValueList[i]['export_country_id'],
        };
      }
      console.log('dataToSend', dataToSend);
      if (
        dataToSend &&
        dataToSend['user_type__user_type'] &&
        dataToSend['user_type__user_type'] === 'Individual'
      ) {
        const navigationExtrasToIndividual: NavigationExtras = {
          queryParams: {
            type: 'createIndividual',
            action: 'edit',
            dataToSend: JSON.stringify(dataToSend),
          },
        };
        this.router.navigate(
          ['/create-individual'],
          navigationExtrasToIndividual
        );
      } else if (
        dataToSend &&
        dataToSend['user_type__user_type'] &&
        dataToSend['user_type__user_type'] === 'Organization'
      ) {
        const navigationExtrasToOrganization: NavigationExtras = {
          queryParams: {
            type: 'createOrganization',
            action: 'edit',
            dataToSend: JSON.stringify(dataToSend),
          },
        };
        this.router.navigate(
          ['/create-organization'],
          navigationExtrasToOrganization
        );
      }
    } else {
      const error: string =
        projectConstantLocal.TABLE_ACTION_VALIDATION + ' edit';
      this.snackbarService.OpenSnackBar(error, {
        panelClass: 'snackbarerror',
      });
    }
  }
  actionPerformedStatus(data: any) {
    if (
      this.checkboxSelectValueList &&
      this.checkboxSelectValueList.length &&
      this.checkboxSelectValueList.length > 0
    ) {
      this.dialogConfirmation(
        this.checkboxSelectValueList,
        'organizationListStatus'
      );
    } else {
      const error: string =
        projectConstantLocal.SUBSCRIPTION_TABLE_ACTION_VALIDATION +
        ' status change';
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
        subscriptionDetails: value,
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
                this.inItOrganizationFn();
                this.api_loading = false;
              }
            });
          }
        } else if (
          result &&
          result['actionValue'] &&
          result['actionValue'] === 'status'
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
              status: result['bContent'],
            };
            this.statusAction(post_body).then((afterRes: any) => {
              console.log('afterRes', afterRes);
              if (
                afterRes &&
                afterRes['status'] &&
                afterRes['status'] === 200
              ) {
                this.inItOrganizationFn();
                this.api_loading = false;
                this.snackbarService.OpenSnackBar(afterRes['message'], {
                  panelClass: 'snackbarnormal',
                });
              }
            });
          }
        }
      }
    });
  }
  deleteAction(post_data: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.organizationDelete(post_data).subscribe(
        (res: any) => {
          console.log('after delete res', res);
          resolve(res);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }
  statusAction(post_data: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.organizationStatusUpdate(post_data).subscribe(
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
  sortData(sort: Sort) {
    const data = this.organizationList.slice();
    if (!sort.active || sort.direction === '') {
      this.organizationList = data;
      return;
    }

    this.organizationList = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'address':
          return this.compare(a.address, b.address, isAsc);
        case 'country_id__country_name':
          return this.compare(
            a.country_id__country_name,
            b.country_id__country_name,
            isAsc
          );
        case 'state_id__state_name':
          return this.compare(
            a.state_id__state_name,
            b.state_id__state_name,
            isAsc
          );
        case 'export_country__country_name':
          return this.compare(
            a.export_country__country_name,
            b.export_country__country_name,
            isAsc
          );
        case 'industry__industry_name':
          return this.compare(
            a.industry__industry_name,
            b.industry__industry_name,
            isAsc
          );
        case 'user_type__user_type':
          return this.compare(
            a.user_type__user_type,
            b.user_type__user_type,
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
  applySearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filterValue', filterValue);
    this.riskService
      .searchOrganizationData(filterValue)
      .subscribe((res: any) => {
        console.log('res', res);
        if (
          res &&
          res['data'] &&
          res['data'].length &&
          res['data'].length > 0
        ) {
          this.organizationList = res['data'];
        } else {
          this.snackbarService.OpenSnackBar(
            projectConstantLocal['SEARCH_ERROR'],
            {
              panelClass: 'snackbarerror',
            }
          );
        }
      });
  }
  InitFormGroupSearch() {
    this.searchOrganizationForm = this.formBuilder.group({
      address: [''],
      accountStatus: [''],
      planSearch: [''],
    });
  }
  addressList() {
    for (var i = 0; i < this.organizationList.length; i++) {
      this.tempAddressList.push(this.organizationList[i]['address']);
      this.tempSubscriptionList.push(
        this.organizationList[i]['plan_id__plan_name']
      );
    }
    this.searchAddressInit();
    this.searchPlanInit();
  }
  searchAddressInit() {
    this.addressOptions = this.searchOrganizationForm
      .get('address')
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filter(value || ''))
      );
  }
  searchPlanInit() {
    this.planOptions = this.searchOrganizationForm
      .get('planSearch')
      .valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filterSearch(value || ''))
      );
  }
  _filterSearch(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tempSubscriptionList.filter((option: any) => {
      option.toLowerCase().includes(filterValue);
    });
  }
  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tempAddressList.filter((option: any) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  actionPerformedSearch(formData: any) {
    console.log('formdata', formData);
  }
  resetFilter() {
    this.filter = {
      address: '',
      planName: '',
      acct_status: '',
      page_count: projectConstantLocal.PERPAGING_LIMIT,
      page: 1,
    };
    this.searchOrganizationForm.controls.address.setValue('');
    this.searchOrganizationForm.controls.accountStatus.setValue('');
    this.searchOrganizationForm.controls.planSearch.setValue('');
  }
  closeFilter() {
    console.log();
    this.api_loading = true;
    this.resetFilter();
    this.filterapplied = false;
    this.inItOrganizationFn();
  }
  applyFilter(form_submit: any) {
    console.log('form_submit', form_submit);
    if (
      form_submit &&
      form_submit['address'] === '' &&
      form_submit['planSearch'] === '' &&
      form_submit['accountStatus'] === ''
    ) {
      console.log('came here');
      this.api_loading = false;
      this.snackbarService.OpenSnackBar(projectConstantLocal['SEARCHERROR'], {
        panelClass: 'snackbarerror',
      });
    } else {
      this.filterSearchAction(form_submit);
    }
  }
  filterSearchOrganization(filter: any) {
    console.log('filter', filter);
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.getOrganizationInfo(filter).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }
  filterSearchAction(form_submit: any) {
    var filter: any = {};
    this.api_loading = true;
    if (
      form_submit &&
      form_submit['address'] !== '' &&
      form_submit['planSearch'] !== '' &&
      form_submit['accountStatus'] !== ''
    ) {
      filter =
        'address=' +
        form_submit['address'] +
        '&' +
        'plan_id=' +
        form_submit['planSearch'] +
        '&' +
        'acct_status=' +
        form_submit['accountStatus'];
    } else {
      if (
        form_submit &&
        form_submit['address'] !== '' &&
        form_submit['planSearch'] !== ''
      ) {
        filter =
          'address=' +
          form_submit['address'] +
          '&' +
          'plan_id=' +
          form_submit['planSearch'];
      } else if (
        form_submit &&
        form_submit['address'] !== '' &&
        form_submit['accountStatus'] !== ''
      ) {
        filter =
          'address=' +
          form_submit['address'] +
          '&' +
          'acct_status=' +
          form_submit['accountStatus'];
      } else if (
        form_submit &&
        form_submit['accountStatus'] !== '' &&
        form_submit['planSearch'] !== ''
      ) {
        filter =
          'plan_id=' +
          form_submit['planSearch'] +
          '&' +
          'acct_status=' +
          form_submit['accountStatus'];
      } else if (form_submit && form_submit['address'] !== '') {
        filter = 'address=' + form_submit['address'];
      } else if (form_submit && form_submit['planSearch'] !== '') {
        filter = 'plan_id=' + form_submit['planSearch'];
      } else if (form_submit && form_submit['accountStatus'] !== '') {
        filter = 'acct_status=' + form_submit['accountStatus'];
      }
    }
    this.filterSearchOrganization(filter).then((orgaInfo: any) => {
      this.organizationList = orgaInfo['data'];
      console.log('organizationList', this.organizationList);
      this.api_loading = false;
      this.filterapplied = false;
    });
  }
}
