import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountKallpaPay } from '../account-kallpa-pay.model';
import { AccountKallpaPayService } from '../service/account-kallpa-pay.service';

@Component({
  templateUrl: './account-kallpa-pay-delete-dialog.component.html',
})
export class AccountKallpaPayDeleteDialogComponent {
  accountKallpaPay?: IAccountKallpaPay;

  constructor(protected accountKallpaPayService: AccountKallpaPayService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.accountKallpaPayService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
