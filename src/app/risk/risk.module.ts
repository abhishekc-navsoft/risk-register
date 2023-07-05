import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoadingSpinnerModule } from '../spinner/loading-spinner.module';
import { RiskComponent } from './risk.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { riskService } from './risk.service';
import { HeaderModule } from './header/header.module';
import { MenuModule } from './menu/menu.module';
import { createRiskMOdule } from './create-risk/create-risk.module';
import {
  MAT_DIALOG_SCROLL_STRATEGY,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: RiskComponent,
    children: [
      {
        path: '',
        children: [
          {
            path: 'create-risk',
            loadChildren: () =>
              import('./create-risk/create-risk.module').then(
                (m) => m.createRiskMOdule
              ),
          },
          {
            path: 'dashboard',
            loadChildren: () =>
              import('./dashboard/dashboard.module').then(
                (m) => m.DashboardModule
              ),
          },
          {
            path: 'organizationlist',
            loadChildren: () =>
              import('./organizationlist/organizationlist.module').then(
                (m) => m.organizationlistModule
              ),
          },
          {
            path: 'regionmaster',
            loadChildren: () =>
              import('./region-master/regionmaster.module').then(
                (m) => m.regionMasterModule
              ),
          },
          {
            path: 'subscription',
            loadChildren: () =>
              import('./subscription/subscription.module').then(
                (m) => m.subscriptionModule
              ),
          },
          {
            path: 'create-subscription',
            loadChildren: () =>
              import('./create-subscription/create-subscription.module').then(
                (m) => m.createSubscriptionModule
              ),
          },
          {
            path: 'create-organization',
            loadChildren: () =>
              import('./create-organization/create-organization.module').then(
                (m) => m.createOrganizationMOdule
              ),
          },
          {
            path: 'confirm-dialog',
            loadChildren: () =>
              import('./confirm-dialog/confirm-dialog.module').then(
                (m) => m.confirmDialogModule
              ),
          },
          {
            path: 'create-individual',
            loadChildren: () =>
              import('./create-individual/create-individual.module').then(
                (m) => m.createIndividualModule
              ),
          },
          {
            path: 'organization-users',
            loadChildren: () =>
              import('./organization-users/organization-users.module').then(
                (m) => m.organizationUserModule
              ),
          },
          {
            path: 'riskCategory',
            loadChildren: () =>
              import('./riskCategory/riskCategory.module').then(
                (m) => m.riskCategoryModule
              ),
          },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [RiskComponent],
  imports: [
    CommonModule,
    LoadingSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    HeaderModule,
    MenuModule,
    [RouterModule.forChild(routes)],
    createRiskMOdule,
    MatDialogModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  exports: [RiskComponent],
  providers: [riskService, MatDialog],
})
export class riskModule {}
