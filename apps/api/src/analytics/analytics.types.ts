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
