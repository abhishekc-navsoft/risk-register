import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { projectConstantLocal } from '../constants/project_constant/project-constantLocal';
// import { ErrorMessagingService } from '../errorMessage/error-message.service';
@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(
    private snackbar: MatSnackBar // private errorMsgService: ErrorMessagingService
  ) {}
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  OpenSnackBar(message: any, params: any = []) {
    const panelClass = params['panelClass']
      ? params['panelClass']
      : 'snackbarnormal' || 'snackbarnormal_orange';
    if (
      params['panelClass'] === 'snackbarerror' ||
      params['panelClass'] === 'snackbarError'
    ) {
      //   message = this.errorMsgService.getApiError(message);
    }
    let duration = projectConstantLocal['SNACKBAR_TIMEOUT_DELAY'];
    if (params['duration']) {
      duration = params['duration'];
    }
    const snackbarRef = this.snackbar.open(message, '', {
      duration: duration,
      panelClass: panelClass,
      horizontalPosition: 'center',
    });
    return snackbarRef;
  }
}
