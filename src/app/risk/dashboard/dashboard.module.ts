import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];
@NgModule({
  imports: [CommonModule, [RouterModule.forChild(routes)]],
  exports: [DashboardComponent],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
