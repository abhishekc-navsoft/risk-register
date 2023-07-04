import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { capitalizeFirstPipe } from './capitalize.pipe';

@NgModule({
  declarations: [capitalizeFirstPipe],
  imports: [CommonModule],
  exports: [capitalizeFirstPipe],
})
export class CapitalizeFirstPipeModule {}
