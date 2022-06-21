import { ITransaction } from 'app/entities/transaction/transaction.model';
import { IAccountKallpaPay } from 'app/entities/account-kallpa-pay/account-kallpa-pay.model';

export interface IIBAN {
  id?: number;
  name?: string | null;
  iban?: string | null;
  bic?: string | null;
  accountOwner?: string | null;
  transactions?: ITransaction[] | null;
  accountKallpaPay?: IAccountKallpaPay | null;
}

export class IBAN implements IIBAN {
  constructor(
    public id?: number,
    public name?: string | null,
    public iban?: string | null,
    public bic?: string | null,
    public accountOwner?: string | null,
    public transactions?: ITransaction[] | null,
    public accountKallpaPay?: IAccountKallpaPay | null
  ) {}
}

export function getIBANIdentifier(iBAN: IIBAN): number | undefined {
  return iBAN.id;
}
