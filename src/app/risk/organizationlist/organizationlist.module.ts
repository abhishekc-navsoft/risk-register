import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizeFirstPipeModule } from 'src/app/constants/pipes/capitalize.module';
import { OrganizationlistComponent } from './organizationlist.component';
import { LoadingSpinnerModule } from 'src/app/spinner/loading-spinner.module';
import {
  TranslateModule,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { searchTransformModule } from 'src/app/constants/pipes/searchpipe.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: '',
    component: OrganizationlistComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
    MatIconModule,
    CapitalizeFirstPipeModule,
    LoadingSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    TranslateModule,
    MatAutocompleteModule,
    NgxIntlTelInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDialogModule,
    searchTransformModule,
    MatMenuModule,
    MatSortModule,
    NgxPaginationModule,
  ],
  exports: [OrganizationlistComponent],
  declarations: [OrganizationlistComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [TranslateService, TranslateStore],
})
export class organizationlistModule {}
