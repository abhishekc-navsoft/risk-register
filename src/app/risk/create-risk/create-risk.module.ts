import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRiskComponent } from './create-risk.component';
const routes: Routes = [
  {
    path: '',
    component: CreateRiskComponent,
  },
];
@NgModule({
  imports: [CommonModule, [RouterModule.forChild(routes)]],
  exports: [CreateRiskComponent],
  declarations: [CreateRiskComponent],
})
export class createRiskMOdule {}
