import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  CommonModule,
  DatePipe,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ExtendHttpInterceptor } from './extendhttp.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ServiceMeta } from './constants/service-meta/service-meta';
import { AccountService } from './account.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginService } from './login/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from './snackbar/snackbar.service';
import { Overlay } from '@angular/cdk/overlay';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    DatePipe,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ExtendHttpInterceptor,
    //   multi: true,
    // },
    ServiceMeta,
    AccountService,
    LoginService,
    SnackbarService,
    MatSnackBar,
    Overlay,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule {}
