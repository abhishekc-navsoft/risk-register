import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { riskService } from '../risk.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { LocalStorageService } from 'src/app/constants/storage/local-storage.service';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { projectConstantLocal } from 'src/app/constants/project_constant/project-constantLocal';

import { sharedService } from 'src/app/constants/shared_services/shared-services';
import { AccountService } from 'src/app/account.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ThemePalette } from '@angular/material/core';
import { sessionStorageService } from 'src/app/constants/storage/session-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { confirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  tableActionBtnList: any = this.sharedService.tableHeaderActionBtn;

  @ViewChild(MatPaginator)
  header: string = '';
  api_loading: boolean = false;
  type: any;
  currency: string = '$';
  @ViewChildren('checkBox') checkBox: any = QueryList<any>;
  checked: any = [];
  color: ThemePalette = 'accent';
  subscriptionList: any;
  subHeader: string = '';
  allChecked: boolean = false;
  indeterminate: boolean = false;
  checkboxSelectValueList: any = [];

  constructor(
    private riskService: riskService,
    private snackbarService: SnackbarService,
    private router: Router,
    private activated_router: ActivatedRoute,
    private localstorageservice: LocalStorageService,
    private sharedService: sharedService,
    private sessionStorage: sessionStorageService,
    private dialog: MatDialog
  ) {
    this.queryParamsFn();
  }
  ngOnInit(): void {
    this.activeUserFromLStorage();
    this.inItSubscriptionDetails();
  }
  activeUserFromLStorage() {
    const activeUser =
      this.localstorageservice.getItemFromLocalStorage('currentUser');
    console.log('activeUser', activeUser);
    console.log(
      'session',
      this.sessionStorage.getItemFromSessionStorage('currentUser')
    );
  }
  inItSubscriptionDetails() {
    this.api_loading = true;
    this.getSubscriptionListFn().then((element: any) => {
      console.log('element', element);
      if (element && element['status'] && element['status'] === 200) {
        if (element['data']) {
          this.subscriptionList = element['data'];
          this.api_loading = false;
        }
      }
    });
  }
  getSubscriptionListFn(search_data?: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      this.riskService.getSubscriptionList(search_data).subscribe(
        (res: any) => {
          console.log('subscriptionDetails', res);
          resolve(res);
        },
        (error) => {
          reject(error);
          this.api_loading = false;
        }
      );
    });
  }

  queryParamsFn() {
    this.activated_router.queryParams.subscribe((qparams: any) => {
      console.log('qparams', qparams);
      if (qparams && qparams['type'] && qparams['type']) {
        this.type = qparams['type'];
        console.log('type', this.type);
        this.header = this.type;
        console.log('header', this.header);
        this.subHeader = 'Subscription List';
      }
    });
  }
  craeteSubscription() {
    const navigationExtrasToCreateSub: NavigationExtras = {
      queryParams: {
        type: 'createSubscription',
        action: 'create',
      },
    };
    this.router.navigate(['/create-subscription'], navigationExtrasToCreateSub);
  }
  all(value: boolean) {
    console.log('all value', value);
    this.allChecked = value;
    this.subscriptionList = this.subscriptionList.map((m: any) => ({
      ...m,
      checked: value,
    }));
    console.log('subscriptionList checkbox::::::::', this.subscriptionList);
    console.log('allChecked', this.allChecked);
    if (this.allChecked && this.allChecked === true) {
      this.checkboxSelectValueList = this.subscriptionList;
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
  actionPerformed(data: any) {
    console.log('data', data);
    console.log('this.checkboxSelectValueList', this.checkboxSelectValueList);
    if (data && data['content'] && data['content'] === 'Delete') {
      if (
        this.checkboxSelectValueList &&
        this.checkboxSelectValueList.length &&
        this.checkboxSelectValueList.length > 0
      ) {
        this.dialogConfirmation(
          this.checkboxSelectValueList,
          'subscriptionListDelete'
        );
      } else {
        const error: string =
          projectConstantLocal.SUBSCRIPTION_TABLE_ACTION_VALIDATION + ' delete';
        this.snackbarService.OpenSnackBar(error, {
          panelClass: 'snackbarerror',
        });
      }
    } else {
      if (data && data['content'] && data['content'] === 'Edit') {
        if (
          this.checkboxSelectValueList &&
          this.checkboxSelectValueList.length &&
          this.checkboxSelectValueList.length === 1
        ) {
          let dataToSend: any;
          for (let i = 0; i < this.checkboxSelectValueList.length; i++) {
            dataToSend = {
              id: this.checkboxSelectValueList[i]['id'],
              plan_name: this.checkboxSelectValueList[i]['plan_name'],
              plan_description:
                this.checkboxSelectValueList[i]['plan_description'],
              price: this.checkboxSelectValueList[i]['price'],
              duration: this.checkboxSelectValueList[i]['duration'],
              no_of_risks_allowed:
                this.checkboxSelectValueList[i]['no_of_risks_allowed'],
            };
          }
          console.log('dataToSend', dataToSend);
          const navigationExtrasToSubscription: NavigationExtras = {
            queryParams: {
              type: 'createSubscription',
              action: 'edit',
              dataToSend: JSON.stringify(dataToSend),
            },
          };
          this.router.navigate(
            ['/create-subscription'],
            navigationExtrasToSubscription
          );
        } else {
          const error: string =
            projectConstantLocal.SUBSCRIPTION_TABLE_ACTION_VALIDATION + ' edit';
          this.snackbarService.OpenSnackBar(error, {
            panelClass: 'snackbarerror',
          });
        }
      }
    }
  }
  dialogConfirmation(value: any, txt: string) {
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
              if (
                afterRes &&
                afterRes['status'] &&
                afterRes['status'] === 200
              ) {
                this.api_loading = false;
                this.inItSubscriptionDetails();
              }
            });
          }
        }
        // else if (
        //   result &&
        //   result['actionValue'] &&
        //   result['actionValue'] === 'edit'
        // ) {
        // }
      }
    });
  }
  deleteAction(post_data: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.deleteSubscription(post_data).subscribe(
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
  applyFilter(event: Event) {
    this.sharedService.tableSearch();
  }
}
