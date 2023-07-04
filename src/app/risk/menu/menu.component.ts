import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/constants/storage/local-storage.service';
import { sessionStorageService } from 'src/app/constants/storage/session-storage.service';
import { confirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { riskService } from '../risk.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  showFiller: boolean = true;
  sidebarMenuJSON: any = [
    {
      id: 1,
      content: 'dashboard',
      icon: 'dashboard',
    },
    {
      id: 2,
      content: 'master settings',
      icon: 'dashboard',
    },
    {
      id: 3,
      content: 'organizationlist',
      icon: 'group_work',
    },
    {
      id: 4,
      content: 'regionmaster',
      icon: 'dashboard',
    },
    {
      id: 5,
      content: 'industry master',
      icon: 'dashboard',
    },
    {
      id: 6,
      content: 'manage organization users',
      icon: 'dashboard',
    },
    {
      id: 7,
      content: 'manage subscriptions',
      icon: 'dashboard',
    },
    {
      id: 8,
      content: 'manage payments',
      icon: 'dashboard',
    },
    {
      id: 9,
      content: 'craetre',
      icon: 'dashboard',
    },
    {
      id: 10,
      content: 'log out',
      icon: 'dashboard',
    },
  ];
  type: any;
  urlType: any;
  activeUser: any;
  constructor(
    private router: Router,
    private activated_router: ActivatedRoute,
    private lStorageService: LocalStorageService,
    private sessionStorage: sessionStorageService,
    private dialog: MatDialog,
    private snackbarSErvice: SnackbarService,
    private riskService: riskService
  ) {
    this.queryParamsFn();
  }
  ngOnInit(): void {
    this.activeUserFromLStorage();
  }
  activeUserFromLStorage() {
    this.activeUser =
      this.lStorageService.getItemFromLocalStorage('currentUser');
    console.log('activeUser in menu', this.activeUser);
  }
  queryParamsFn() {
    this.activated_router.queryParams.subscribe((qparams: any) => {
      console.log('qparams', qparams);
      if (qparams && qparams['type'] && qparams['type'] === 'dashboard') {
        this.type = qparams['type'];
      }
    });
    if (this.router.url.includes('organizationlist')) {
      this.urlType = 'organizationlist';
    } else if (this.router.url.includes('dashboard')) {
      this.urlType = 'dashboard';
    } else if (this.router.url.includes('regionmaster')) {
      this.urlType = 'regionmaster';
    } else if (this.router.url.includes('subscription')) {
      this.urlType = 'subscription';
    }
  }
  actionPerformed(data: any) {
    console.log('data', data);
    switch (data['content']) {
      case 'dashboard':
        this.router.navigate(['/dashboard']);
        break;
      case 'organizationlist':
        const navigationExtrasToOrganizationlist: NavigationExtras = {
          queryParams: {
            type: 'organizationlist',
          },
        };
        this.router.navigate(
          ['/organizationlist'],
          navigationExtrasToOrganizationlist
        );
        break;
      case 'regionmaster':
        const navigationExtrasToRegionMaster: NavigationExtras = {
          queryParams: {
            type: 'regionmaster',
          },
        };
        this.router.navigate(['/regionmaster'], navigationExtrasToRegionMaster);
        break;
      case 'manage subscriptions':
        const navigationExtrasToSubscription: NavigationExtras = {
          queryParams: {
            type: 'subscription',
          },
        };
        this.router.navigate(['/subscription'], navigationExtrasToSubscription);
        break;
      case 'log out':
        this.openDialog(this.activeUser);
        break;
      case 'manage organization users':
        const navigationExtrasTomanageOrganization: NavigationExtras = {
          queryParams: {
            type: 'organization-users',
          },
        };
        this.router.navigate(
          ['/organization-users'],
          navigationExtrasTomanageOrganization
        );
        break;

      default:
        break;
    }
  }
  openDialog(user: any) {
    console.log('user', user);
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
          if (afterRes && afterRes['status'] && afterRes['status'] === 200) {
            this.lStorageService.removeItemFromLocalStorage('currentUser');
            this.sessionStorage.removeItemFromSessionStorage('currentUser');
            const msg: string = 'Logged Out Successfully';
            this.snackbarSErvice.OpenSnackBar(msg, {
              panelClass: 'snackbarnormal',
            });
            this.router.navigate(['/login']);
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
