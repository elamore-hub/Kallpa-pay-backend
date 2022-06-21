import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAccountMembership, AccountMembership } from '../account-membership.model';
import { AccountMembershipService } from '../service/account-membership.service';
import { IAccountKallpaPay } from 'app/entities/account-kallpa-pay/account-kallpa-pay.model';
import { AccountKallpaPayService } from 'app/entities/account-kallpa-pay/service/account-kallpa-pay.service';

@Component({
  selector: 'jhi-account-membership-update',
  templateUrl: './account-membership-update.component.html',
})
export class AccountMembershipUpdateComponent implements OnInit {
  isSaving = false;

  accountKallpaPaysSharedCollection: IAccountKallpaPay[] = [];

  editForm = this.fb.group({
    id: [],
    externalId: [],
    email: [],
    status: [],
    accountKallpaPay: [],
  });

  constructor(
    protected accountMembershipService: AccountMembershipService,
    protected accountKallpaPayService: AccountKallpaPayService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountMembership }) => {
      this.updateForm(accountMembership);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accountMembership = this.createFromForm();
    if (accountMembership.id !== undefined) {
      this.subscribeToSaveResponse(this.accountMembershipService.update(accountMembership));
    } else {
      this.subscribeToSaveResponse(this.accountMembershipService.create(accountMembership));
    }
  }

  trackAccountKallpaPayById(_index: number, item: IAccountKallpaPay): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccountMembership>>): void {
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

  protected updateForm(accountMembership: IAccountMembership): void {
    this.editForm.patchValue({
      id: accountMembership.id,
      externalId: accountMembership.externalId,
      email: accountMembership.email,
      status: accountMembership.status,
      accountKallpaPay: accountMembership.accountKallpaPay,
    });

    this.accountKallpaPaysSharedCollection = this.accountKallpaPayService.addAccountKallpaPayToCollectionIfMissing(
      this.accountKallpaPaysSharedCollection,
      accountMembership.accountKallpaPay
    );
  }

  protected loadRelationshipsOptions(): void {
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
  }

  protected createFromForm(): IAccountMembership {
    return {
      ...new AccountMembership(),
      id: this.editForm.get(['id'])!.value,
      externalId: this.editForm.get(['externalId'])!.value,
      email: this.editForm.get(['email'])!.value,
      status: this.editForm.get(['status'])!.value,
      accountKallpaPay: this.editForm.get(['accountKallpaPay'])!.value,
    };
  }
}
