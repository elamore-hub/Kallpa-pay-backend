import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAmount } from '../amount.model';
import { AmountService } from '../service/amount.service';

@Component({
  templateUrl: './amount-delete-dialog.component.html',
})
export class AmountDeleteDialogComponent {
  amount?: IAmount;

  constructor(protected amountService: AmountService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.amountService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
