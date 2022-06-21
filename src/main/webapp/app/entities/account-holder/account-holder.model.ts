import { IAccountHolderInfo } from 'app/entities/account-holder-info/account-holder-info.model';
import { IAddressInfo } from 'app/entities/address-info/address-info.model';
import { IAccountKallpaPay } from 'app/entities/account-kallpa-pay/account-kallpa-pay.model';
import { ISupportingDocument } from 'app/entities/supporting-document/supporting-document.model';
import { IOnboarding } from 'app/entities/onboarding/onboarding.model';

export interface IAccountHolder {
  id?: number;
  externalId?: string | null;
  verificationStatus?: string | null;
  statusInfo?: string | null;
  accountHolderInfo?: IAccountHolderInfo | null;
  residencyAddress?: IAddressInfo | null;
  accountKallpaPays?: IAccountKallpaPay[] | null;
  supportingDocuments?: ISupportingDocument[] | null;
  onboarding?: IOnboarding | null;
}

export class AccountHolder implements IAccountHolder {
  constructor(
    public id?: number,
    public externalId?: string | null,
    public verificationStatus?: string | null,
    public statusInfo?: string | null,
    public accountHolderInfo?: IAccountHolderInfo | null,
    public residencyAddress?: IAddressInfo | null,
    public accountKallpaPays?: IAccountKallpaPay[] | null,
    public supportingDocuments?: ISupportingDocument[] | null,
    public onboarding?: IOnboarding | null
  ) {}
}

export function getAccountHolderIdentifier(accountHolder: IAccountHolder): number | undefined {
  return accountHolder.id;
}
