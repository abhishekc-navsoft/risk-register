import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/constants/storage/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { confirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { riskService } from '../risk.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { sessionStorageService } from 'src/app/constants/storage/session-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  header: string = 'Risk Register';
  activeUser_user_name: string = '';
  activeUser_email: string = '';
  hidden: boolean = false;
  notifications_count: number = 10;
  activeUserGlobal: any;
  constructor(
    private localstorageservice: LocalStorageService,
    private sessionStorage: sessionStorageService,
    private dialog: MatDialog,
    private riskService: riskService,
    private snackbarSErvice: SnackbarService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.activeUserFnInit();
  }
  activeUserFnInit() {
    const activeUser =
      this.localstorageservice.getItemFromLocalStorage('currentUser');
    console.log('activeUser', activeUser);
    this.activeUserGlobal = activeUser;
    this.activeUserInit(activeUser);
  }
  activeUserInit(user: any) {
    if (user && user['user_name']) {
      this.activeUser_user_name = user['user_name'];
    }
    if (user && user['user_email']) {
      this.activeUser_email = user['user_email'];
    }
  }
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
  openDialog(user: any): void {
    const post_body: any = {
      email: user['user_email'],
      token: user['token'],
    };
    const dialogRef = this.dialog.open(confirmDialogComponent, {
      width: '650px',
      data: {
        requestType: 'logout',
        userDetails: user,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('result', result);
      if (result && result === 'Yes') {
        this.adminLogout(post_body).then((afterRes: any) => {
          console.log('afterRes', afterRes);
          if (afterRes && afterRes['status'] === 200) {
            this.localstorageservice.removeItemFromLocalStorage('currentUser');
            this.sessionStorage.removeItemFromSessionStorage('currentUser');
            this.router.navigate(['/login']);

            const msg: string = 'Logged Out Successfully';
            this.snackbarSErvice.OpenSnackBar(msg, {
              panelClass: 'snackbarnormal',
            });
          }
        });
      }
    });
  }
  adminLogout(post_data: any) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.riskService.logoutAdmin(post_data).subscribe(
        (res) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
