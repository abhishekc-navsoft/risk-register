import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/constants/storage/local-storage.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { riskService } from '../risk.service';
import { sharedService } from 'src/app/constants/shared_services/shared-services';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { projectConstantLocal } from 'src/app/constants/project_constant/project-constantLocal';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class confirmDialogComponent implements OnInit {
  actionBtnList: any;
  selectedIds: any = [];
  selectedStatus: any;
  statusList: any = [
    {
      id: 1,
      content: 'Active',
    },
    {
      id: 2,
      content: 'Inactive',
    },
  ];
  constructor(
    private dialogRef: MatDialogRef<confirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any = MatDialog,
    private sharedService: sharedService,
    private snackbarService: SnackbarService
  ) {}
  ngOnInit(): void {
    console.log('data', this.data);
    this.actionBtnList = this.sharedService.actionBtn;
  }
  closeDialog() {}
  saveDialog() {
    this.dialogRef.close('Yes');
  }
  saveDialogAction(txt: string, action: string) {
    for (let i = 0; i < this.data['subscriptionDetails'].length; i++) {
      this.selectedIds.push(this.data['subscriptionDetails'][i]['id']);
    }
    const post_data: any = {
      confirmation: txt,
      actionValue: action,
      ids: this.selectedIds,
    };
    this.dialogRef.close(post_data);
  }
  statusChange(status: any) {
    console.log('status', status);
    this.selectedStatus = status['content'];
  }
  saveDialogActionStatus(txt: string, action: string) {
    console.log('selectedStatus', this.selectedStatus);
    if (!this.selectedStatus) {
      this.snackbarService.OpenSnackBar(projectConstantLocal.STATUS_SELECT, {
        panelClass: 'snackbarerror',
      });
    } else {
      for (let i = 0; i < this.data['subscriptionDetails'].length; i++) {
        this.selectedIds.push(this.data['subscriptionDetails'][i]['id']);
      }
      const post_data: any = {
        confirmation: txt,
        actionValue: action,
        ids: this.selectedIds,
      };
      if (this.selectedStatus && this.selectedStatus === 'Active') {
        post_data['bContent'] = true;
      } else {
        post_data['bContent'] = false;
      }
      this.dialogRef.close(post_data);
    }
  }
}
