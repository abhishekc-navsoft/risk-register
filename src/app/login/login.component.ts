import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../constants/storage/local-storage.service';
import { projectConstantLocal } from '../constants/project_constant/project-constantLocal';
import { SnackbarService } from '../snackbar/snackbar.service';
import { LoginService } from './login.service';
import { NavigationExtras, Router } from '@angular/router';
import { sharedService } from '../constants/shared_services/shared-services';
import { Subject } from 'rxjs';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class loginComponent implements OnInit {
  api_loading: boolean = true;
  registerForm: any;
  submitted: boolean = false;
  email_label = projectConstantLocal['EMAIL_LABEL'];
  pasword_label = projectConstantLocal['PASSWORD_LABEL'];
  email_req = projectConstantLocal['EMAIL_REQUIRED'];
  pass_req = projectConstantLocal['PASSWORD_REQUIRED'];
  email_validation_msg = projectConstantLocal['EMAIL_VALID_MSG'];
  pass_validation_msg = projectConstantLocal['PASS_VALID_MSG'];
  login_btn = projectConstantLocal['LOG_IN_BTN'];
  private subject = new Subject<any>();

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private lStorageSErvice: LocalStorageService,
    private snackbarService: SnackbarService,
    private loginService: LoginService,
    private router: Router,
    private sharedService: sharedService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.InitFormGroup();
    this.translateInit();
  }
  translateInit() {
    let language: any;
    language =
      this.lStorageSErvice.getItemFromLocalStorage('translatevariable');
    this.translate.setDefaultLang(language);
    this.translate.use(language);
  }
  get f() {
    return this.registerForm.controls;
  }
  InitFormGroup() {
    this.registerForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.registerForm.value);
    if (this.registerForm.invalid) {
      if (this.registerForm.controls.email.value === '') {
        this.snackbarService.OpenSnackBar(
          projectConstantLocal['EMAIL_VALID_MSG'],
          {
            panelClass: 'snackbarerror',
          }
        );
      } else if (this.registerForm.controls.password.value === '') {
        this.snackbarService.OpenSnackBar(
          projectConstantLocal['PASS_VALID_MSG'],
          {
            panelClass: 'snackbarerror',
          }
        );
      }
    } else {
      const post_data = {
        email: this.registerForm.controls.email.value,
        password: this.registerForm.controls.password.value,
      };
      this.authService.login(post_data).then((afterRes: any) => {
        if (afterRes && afterRes['status'] && afterRes['status'] === 200) {
          console.log(afterRes);
          this.snackbarService.OpenSnackBar(
            projectConstantLocal['SUCCESSFULL_LOGiN_MSG'],
            {
              panelClass: 'snackbarnormal',
            }
          );
          // const message = this.lStorageSErvice.setItemLocalStorage(
          //   'currentUser',
          //   afterRes
          // );
          // console.log('message in login service', message);
          // this.lStorageSErvice.getItemFromLocalStorage('currentUser');
          const navigationExtrasToDashboard: NavigationExtras = {
            queryParams: {
              type: 'dashboard',
            },
          };
          this.router.navigate(['/dashboard'], navigationExtrasToDashboard);
        } else if (
          afterRes &&
          afterRes['status'] &&
          afterRes['status'] === 400
        ) {
          console.log(afterRes);
          this.snackbarService.OpenSnackBar(
            projectConstantLocal['EMAIL_NOT_EXIST'],
            {
              panelClass: 'snackbarerror',
            }
          );
          // this.registerForm.reset();
        }
      });
    }
  }
  // password validation
  validatePasswordField(password: any) {
    const passValidate: any = this.sharedService.validatePassword(password);
    // console.log('passValidate', passValidate);
    const passtxt: string = 'Your password is';
    if (passValidate['password_len'] === 0) {
      this.snackbarService.OpenSnackBar(
        projectConstantLocal['PASS_VALID_MSG'],
        {
          panelClass: 'snackbarerror',
        }
      );
    } else {
      if (
        passValidate['strength'] === 'Very Weak' &&
        passValidate['color'] === 'red'
      ) {
        this.snackbarService.OpenSnackBar(
          passtxt + ' ' + passValidate['strength'].toLowerCase(),
          {
            panelClass: 'snackbarerror',
          }
        );
      } else if (
        passValidate['strength'] === 'Medium' &&
        passValidate['color'] === 'orange'
      ) {
        this.snackbarService.OpenSnackBar(
          passtxt + ' ' + passValidate['strength'].toLowerCase(),
          {
            panelClass: 'snackbarnormal_orange',
          }
        );
      } else {
        this.snackbarService.OpenSnackBar(
          passtxt + ' ' + passValidate['strength'].toLowerCase(),
          {
            panelClass: 'snackbarnormal',
          }
        );
      }
    }
  }
}
