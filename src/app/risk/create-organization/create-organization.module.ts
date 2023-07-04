import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  TranslateModule,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizeFirstPipeModule } from 'src/app/constants/pipes/capitalize.module';
import { LoadingSpinnerModule } from 'src/app/spinner/loading-spinner.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CreateOrganizationComponent } from './create-organization.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

const routes: Routes = [
  {
    path: '',
    component: CreateOrganizationComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
    TranslateModule,
    MatIconModule,
    CapitalizeFirstPipeModule,
    LoadingSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    TranslateModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatTreeModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  exports: [CreateOrganizationComponent],
  declarations: [CreateOrganizationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [TranslateService, TranslateStore],
})
export class createOrganizationMOdule {}
