import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { riskService } from '../risk.service';
import { SnackbarService } from 'src/app/snackbar/snackbar.service';
import { LocalStorageService } from 'src/app/constants/storage/local-storage.service';
import { sharedService } from 'src/app/constants/shared_services/shared-services';
import { projectConstantLocal } from 'src/app/constants/project_constant/project-constantLocal';
import { MatDialog } from '@angular/material/dialog';
import { confirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-organization-users',
  templateUrl: './organization-users.component.html',
  styleUrls: ['./organization-users.component.scss'],
})
export class OrganizationUserlistComponent implements OnInit {
  constructor(
    private riskService: riskService,
    private snackbarService: SnackbarService,
    private router: Router,
    private activated_router: ActivatedRoute,
    private lStorageService: LocalStorageService,
    private sharedService: sharedService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {}
}
