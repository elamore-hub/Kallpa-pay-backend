import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AccountKallpaPayComponent } from './list/account-kallpa-pay.component';
import { AccountKallpaPayDetailComponent } from './detail/account-kallpa-pay-detail.component';
import { AccountKallpaPayUpdateComponent } from './update/account-kallpa-pay-update.component';
import { AccountKallpaPayDeleteDialogComponent } from './delete/account-kallpa-pay-delete-dialog.component';
import { AccountKallpaPayRoutingModule } from './route/account-kallpa-pay-routing.module';

@NgModule({
  imports: [SharedModule, AccountKallpaPayRoutingModule],
  declarations: [
    AccountKallpaPayComponent,
    AccountKallpaPayDetailComponent,
    AccountKallpaPayUpdateComponent,
    AccountKallpaPayDeleteDialogComponent,
  ],
  entryComponents: [AccountKallpaPayDeleteDialogComponent],
})
export class AccountKallpaPayModule {}
