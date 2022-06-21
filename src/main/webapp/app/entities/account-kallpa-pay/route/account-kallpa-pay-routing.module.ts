import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AccountKallpaPayComponent } from '../list/account-kallpa-pay.component';
import { AccountKallpaPayDetailComponent } from '../detail/account-kallpa-pay-detail.component';
import { AccountKallpaPayUpdateComponent } from '../update/account-kallpa-pay-update.component';
import { AccountKallpaPayRoutingResolveService } from './account-kallpa-pay-routing-resolve.service';

const accountKallpaPayRoute: Routes = [
  {
    path: '',
    component: AccountKallpaPayComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccountKallpaPayDetailComponent,
    resolve: {
      accountKallpaPay: AccountKallpaPayRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccountKallpaPayUpdateComponent,
    resolve: {
      accountKallpaPay: AccountKallpaPayRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccountKallpaPayUpdateComponent,
    resolve: {
      accountKallpaPay: AccountKallpaPayRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountKallpaPayRoute)],
  exports: [RouterModule],
})
export class AccountKallpaPayRoutingModule {}
