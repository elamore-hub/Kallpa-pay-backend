import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAccountKallpaPay, AccountKallpaPay } from '../account-kallpa-pay.model';
import { AccountKallpaPayService } from '../service/account-kallpa-pay.service';

import { AccountKallpaPayRoutingResolveService } from './account-kallpa-pay-routing-resolve.service';

describe('AccountKallpaPay routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AccountKallpaPayRoutingResolveService;
  let service: AccountKallpaPayService;
  let resultAccountKallpaPay: IAccountKallpaPay | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(AccountKallpaPayRoutingResolveService);
    service = TestBed.inject(AccountKallpaPayService);
    resultAccountKallpaPay = undefined;
  });

  describe('resolve', () => {
    it('should return IAccountKallpaPay returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAccountKallpaPay = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAccountKallpaPay).toEqual({ id: 123 });
    });

    it('should return new IAccountKallpaPay if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAccountKallpaPay = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAccountKallpaPay).toEqual(new AccountKallpaPay());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AccountKallpaPay })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAccountKallpaPay = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAccountKallpaPay).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
