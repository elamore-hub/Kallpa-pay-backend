import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAccountKallpaPay, AccountKallpaPay } from '../account-kallpa-pay.model';
import { AccountKallpaPayService } from '../service/account-kallpa-pay.service';

@Injectable({ providedIn: 'root' })
export class AccountKallpaPayRoutingResolveService implements Resolve<IAccountKallpaPay> {
  constructor(protected service: AccountKallpaPayService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAccountKallpaPay> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((accountKallpaPay: HttpResponse<AccountKallpaPay>) => {
          if (accountKallpaPay.body) {
            return of(accountKallpaPay.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AccountKallpaPay());
  }
}
