import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAccountKallpaPay, getAccountKallpaPayIdentifier } from '../account-kallpa-pay.model';

export type EntityResponseType = HttpResponse<IAccountKallpaPay>;
export type EntityArrayResponseType = HttpResponse<IAccountKallpaPay[]>;

@Injectable({ providedIn: 'root' })
export class AccountKallpaPayService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/account-kallpa-pays');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(accountKallpaPay: IAccountKallpaPay): Observable<EntityResponseType> {
    return this.http.post<IAccountKallpaPay>(this.resourceUrl, accountKallpaPay, { observe: 'response' });
  }

  update(accountKallpaPay: IAccountKallpaPay): Observable<EntityResponseType> {
    return this.http.put<IAccountKallpaPay>(
      `${this.resourceUrl}/${getAccountKallpaPayIdentifier(accountKallpaPay) as number}`,
      accountKallpaPay,
      { observe: 'response' }
    );
  }

  partialUpdate(accountKallpaPay: IAccountKallpaPay): Observable<EntityResponseType> {
    return this.http.patch<IAccountKallpaPay>(
      `${this.resourceUrl}/${getAccountKallpaPayIdentifier(accountKallpaPay) as number}`,
      accountKallpaPay,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAccountKallpaPay>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAccountKallpaPay[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAccountKallpaPayToCollectionIfMissing(
    accountKallpaPayCollection: IAccountKallpaPay[],
    ...accountKallpaPaysToCheck: (IAccountKallpaPay | null | undefined)[]
  ): IAccountKallpaPay[] {
    const accountKallpaPays: IAccountKallpaPay[] = accountKallpaPaysToCheck.filter(isPresent);
    if (accountKallpaPays.length > 0) {
      const accountKallpaPayCollectionIdentifiers = accountKallpaPayCollection.map(
        accountKallpaPayItem => getAccountKallpaPayIdentifier(accountKallpaPayItem)!
      );
      const accountKallpaPaysToAdd = accountKallpaPays.filter(accountKallpaPayItem => {
        const accountKallpaPayIdentifier = getAccountKallpaPayIdentifier(accountKallpaPayItem);
        if (accountKallpaPayIdentifier == null || accountKallpaPayCollectionIdentifiers.includes(accountKallpaPayIdentifier)) {
          return false;
        }
        accountKallpaPayCollectionIdentifiers.push(accountKallpaPayIdentifier);
        return true;
      });
      return [...accountKallpaPaysToAdd, ...accountKallpaPayCollection];
    }
    return accountKallpaPayCollection;
  }
}
