import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';
import { loginComponent } from './login.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';
import { LoadingSpinnerModule } from '../spinner/loading-spinner.module';
import { MatInputModule } from '@angular/material/input';
import {
  TranslateModule,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';
import { SnackbarService } from '../snackbar/snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Overlay } from '@angular/cdk/overlay';
import { ErrorMessagingService } from '../errorMessage/error-message.service';
import { AuthService } from '../auth-service';
import { ServiceMeta } from '../constants/service-meta/service-meta';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: loginComponent,
  },
];

@NgModule({
  declarations: [loginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    [RouterModule.forChild(routes)],
    LoadingSpinnerModule,
    ReactiveFormsModule,
    MatInputModule,
    TranslateModule,
    TranslateModule.forRoot(),
    MatButtonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  exports: [loginComponent],
  providers: [
    TranslateService,
    TranslateStore,
    SnackbarService,
    MatSnackBar,
    Overlay,
    ErrorMessagingService,
    AuthService,
    ServiceMeta,
  ],
})
export class loginModule {}
