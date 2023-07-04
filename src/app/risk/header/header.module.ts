import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './header.component';
import {
  TranslateModule,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CapitalizeFirstPipeModule } from 'src/app/constants/pipes/capitalize.module';
import { MatBadgeModule } from '@angular/material/badge';
import { MenuModule } from '../menu/menu.module';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)],
    MatToolbarModule,
    MatIconModule,
    TranslateModule,
    TranslateModule.forRoot(),
    MatTooltipModule,
    CapitalizeFirstPipeModule,
    MatBadgeModule,
  ],
  exports: [HeaderComponent],
  declarations: [HeaderComponent],
  providers: [TranslateService, TranslateStore],
})
export class HeaderModule {}
