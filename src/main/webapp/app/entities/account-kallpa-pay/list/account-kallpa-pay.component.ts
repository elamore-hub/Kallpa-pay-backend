import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountKallpaPay } from '../account-kallpa-pay.model';
import { AccountKallpaPayService } from '../service/account-kallpa-pay.service';
import { AccountKallpaPayDeleteDialogComponent } from '../delete/account-kallpa-pay-delete-dialog.component';

@Component({
  selector: 'jhi-account-kallpa-pay',
  templateUrl: './account-kallpa-pay.component.html',
})
export class AccountKallpaPayComponent implements OnInit {
  accountKallpaPays?: IAccountKallpaPay[];
  isLoading = false;

  constructor(protected accountKallpaPayService: AccountKallpaPayService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.accountKallpaPayService.query().subscribe({
      next: (res: HttpResponse<IAccountKallpaPay[]>) => {
        this.isLoading = false;
        this.accountKallpaPays = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAccountKallpaPay): number {
    return item.id!;
  }

  delete(accountKallpaPay: IAccountKallpaPay): void {
    const modalRef = this.modalService.open(AccountKallpaPayDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.accountKallpaPay = accountKallpaPay;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
