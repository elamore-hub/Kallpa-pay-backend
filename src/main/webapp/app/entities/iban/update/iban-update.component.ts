import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IIBAN, IBAN } from '../iban.model';
import { IBANService } from '../service/iban.service';
import { IAccountKallpaPay } from 'app/entities/account-kallpa-pay/account-kallpa-pay.model';
import { AccountKallpaPayService } from 'app/entities/account-kallpa-pay/service/account-kallpa-pay.service';

@Component({
  selector: 'jhi-iban-update',
  templateUrl: './iban-update.component.html',
})
export class IBANUpdateComponent implements OnInit {
  isSaving = false;

  accountKallpaPaysSharedCollection: IAccountKallpaPay[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    iban: [],
    bic: [],
    accountOwner: [],
    accountKallpaPay: [],
  });

  constructor(
    protected iBANService: IBANService,
    protected accountKallpaPayService: AccountKallpaPayService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ iBAN }) => {
      this.updateForm(iBAN);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const iBAN = this.createFromForm();
    if (iBAN.id !== undefined) {
      this.subscribeToSaveResponse(this.iBANService.update(iBAN));
    } else {
      this.subscribeToSaveResponse(this.iBANService.create(iBAN));
    }
  }

  trackAccountKallpaPayById(_index: number, item: IAccountKallpaPay): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIBAN>>): void {
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

  protected updateForm(iBAN: IIBAN): void {
    this.editForm.patchValue({
      id: iBAN.id,
      name: iBAN.name,
      iban: iBAN.iban,
      bic: iBAN.bic,
      accountOwner: iBAN.accountOwner,
      accountKallpaPay: iBAN.accountKallpaPay,
    });

    this.accountKallpaPaysSharedCollection = this.accountKallpaPayService.addAccountKallpaPayToCollectionIfMissing(
      this.accountKallpaPaysSharedCollection,
      iBAN.accountKallpaPay
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

  protected createFromForm(): IIBAN {
    return {
      ...new IBAN(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      iban: this.editForm.get(['iban'])!.value,
      bic: this.editForm.get(['bic'])!.value,
      accountOwner: this.editForm.get(['accountOwner'])!.value,
      accountKallpaPay: this.editForm.get(['accountKallpaPay'])!.value,
    };
  }
}
