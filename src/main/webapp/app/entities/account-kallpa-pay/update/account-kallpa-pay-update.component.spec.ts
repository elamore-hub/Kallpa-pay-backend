import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AccountKallpaPayService } from '../service/account-kallpa-pay.service';
import { IAccountKallpaPay, AccountKallpaPay } from '../account-kallpa-pay.model';
import { IAccountBalances } from 'app/entities/account-balances/account-balances.model';
import { AccountBalancesService } from 'app/entities/account-balances/service/account-balances.service';
import { IAccountHolder } from 'app/entities/account-holder/account-holder.model';
import { AccountHolderService } from 'app/entities/account-holder/service/account-holder.service';

import { AccountKallpaPayUpdateComponent } from './account-kallpa-pay-update.component';

describe('AccountKallpaPay Management Update Component', () => {
  let comp: AccountKallpaPayUpdateComponent;
  let fixture: ComponentFixture<AccountKallpaPayUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let accountKallpaPayService: AccountKallpaPayService;
  let accountBalancesService: AccountBalancesService;
  let accountHolderService: AccountHolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AccountKallpaPayUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AccountKallpaPayUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccountKallpaPayUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    accountKallpaPayService = TestBed.inject(AccountKallpaPayService);
    accountBalancesService = TestBed.inject(AccountBalancesService);
    accountHolderService = TestBed.inject(AccountHolderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call balances query and add missing value', () => {
      const accountKallpaPay: IAccountKallpaPay = { id: 456 };
      const balances: IAccountBalances = { id: 68926 };
      accountKallpaPay.balances = balances;

      const balancesCollection: IAccountBalances[] = [{ id: 23123 }];
      jest.spyOn(accountBalancesService, 'query').mockReturnValue(of(new HttpResponse({ body: balancesCollection })));
      const expectedCollection: IAccountBalances[] = [balances, ...balancesCollection];
      jest.spyOn(accountBalancesService, 'addAccountBalancesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accountKallpaPay });
      comp.ngOnInit();

      expect(accountBalancesService.query).toHaveBeenCalled();
      expect(accountBalancesService.addAccountBalancesToCollectionIfMissing).toHaveBeenCalledWith(balancesCollection, balances);
      expect(comp.balancesCollection).toEqual(expectedCollection);
    });

    it('Should call AccountHolder query and add missing value', () => {
      const accountKallpaPay: IAccountKallpaPay = { id: 456 };
      const accountHolder: IAccountHolder = { id: 26007 };
      accountKallpaPay.accountHolder = accountHolder;

      const accountHolderCollection: IAccountHolder[] = [{ id: 88696 }];
      jest.spyOn(accountHolderService, 'query').mockReturnValue(of(new HttpResponse({ body: accountHolderCollection })));
      const additionalAccountHolders = [accountHolder];
      const expectedCollection: IAccountHolder[] = [...additionalAccountHolders, ...accountHolderCollection];
      jest.spyOn(accountHolderService, 'addAccountHolderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accountKallpaPay });
      comp.ngOnInit();

      expect(accountHolderService.query).toHaveBeenCalled();
      expect(accountHolderService.addAccountHolderToCollectionIfMissing).toHaveBeenCalledWith(
        accountHolderCollection,
        ...additionalAccountHolders
      );
      expect(comp.accountHoldersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const accountKallpaPay: IAccountKallpaPay = { id: 456 };
      const balances: IAccountBalances = { id: 82119 };
      accountKallpaPay.balances = balances;
      const accountHolder: IAccountHolder = { id: 36432 };
      accountKallpaPay.accountHolder = accountHolder;

      activatedRoute.data = of({ accountKallpaPay });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(accountKallpaPay));
      expect(comp.balancesCollection).toContain(balances);
      expect(comp.accountHoldersSharedCollection).toContain(accountHolder);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountKallpaPay>>();
      const accountKallpaPay = { id: 123 };
      jest.spyOn(accountKallpaPayService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountKallpaPay });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountKallpaPay }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(accountKallpaPayService.update).toHaveBeenCalledWith(accountKallpaPay);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountKallpaPay>>();
      const accountKallpaPay = new AccountKallpaPay();
      jest.spyOn(accountKallpaPayService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountKallpaPay });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountKallpaPay }));
      saveSubject.complete();

      // THEN
      expect(accountKallpaPayService.create).toHaveBeenCalledWith(accountKallpaPay);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountKallpaPay>>();
      const accountKallpaPay = { id: 123 };
      jest.spyOn(accountKallpaPayService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountKallpaPay });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(accountKallpaPayService.update).toHaveBeenCalledWith(accountKallpaPay);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAccountBalancesById', () => {
      it('Should return tracked AccountBalances primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAccountBalancesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackAccountHolderById', () => {
      it('Should return tracked AccountHolder primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAccountHolderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
