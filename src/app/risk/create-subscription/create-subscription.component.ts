import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/constants/storage/local-storage.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { riskService } from '../risk.service';
import { sharedService } from 'src/app/constants/shared_services/shared-services';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { projectConstantLocal } from 'src/app/constants/project_constant/project-constantLocal';

@Component({
  selector: 'app-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.scss'],
})
export class CreateSubscriptionComponent implements OnInit {
  header: string = '';
  subHeader: string = '';
  btnAction: string = 'Save';
  subscriptionForm: any;
  submitted: boolean = false;
  textareaMaxLength: any = 256;
  api_loading: boolean = false;
  createdValue: any;
  action: any;
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
    if (this.action && this.action === 'edit') {
      this.updateInitFormGroupValue();
    }
  }
  get f() {
    return this.subscriptionForm.controls;
  }
  InitFormGroup() {
    this.subscriptionForm = this.formBuilder.group({
      planName: ['', [Validators.required]],
      plandescription: ['', [Validators.required]],
      planPrice: ['', [Validators.required]],
      planDuration: ['', [Validators.required]],
      planNumerRisk: ['', [Validators.required]],
    });
  }
  updateInitFormGroupValue() {
    console.log('createValue', this.createdValue);
    this.subscriptionForm.patchValue({
      planName: this.createdValue['plan_name'],
      plandescription: this.createdValue['plan_description'],
      planPrice: this.createdValue['price'],
      planDuration: this.createdValue['duration'],
      planNumerRisk: this.createdValue['no_of_risks_allowed'],
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
          this.header = 'Subscription';
          this.subHeader = 'Add Subscription';
        } else if (
          qparams &&
          qparams['action'] &&
          qparams['action'] === 'edit'
        ) {
          this.header = 'Subscription';
          this.subHeader = 'Edit Subscription';
          this.btnAction = 'Edit';
          console.log('qparams', JSON.parse(qparams['dataToSend']));
          this.createdValue = JSON.parse(qparams['dataToSend']);
        }
      }
    });
  }
  actionPerformed(actionType: any) {
    if (actionType && actionType === 'back') {
      this.sharedService.goBack();
    } else if (actionType && actionType === 'formSubmit') {
      if (this.action && this.action === 'create') {
        this.craeteSubscriptionForm();
      } else if (this.action && this.action === 'edit') {
        this.editSubscriptionForm();
      }
    }
  }
  postData(post_data: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.postSubscriptionData(post_data).subscribe(
        (res: any) => {
          resolve(res);
          console.log('res', res);
        },
        (error: any) => {
          reject(error);
          console.log('error in craete subscription', error);
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
  autoGrowTextarea(e: any) {
    this.sharedService.auto_grow(e);
  }
  actionFormField(txt: any) {
    console.log(txt);
  }

  editSubscriptionForm() {
    const post_data_to_edit = {
      id: this.createdValue['id'],
      plan_name: this.subscriptionForm.controls.planName.value,
      plan_description: this.subscriptionForm.controls.plandescription.value,
      price: this.subscriptionForm.controls.planPrice.value,
      duration: this.subscriptionForm.controls.planDuration.value,
      no_of_risks_allowed: this.subscriptionForm.controls.planNumerRisk.value,
    };
    console.log(post_data_to_edit);
    this.api_loading = true;
    this.postDataToEdit(post_data_to_edit).then((response: any) => {
      if (response && response['status'] && response['status'] === 400) {
        this.api_loading = false;
        this.snackbarService.OpenSnackBar(
          this.sharedService.firstLetterCapital(response['message']),
          {
            panelClass: 'snackbarerror',
          }
        );
        this.subscriptionForm.reset();
      } else if (response && response['status'] && response['status'] === 200) {
        this.api_loading = false;
        this.snackbarService.OpenSnackBar(
          this.sharedService.firstLetterCapital(response['message']),
          {
            panelClass: 'snackbarnormal',
          }
        );
        const navigationExtrasToSubscription: NavigationExtras = {
          queryParams: {
            type: 'subscription',
          },
        };
        this.router.navigate(['/subscription'], navigationExtrasToSubscription);
      } else {
        this.api_loading = false;
      }
    });
  }
  craeteSubscriptionForm() {
    const post_data = {
      plan_name: this.subscriptionForm.controls.planName.value,
      plan_description: this.subscriptionForm.controls.plandescription.value,
      price: this.subscriptionForm.controls.planPrice.value,
      duration: this.subscriptionForm.controls.planDuration.value,
      no_of_risks_allowed: this.subscriptionForm.controls.planNumerRisk.value,
    };
    console.log(post_data);
    this.api_loading = true;
    this.postData(post_data).then((response: any) => {
      console.log('after craete', response);
      if (response && response['status'] && response['status'] === 400) {
        this.api_loading = false;
        this.snackbarService.OpenSnackBar(
          this.sharedService.firstLetterCapital(response['message']),
          {
            panelClass: 'snackbarerror',
          }
        );
        this.subscriptionForm.reset();
      } else if (response && response['status'] && response['status'] === 200) {
        this.api_loading = false;
        this.snackbarService.OpenSnackBar(
          this.sharedService.firstLetterCapital(response['message']),
          {
            panelClass: 'snackbarnormal',
          }
        );
        const navigationExtrasToSubscription: NavigationExtras = {
          queryParams: {
            type: 'subscription',
          },
        };
        this.router.navigate(['/subscription'], navigationExtrasToSubscription);
      } else {
        this.api_loading = false;
      }
    });
  }
  postDataToEdit(post_data_to_edit: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      this.riskService.editSubscriptionData(post_data_to_edit).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }
}
