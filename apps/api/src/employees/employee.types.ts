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

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;

export interface ListEmployeesQuery {
  page?: number;
  pageSize?: number;
  country?: string;
  department?: string;
  salaryMin?: number;
  salaryMax?: number;
  search?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 25;
