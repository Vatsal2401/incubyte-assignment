import { render, screen } from '@testing-library/react';
import type { AnalyticsOverview } from '@/lib/api';
import { AnalyticsDashboard } from './AnalyticsDashboard';

const overview: AnalyticsOverview = {
  byCurrency: [
    {
      currency: 'USD',
      headcount: 2,
      totalMinor: 30_000_00,
      averageMinor: 15_000_00,
      minMinor: 10_000_00,
      maxMinor: 20_000_00,
    },
    {
      currency: 'INR',
      headcount: 3,
      totalMinor: 90_000_00,
      averageMinor: 30_000_00,
      minMinor: 20_000_00,
      maxMinor: 40_000_00,
    },
  ],
  byCountry: [{ key: 'US', headcount: 2 }],
  byDepartment: [{ key: 'Engineering', headcount: 5 }],
};

describe('AnalyticsDashboard', () => {
  it('shows total headcount across currencies', () => {
    render(<AnalyticsDashboard overview={overview} />);

    expect(screen.getByText('Total headcount')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows total spend per currency, formatted', () => {
    render(<AnalyticsDashboard overview={overview} />);

    expect(screen.getByText('$30,000.00')).toBeInTheDocument();
    expect(screen.getByText('₹90,000.00')).toBeInTheDocument();
  });

  it('lists the largest department', () => {
    render(<AnalyticsDashboard overview={overview} />);

    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });
});
