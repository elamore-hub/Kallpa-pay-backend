import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAccountKallpaPay } from '../account-kallpa-pay.model';

@Component({
  selector: 'jhi-account-kallpa-pay-detail',
  templateUrl: './account-kallpa-pay-detail.component.html',
})
export class AccountKallpaPayDetailComponent implements OnInit {
  accountKallpaPay: IAccountKallpaPay | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountKallpaPay }) => {
      this.accountKallpaPay = accountKallpaPay;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
