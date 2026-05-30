import type { CurrencyCode } from './format';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export interface Employee {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  currency: CurrencyCode;
  salaryMinor: number;
  status: 'active' | 'inactive';
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface EmployeeFilters {
  page?: number;
  pageSize?: number;
  country?: string;
  department?: string;
  salaryMin?: number;
  salaryMax?: number;
  search?: string;
}

export interface CurrencySummary {
  currency: string;
  headcount: number;
  totalMinor: number;
  averageMinor: number;
  minMinor: number;
  maxMinor: number;
}

export interface GroupCount {
  key: string;
  headcount: number;
}

export interface AnalyticsOverview {
  byCurrency: CurrencySummary[];
  byCountry: GroupCount[];
  byDepartment: GroupCount[];
}

export interface CreateEmployeeBody {
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  currency: CurrencyCode;
  salaryMinor: number;
  hireDate: string;
}

/** Serialize a flat params object, skipping undefined and empty-string values. */
export function toQueryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.append(key, String(value));
    }
  }
  return search.toString();
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function fetchEmployees(filters: EmployeeFilters): Promise<Paginated<Employee>> {
  const qs = toQueryString(filters as Record<string, string | number | undefined>);
  return request<Paginated<Employee>>(`/employees${qs ? `?${qs}` : ''}`);
}

export function createEmployee(body: CreateEmployeeBody): Promise<Employee> {
  return request<Employee>('/employees', { method: 'POST', body: JSON.stringify(body) });
}

export function updateEmployee(id: string, body: Partial<CreateEmployeeBody>): Promise<Employee> {
  return request<Employee>(`/employees/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
}

export function deactivateEmployee(id: string): Promise<Employee> {
  return request<Employee>(`/employees/${id}/deactivate`, { method: 'PATCH' });
}

export function fetchAnalyticsOverview(): Promise<AnalyticsOverview> {
  return request<AnalyticsOverview>('/analytics/overview');
}
