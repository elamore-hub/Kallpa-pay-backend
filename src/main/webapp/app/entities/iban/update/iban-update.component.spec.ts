import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IBANService } from '../service/iban.service';
import { IIBAN, IBAN } from '../iban.model';
import { IAccountKallpaPay } from 'app/entities/account-kallpa-pay/account-kallpa-pay.model';
import { AccountKallpaPayService } from 'app/entities/account-kallpa-pay/service/account-kallpa-pay.service';

import { IBANUpdateComponent } from './iban-update.component';

describe('IBAN Management Update Component', () => {
  let comp: IBANUpdateComponent;
  let fixture: ComponentFixture<IBANUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let iBANService: IBANService;
  let accountKallpaPayService: AccountKallpaPayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [IBANUpdateComponent],
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
      .overrideTemplate(IBANUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IBANUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    iBANService = TestBed.inject(IBANService);
    accountKallpaPayService = TestBed.inject(AccountKallpaPayService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AccountKallpaPay query and add missing value', () => {
      const iBAN: IIBAN = { id: 456 };
      const accountKallpaPay: IAccountKallpaPay = { id: 14720 };
      iBAN.accountKallpaPay = accountKallpaPay;

      const accountKallpaPayCollection: IAccountKallpaPay[] = [{ id: 84406 }];
      jest.spyOn(accountKallpaPayService, 'query').mockReturnValue(of(new HttpResponse({ body: accountKallpaPayCollection })));
      const additionalAccountKallpaPays = [accountKallpaPay];
      const expectedCollection: IAccountKallpaPay[] = [...additionalAccountKallpaPays, ...accountKallpaPayCollection];
      jest.spyOn(accountKallpaPayService, 'addAccountKallpaPayToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ iBAN });
      comp.ngOnInit();

      expect(accountKallpaPayService.query).toHaveBeenCalled();
      expect(accountKallpaPayService.addAccountKallpaPayToCollectionIfMissing).toHaveBeenCalledWith(
        accountKallpaPayCollection,
        ...additionalAccountKallpaPays
      );
      expect(comp.accountKallpaPaysSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const iBAN: IIBAN = { id: 456 };
      const accountKallpaPay: IAccountKallpaPay = { id: 73832 };
      iBAN.accountKallpaPay = accountKallpaPay;

      activatedRoute.data = of({ iBAN });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(iBAN));
      expect(comp.accountKallpaPaysSharedCollection).toContain(accountKallpaPay);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBAN>>();
      const iBAN = { id: 123 };
      jest.spyOn(iBANService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ iBAN });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: iBAN }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(iBANService.update).toHaveBeenCalledWith(iBAN);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBAN>>();
      const iBAN = new IBAN();
      jest.spyOn(iBANService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ iBAN });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: iBAN }));
      saveSubject.complete();

      // THEN
      expect(iBANService.create).toHaveBeenCalledWith(iBAN);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBAN>>();
      const iBAN = { id: 123 };
      jest.spyOn(iBANService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ iBAN });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(iBANService.update).toHaveBeenCalledWith(iBAN);
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
