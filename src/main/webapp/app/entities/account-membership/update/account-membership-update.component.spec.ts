import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AccountMembershipService } from '../service/account-membership.service';
import { IAccountMembership, AccountMembership } from '../account-membership.model';
import { IAccountKallpaPay } from 'app/entities/account-kallpa-pay/account-kallpa-pay.model';
import { AccountKallpaPayService } from 'app/entities/account-kallpa-pay/service/account-kallpa-pay.service';

import { AccountMembershipUpdateComponent } from './account-membership-update.component';

describe('AccountMembership Management Update Component', () => {
  let comp: AccountMembershipUpdateComponent;
  let fixture: ComponentFixture<AccountMembershipUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let accountMembershipService: AccountMembershipService;
  let accountKallpaPayService: AccountKallpaPayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AccountMembershipUpdateComponent],
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
      .overrideTemplate(AccountMembershipUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccountMembershipUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    accountMembershipService = TestBed.inject(AccountMembershipService);
    accountKallpaPayService = TestBed.inject(AccountKallpaPayService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AccountKallpaPay query and add missing value', () => {
      const accountMembership: IAccountMembership = { id: 456 };
      const accountKallpaPay: IAccountKallpaPay = { id: 64691 };
      accountMembership.accountKallpaPay = accountKallpaPay;

      const accountKallpaPayCollection: IAccountKallpaPay[] = [{ id: 2768 }];
      jest.spyOn(accountKallpaPayService, 'query').mockReturnValue(of(new HttpResponse({ body: accountKallpaPayCollection })));
      const additionalAccountKallpaPays = [accountKallpaPay];
      const expectedCollection: IAccountKallpaPay[] = [...additionalAccountKallpaPays, ...accountKallpaPayCollection];
      jest.spyOn(accountKallpaPayService, 'addAccountKallpaPayToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accountMembership });
      comp.ngOnInit();

      expect(accountKallpaPayService.query).toHaveBeenCalled();
      expect(accountKallpaPayService.addAccountKallpaPayToCollectionIfMissing).toHaveBeenCalledWith(
        accountKallpaPayCollection,
        ...additionalAccountKallpaPays
      );
      expect(comp.accountKallpaPaysSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const accountMembership: IAccountMembership = { id: 456 };
      const accountKallpaPay: IAccountKallpaPay = { id: 32880 };
      accountMembership.accountKallpaPay = accountKallpaPay;

      activatedRoute.data = of({ accountMembership });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(accountMembership));
      expect(comp.accountKallpaPaysSharedCollection).toContain(accountKallpaPay);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountMembership>>();
      const accountMembership = { id: 123 };
      jest.spyOn(accountMembershipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountMembership });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountMembership }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(accountMembershipService.update).toHaveBeenCalledWith(accountMembership);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountMembership>>();
      const accountMembership = new AccountMembership();
      jest.spyOn(accountMembershipService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountMembership });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountMembership }));
      saveSubject.complete();

      // THEN
      expect(accountMembershipService.create).toHaveBeenCalledWith(accountMembership);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AccountMembership>>();
      const accountMembership = { id: 123 };
      jest.spyOn(accountMembershipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountMembership });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(accountMembershipService.update).toHaveBeenCalledWith(accountMembership);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAccountKallpaPayById', () => {
      it('Should return tracked AccountKallpaPay primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAccountKallpaPayById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
