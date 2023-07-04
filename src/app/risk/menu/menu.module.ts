import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizeFirstPipeModule } from 'src/app/constants/pipes/capitalize.module';
import { MatDialogModule } from '@angular/material/dialog';
const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
    MatSidenavModule,
    MatIconModule,
    CapitalizeFirstPipeModule,
    MatDialogModule,
  ],
  exports: [MenuComponent],
  declarations: [MenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class MenuModule {}
