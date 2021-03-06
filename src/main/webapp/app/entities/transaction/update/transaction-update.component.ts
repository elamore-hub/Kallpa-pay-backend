import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITransaction, Transaction } from '../transaction.model';
import { TransactionService } from '../service/transaction.service';
import { IAmount } from 'app/entities/amount/amount.model';
import { AmountService } from 'app/entities/amount/service/amount.service';
import { IAccountKallpaPay } from 'app/entities/account-kallpa-pay/account-kallpa-pay.model';
import { AccountKallpaPayService } from 'app/entities/account-kallpa-pay/service/account-kallpa-pay.service';
import { IIBAN } from 'app/entities/iban/iban.model';
import { IBANService } from 'app/entities/iban/service/iban.service';
import { IPayment } from 'app/entities/payment/payment.model';
import { PaymentService } from 'app/entities/payment/service/payment.service';

@Component({
  selector: 'jhi-transaction-update',
  templateUrl: './transaction-update.component.html',
})
export class TransactionUpdateComponent implements OnInit {
  isSaving = false;

  amountsCollection: IAmount[] = [];
  accountKallpaPaysSharedCollection: IAccountKallpaPay[] = [];
  iBANSSharedCollection: IIBAN[] = [];
  paymentsSharedCollection: IPayment[] = [];

  editForm = this.fb.group({
    id: [],
    externalId: [],
    reference: [],
    paymentMethodIdentifier: [],
    side: [],
    type: [],
    label: [],
    status: [],
    paymentId: [],
    counterparty: [],
    paymentProduct: [],
    externalReference: [],
    amount: [],
    accountKallpaPay: [],
    iBAN: [],
    payment: [],
  });

  constructor(
    protected transactionService: TransactionService,
    protected amountService: AmountService,
    protected accountKallpaPayService: AccountKallpaPayService,
    protected iBANService: IBANService,
    protected paymentService: PaymentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transaction }) => {
      this.updateForm(transaction);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const transaction = this.createFromForm();
    if (transaction.id !== undefined) {
      this.subscribeToSaveResponse(this.transactionService.update(transaction));
    } else {
      this.subscribeToSaveResponse(this.transactionService.create(transaction));
    }
  }

  trackAmountById(_index: number, item: IAmount): number {
    return item.id!;
  }

  trackAccountKallpaPayById(_index: number, item: IAccountKallpaPay): number {
    return item.id!;
  }

  trackIBANById(_index: number, item: IIBAN): number {
    return item.id!;
  }

  trackPaymentById(_index: number, item: IPayment): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransaction>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(transaction: ITransaction): void {
    this.editForm.patchValue({
      id: transaction.id,
      externalId: transaction.externalId,
      reference: transaction.reference,
      paymentMethodIdentifier: transaction.paymentMethodIdentifier,
      side: transaction.side,
      type: transaction.type,
      label: transaction.label,
      status: transaction.status,
      paymentId: transaction.paymentId,
      counterparty: transaction.counterparty,
      paymentProduct: transaction.paymentProduct,
      externalReference: transaction.externalReference,
      amount: transaction.amount,
      accountKallpaPay: transaction.accountKallpaPay,
      iBAN: transaction.iBAN,
      payment: transaction.payment,
    });

    this.amountsCollection = this.amountService.addAmountToCollectionIfMissing(this.amountsCollection, transaction.amount);
    this.accountKallpaPaysSharedCollection = this.accountKallpaPayService.addAccountKallpaPayToCollectionIfMissing(
      this.accountKallpaPaysSharedCollection,
      transaction.accountKallpaPay
    );
    this.iBANSSharedCollection = this.iBANService.addIBANToCollectionIfMissing(this.iBANSSharedCollection, transaction.iBAN);
    this.paymentsSharedCollection = this.paymentService.addPaymentToCollectionIfMissing(this.paymentsSharedCollection, transaction.payment);
  }

  protected loadRelationshipsOptions(): void {
    this.amountService
      .query({ filter: 'transaction-is-null' })
      .pipe(map((res: HttpResponse<IAmount[]>) => res.body ?? []))
      .pipe(map((amounts: IAmount[]) => this.amountService.addAmountToCollectionIfMissing(amounts, this.editForm.get('amount')!.value)))
      .subscribe((amounts: IAmount[]) => (this.amountsCollection = amounts));

    this.accountKallpaPayService
      .query()
      .pipe(map((res: HttpResponse<IAccountKallpaPay[]>) => res.body ?? []))
      .pipe(
        map((accountKallpaPays: IAccountKallpaPay[]) =>
          this.accountKallpaPayService.addAccountKallpaPayToCollectionIfMissing(
            accountKallpaPays,
            this.editForm.get('accountKallpaPay')!.value
          )
        )
      )
      .subscribe((accountKallpaPays: IAccountKallpaPay[]) => (this.accountKallpaPaysSharedCollection = accountKallpaPays));

    this.iBANService
      .query()
      .pipe(map((res: HttpResponse<IIBAN[]>) => res.body ?? []))
      .pipe(map((iBANS: IIBAN[]) => this.iBANService.addIBANToCollectionIfMissing(iBANS, this.editForm.get('iBAN')!.value)))
      .subscribe((iBANS: IIBAN[]) => (this.iBANSSharedCollection = iBANS));

    this.paymentService
      .query()
      .pipe(map((res: HttpResponse<IPayment[]>) => res.body ?? []))
      .pipe(
        map((payments: IPayment[]) => this.paymentService.addPaymentToCollectionIfMissing(payments, this.editForm.get('payment')!.value))
      )
      .subscribe((payments: IPayment[]) => (this.paymentsSharedCollection = payments));
  }

  protected createFromForm(): ITransaction {
    return {
      ...new Transaction(),
      id: this.editForm.get(['id'])!.value,
      externalId: this.editForm.get(['externalId'])!.value,
      reference: this.editForm.get(['reference'])!.value,
      paymentMethodIdentifier: this.editForm.get(['paymentMethodIdentifier'])!.value,
      side: this.editForm.get(['side'])!.value,
      type: this.editForm.get(['type'])!.value,
      label: this.editForm.get(['label'])!.value,
      status: this.editForm.get(['status'])!.value,
      paymentId: this.editForm.get(['paymentId'])!.value,
      counterparty: this.editForm.get(['counterparty'])!.value,
      paymentProduct: this.editForm.get(['paymentProduct'])!.value,
      externalReference: this.editForm.get(['externalReference'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      accountKallpaPay: this.editForm.get(['accountKallpaPay'])!.value,
      iBAN: this.editForm.get(['iBAN'])!.value,
      payment: this.editForm.get(['payment'])!.value,
    };
  }
}
