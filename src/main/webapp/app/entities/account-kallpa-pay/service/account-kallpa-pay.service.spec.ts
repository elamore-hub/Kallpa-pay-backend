import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAccountKallpaPay, AccountKallpaPay } from '../account-kallpa-pay.model';

import { AccountKallpaPayService } from './account-kallpa-pay.service';

describe('AccountKallpaPay Service', () => {
  let service: AccountKallpaPayService;
  let httpMock: HttpTestingController;
  let elemDefault: IAccountKallpaPay;
  let expectedResult: IAccountKallpaPay | IAccountKallpaPay[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AccountKallpaPayService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      externalId: 'AAAAAAA',
      number: 'AAAAAAA',
      name: 'AAAAAAA',
      currency: 'AAAAAAA',
      status: 'AAAAAAA',
      language: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a AccountKallpaPay', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AccountKallpaPay()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AccountKallpaPay', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          externalId: 'BBBBBB',
          number: 'BBBBBB',
          name: 'BBBBBB',
          currency: 'BBBBBB',
          status: 'BBBBBB',
          language: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AccountKallpaPay', () => {
      const patchObject = Object.assign(
        {
          externalId: 'BBBBBB',
          name: 'BBBBBB',
          status: 'BBBBBB',
          language: 'BBBBBB',
        },
        new AccountKallpaPay()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AccountKallpaPay', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          externalId: 'BBBBBB',
          number: 'BBBBBB',
          name: 'BBBBBB',
          currency: 'BBBBBB',
          status: 'BBBBBB',
          language: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a AccountKallpaPay', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAccountKallpaPayToCollectionIfMissing', () => {
      it('should add a AccountKallpaPay to an empty array', () => {
        const accountKallpaPay: IAccountKallpaPay = { id: 123 };
        expectedResult = service.addAccountKallpaPayToCollectionIfMissing([], accountKallpaPay);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accountKallpaPay);
      });

      it('should not add a AccountKallpaPay to an array that contains it', () => {
        const accountKallpaPay: IAccountKallpaPay = { id: 123 };
        const accountKallpaPayCollection: IAccountKallpaPay[] = [
          {
            ...accountKallpaPay,
          },
          { id: 456 },
        ];
        expectedResult = service.addAccountKallpaPayToCollectionIfMissing(accountKallpaPayCollection, accountKallpaPay);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AccountKallpaPay to an array that doesn't contain it", () => {
        const accountKallpaPay: IAccountKallpaPay = { id: 123 };
        const accountKallpaPayCollection: IAccountKallpaPay[] = [{ id: 456 }];
        expectedResult = service.addAccountKallpaPayToCollectionIfMissing(accountKallpaPayCollection, accountKallpaPay);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accountKallpaPay);
      });

      it('should add only unique AccountKallpaPay to an array', () => {
        const accountKallpaPayArray: IAccountKallpaPay[] = [{ id: 123 }, { id: 456 }, { id: 3142 }];
        const accountKallpaPayCollection: IAccountKallpaPay[] = [{ id: 123 }];
        expectedResult = service.addAccountKallpaPayToCollectionIfMissing(accountKallpaPayCollection, ...accountKallpaPayArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const accountKallpaPay: IAccountKallpaPay = { id: 123 };
        const accountKallpaPay2: IAccountKallpaPay = { id: 456 };
        expectedResult = service.addAccountKallpaPayToCollectionIfMissing([], accountKallpaPay, accountKallpaPay2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accountKallpaPay);
        expect(expectedResult).toContain(accountKallpaPay2);
      });

      it('should accept null and undefined values', () => {
        const accountKallpaPay: IAccountKallpaPay = { id: 123 };
        expectedResult = service.addAccountKallpaPayToCollectionIfMissing([], null, accountKallpaPay, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accountKallpaPay);
      });

      it('should return initial array if no AccountKallpaPay is added', () => {
        const accountKallpaPayCollection: IAccountKallpaPay[] = [{ id: 123 }];
        expectedResult = service.addAccountKallpaPayToCollectionIfMissing(accountKallpaPayCollection, undefined, null);
        expect(expectedResult).toEqual(accountKallpaPayCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
