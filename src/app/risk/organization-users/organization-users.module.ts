import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizeFirstPipeModule } from 'src/app/constants/pipes/capitalize.module';
import { LoadingSpinnerModule } from 'src/app/spinner/loading-spinner.module';
import {
  TranslateModule,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrganizationUserlistComponent } from './organization-users.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';

const routes: Routes = [
  {
    path: '',
    component: OrganizationUserlistComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
    MatIconModule,
    CapitalizeFirstPipeModule,
    LoadingSpinnerModule,
    MatFormFieldModule,
    TranslateModule,
    MatTableModule,
    MatDialogModule,
    MatMenuModule,
    MatSortModule,
    NgxPaginationModule,
    MatCheckboxModule,
    MatExpansionModule,
  ],
  exports: [OrganizationUserlistComponent],
  declarations: [OrganizationUserlistComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [TranslateService, TranslateStore],
})
export class organizationUserModule {}
