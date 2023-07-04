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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  TranslateModule,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SubscriptionComponent } from './subscription.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { searchTransformModule } from 'src/app/constants/pipes/searchpipe.module';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionComponent,
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
  ],
  exports: [SubscriptionComponent],
  declarations: [SubscriptionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [TranslateService, TranslateStore],
})
export class subscriptionModule {}
