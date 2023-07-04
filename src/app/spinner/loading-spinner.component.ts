import { Component, OnInit, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import {
  MatProgressSpinnerModule,
  ProgressSpinnerMode,
} from '@angular/material/progress-spinner';
@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class loadingSpinnerComponent implements OnInit {
  @Input() spinnerParams: any = [];
  diameter: any;
  stroke: any;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  loading: boolean = true;
  constructor() {}
  ngOnInit(): void {
    this.spinnerInit();
  }
  spinnerInit() {
    this.diameter = this.spinnerParams['diameter']
      ? this.spinnerParams['diameter']
      : 40;
    this.stroke = this.spinnerParams['stroke']
      ? this.spinnerParams['stroke']
      : 5;
  }
}
