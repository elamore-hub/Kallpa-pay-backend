import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TransactionService } from '../service/transaction.service';
import { ITransaction, Transaction } from '../transaction.model';
import { IAmount } from 'app/entities/amount/amount.model';
import { AmountService } from 'app/entities/amount/service/amount.service';
import { IAccountKallpaPay } from 'app/entities/account-kallpa-pay/account-kallpa-pay.model';
import { AccountKallpaPayService } from 'app/entities/account-kallpa-pay/service/account-kallpa-pay.service';
import { IIBAN } from 'app/entities/iban/iban.model';
import { IBANService } from 'app/entities/iban/service/iban.service';
import { IPayment } from 'app/entities/payment/payment.model';
import { PaymentService } from 'app/entities/payment/service/payment.service';

import { TransactionUpdateComponent } from './transaction-update.component';

describe('Transaction Management Update Component', () => {
  let comp: TransactionUpdateComponent;
  let fixture: ComponentFixture<TransactionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let transactionService: TransactionService;
  let amountService: AmountService;
  let accountKallpaPayService: AccountKallpaPayService;
  let iBANService: IBANService;
  let paymentService: PaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TransactionUpdateComponent],
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
      .overrideTemplate(TransactionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TransactionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    transactionService = TestBed.inject(TransactionService);
    amountService = TestBed.inject(AmountService);
    accountKallpaPayService = TestBed.inject(AccountKallpaPayService);
    iBANService = TestBed.inject(IBANService);
    paymentService = TestBed.inject(PaymentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call amount query and add missing value', () => {
      const transaction: ITransaction = { id: 456 };
      const amount: IAmount = { id: 34283 };
      transaction.amount = amount;

      const amountCollection: IAmount[] = [{ id: 76939 }];
      jest.spyOn(amountService, 'query').mockReturnValue(of(new HttpResponse({ body: amountCollection })));
      const expectedCollection: IAmount[] = [amount, ...amountCollection];
      jest.spyOn(amountService, 'addAmountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      expect(amountService.query).toHaveBeenCalled();
      expect(amountService.addAmountToCollectionIfMissing).toHaveBeenCalledWith(amountCollection, amount);
      expect(comp.amountsCollection).toEqual(expectedCollection);
    });

    it('Should call AccountKallpaPay query and add missing value', () => {
      const transaction: ITransaction = { id: 456 };
      const accountKallpaPay: IAccountKallpaPay = { id: 92409 };
      transaction.accountKallpaPay = accountKallpaPay;

      const accountKallpaPayCollection: IAccountKallpaPay[] = [{ id: 51255 }];
      jest.spyOn(accountKallpaPayService, 'query').mockReturnValue(of(new HttpResponse({ body: accountKallpaPayCollection })));
      const additionalAccountKallpaPays = [accountKallpaPay];
      const expectedCollection: IAccountKallpaPay[] = [...additionalAccountKallpaPays, ...accountKallpaPayCollection];
      jest.spyOn(accountKallpaPayService, 'addAccountKallpaPayToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      expect(accountKallpaPayService.query).toHaveBeenCalled();
      expect(accountKallpaPayService.addAccountKallpaPayToCollectionIfMissing).toHaveBeenCalledWith(
        accountKallpaPayCollection,
        ...additionalAccountKallpaPays
      );
      expect(comp.accountKallpaPaysSharedCollection).toEqual(expectedCollection);
    });

    it('Should call IBAN query and add missing value', () => {
      const transaction: ITransaction = { id: 456 };
      const iBAN: IIBAN = { id: 92336 };
      transaction.iBAN = iBAN;

      const iBANCollection: IIBAN[] = [{ id: 22296 }];
      jest.spyOn(iBANService, 'query').mockReturnValue(of(new HttpResponse({ body: iBANCollection })));
      const additionalIBANS = [iBAN];
      const expectedCollection: IIBAN[] = [...additionalIBANS, ...iBANCollection];
      jest.spyOn(iBANService, 'addIBANToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      expect(iBANService.query).toHaveBeenCalled();
      expect(iBANService.addIBANToCollectionIfMissing).toHaveBeenCalledWith(iBANCollection, ...additionalIBANS);
      expect(comp.iBANSSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Payment query and add missing value', () => {
      const transaction: ITransaction = { id: 456 };
      const payment: IPayment = { id: 40348 };
      transaction.payment = payment;

      const paymentCollection: IPayment[] = [{ id: 35175 }];
      jest.spyOn(paymentService, 'query').mockReturnValue(of(new HttpResponse({ body: paymentCollection })));
      const additionalPayments = [payment];
      const expectedCollection: IPayment[] = [...additionalPayments, ...paymentCollection];
      jest.spyOn(paymentService, 'addPaymentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      expect(paymentService.query).toHaveBeenCalled();
      expect(paymentService.addPaymentToCollectionIfMissing).toHaveBeenCalledWith(paymentCollection, ...additionalPayments);
      expect(comp.paymentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const transaction: ITransaction = { id: 456 };
      const amount: IAmount = { id: 51104 };
      transaction.amount = amount;
      const accountKallpaPay: IAccountKallpaPay = { id: 24313 };
      transaction.accountKallpaPay = accountKallpaPay;
      const iBAN: IIBAN = { id: 70501 };
      transaction.iBAN = iBAN;
      const payment: IPayment = { id: 94837 };
      transaction.payment = payment;

      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(transaction));
      expect(comp.amountsCollection).toContain(amount);
      expect(comp.accountKallpaPaysSharedCollection).toContain(accountKallpaPay);
      expect(comp.iBANSSharedCollection).toContain(iBAN);
      expect(comp.paymentsSharedCollection).toContain(payment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Transaction>>();
      const transaction = { id: 123 };
      jest.spyOn(transactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transaction }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(transactionService.update).toHaveBeenCalledWith(transaction);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Transaction>>();
      const transaction = new Transaction();
      jest.spyOn(transactionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transaction }));
      saveSubject.complete();

      // THEN
      expect(transactionService.create).toHaveBeenCalledWith(transaction);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Transaction>>();
      const transaction = { id: 123 };
      jest.spyOn(transactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(transactionService.update).toHaveBeenCalledWith(transaction);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAmountById', () => {
      it('Should return tracked Amount primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAmountById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackAccountKallpaPayById', () => {
      it('Should return tracked AccountKallpaPay primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAccountKallpaPayById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackIBANById', () => {
      it('Should return tracked IBAN primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackIBANById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPaymentById', () => {
      it('Should return tracked Payment primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPaymentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
