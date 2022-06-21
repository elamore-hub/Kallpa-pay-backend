import { ICard } from 'app/entities/card/card.model';
import { IAccountKallpaPay } from 'app/entities/account-kallpa-pay/account-kallpa-pay.model';

export interface IAccountMembership {
  id?: number;
  externalId?: string | null;
  email?: string | null;
  status?: string | null;
  cards?: ICard[] | null;
  accountKallpaPay?: IAccountKallpaPay | null;
}

export class AccountMembership implements IAccountMembership {
  constructor(
    public id?: number,
    public externalId?: string | null,
    public email?: string | null,
    public status?: string | null,
    public cards?: ICard[] | null,
    public accountKallpaPay?: IAccountKallpaPay | null
  ) {}
}

export function getAccountMembershipIdentifier(accountMembership: IAccountMembership): number | undefined {
  return accountMembership.id;
}
