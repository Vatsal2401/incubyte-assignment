import { CurrencyCode } from '../domain/money';

export interface CreateEmployeeInput {
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  currency: CurrencyCode;
  salaryMinor: number;
  hireDate: Date;
}
