import { CommonModule, JsonPipe } from '@angular/common';
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
import { confirmDialogComponent } from './confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';

const routes: Routes = [
  {
    path: '',
    component: confirmDialogComponent,
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
    TranslateModule,
    MatDialogModule,
    MatRadioModule,
  ],
  exports: [confirmDialogComponent],
  declarations: [confirmDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [TranslateService, TranslateStore, JsonPipe],
  entryComponents: [confirmDialogComponent],
})
export class confirmDialogModule {}
