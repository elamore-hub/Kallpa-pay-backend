import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAccountKallpaPay, AccountKallpaPay } from '../account-kallpa-pay.model';
import { AccountKallpaPayService } from '../service/account-kallpa-pay.service';
import { IAccountBalances } from 'app/entities/account-balances/account-balances.model';
import { AccountBalancesService } from 'app/entities/account-balances/service/account-balances.service';
import { IAccountHolder } from 'app/entities/account-holder/account-holder.model';
import { AccountHolderService } from 'app/entities/account-holder/service/account-holder.service';

@Component({
  selector: 'jhi-account-kallpa-pay-update',
  templateUrl: './account-kallpa-pay-update.component.html',
})
export class AccountKallpaPayUpdateComponent implements OnInit {
  isSaving = false;

  balancesCollection: IAccountBalances[] = [];
  accountHoldersSharedCollection: IAccountHolder[] = [];

  editForm = this.fb.group({
    id: [],
    externalId: [],
    number: [],
    name: [],
    currency: [],
    status: [],
    language: [],
    balances: [],
    accountHolder: [],
  });

  constructor(
    protected accountKallpaPayService: AccountKallpaPayService,
    protected accountBalancesService: AccountBalancesService,
    protected accountHolderService: AccountHolderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountKallpaPay }) => {
      this.updateForm(accountKallpaPay);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accountKallpaPay = this.createFromForm();
    if (accountKallpaPay.id !== undefined) {
      this.subscribeToSaveResponse(this.accountKallpaPayService.update(accountKallpaPay));
    } else {
      this.subscribeToSaveResponse(this.accountKallpaPayService.create(accountKallpaPay));
    }
  }

  trackAccountBalancesById(_index: number, item: IAccountBalances): number {
    return item.id!;
  }

  trackAccountHolderById(_index: number, item: IAccountHolder): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccountKallpaPay>>): void {
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

  protected updateForm(accountKallpaPay: IAccountKallpaPay): void {
    this.editForm.patchValue({
      id: accountKallpaPay.id,
      externalId: accountKallpaPay.externalId,
      number: accountKallpaPay.number,
      name: accountKallpaPay.name,
      currency: accountKallpaPay.currency,
      status: accountKallpaPay.status,
      language: accountKallpaPay.language,
      balances: accountKallpaPay.balances,
      accountHolder: accountKallpaPay.accountHolder,
    });

    this.balancesCollection = this.accountBalancesService.addAccountBalancesToCollectionIfMissing(
      this.balancesCollection,
      accountKallpaPay.balances
    );
    this.accountHoldersSharedCollection = this.accountHolderService.addAccountHolderToCollectionIfMissing(
      this.accountHoldersSharedCollection,
      accountKallpaPay.accountHolder
    );
  }

  protected loadRelationshipsOptions(): void {
    this.accountBalancesService
      .query({ filter: 'accountkallpapay-is-null' })
      .pipe(map((res: HttpResponse<IAccountBalances[]>) => res.body ?? []))
      .pipe(
        map((accountBalances: IAccountBalances[]) =>
          this.accountBalancesService.addAccountBalancesToCollectionIfMissing(accountBalances, this.editForm.get('balances')!.value)
        )
      )
      .subscribe((accountBalances: IAccountBalances[]) => (this.balancesCollection = accountBalances));

    this.accountHolderService
      .query()
      .pipe(map((res: HttpResponse<IAccountHolder[]>) => res.body ?? []))
      .pipe(
        map((accountHolders: IAccountHolder[]) =>
          this.accountHolderService.addAccountHolderToCollectionIfMissing(accountHolders, this.editForm.get('accountHolder')!.value)
        )
      )
      .subscribe((accountHolders: IAccountHolder[]) => (this.accountHoldersSharedCollection = accountHolders));
  }

  protected createFromForm(): IAccountKallpaPay {
    return {
      ...new AccountKallpaPay(),
      id: this.editForm.get(['id'])!.value,
      externalId: this.editForm.get(['externalId'])!.value,
      number: this.editForm.get(['number'])!.value,
      name: this.editForm.get(['name'])!.value,
      currency: this.editForm.get(['currency'])!.value,
      status: this.editForm.get(['status'])!.value,
      language: this.editForm.get(['language'])!.value,
      balances: this.editForm.get(['balances'])!.value,
      accountHolder: this.editForm.get(['accountHolder'])!.value,
    };
  }
}
