import { Component, OnInit } from '@angular/core';
import { riskService } from './risk.service';
import { LocalStorageService } from '../constants/storage/local-storage.service';
@Component({
  selector: 'app-risk',
  templateUrl: './risk.component.html',
  styleUrls: ['./risk.component.scss'],
})
export class RiskComponent implements OnInit {
  id: any;
  constructor(
    private riskService: riskService,
    private lStorageService: LocalStorageService
  ) {}

  showFiller: boolean = false;
  ngOnInit(): void {
    this.pageReload();
  }
  pageReload() {
    let pageReloaded = window.performance
      .getEntriesByType('navigation')
      .map((nav) => (nav as any).type)
      .includes('reload');
    console.log('pageReloaded', pageReloaded);
  }
}
