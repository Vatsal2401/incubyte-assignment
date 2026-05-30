import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalyticsOverview, GroupCount } from '@/lib/api';
import { type CurrencyCode, formatMoney } from '@/lib/format';

interface AnalyticsDashboardProps {
  overview: AnalyticsOverview;
}

export function AnalyticsDashboard({ overview }: AnalyticsDashboardProps): JSX.Element {
  const totalHeadcount = overview.byCurrency.reduce((sum, c) => sum + c.headcount, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total headcount" value={String(totalHeadcount)} />
        <StatCard label="Countries" value={String(overview.byCountry.length)} />
        <StatCard label="Departments" value={String(overview.byDepartment.length)} />
        <StatCard label="Currencies" value={String(overview.byCurrency.length)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spend by currency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.byCurrency.map((c) => (
              <div key={c.currency} className="flex items-center justify-between text-sm">
                <span className="font-medium">{c.currency}</span>
                <div className="text-right">
                  <div className="tabular-nums">
                    {formatMoney(c.totalMinor, c.currency as CurrencyCode)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {c.headcount} people · avg{' '}
                    {formatMoney(c.averageMinor, c.currency as CurrencyCode)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Headcount by department</CardTitle>
          </CardHeader>
          <CardContent>
            <Breakdown items={overview.byDepartment} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 text-3xl font-semibold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  );
}

function Breakdown({ items }: { items: GroupCount[] }): JSX.Element {
  const max = Math.max(1, ...items.map((i) => i.headcount));
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.key} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{item.key}</span>
            <span className="tabular-nums text-muted-foreground">{item.headcount}</span>
          </div>
          <div className="h-2 rounded bg-muted">
            <div
              className="h-2 rounded bg-primary"
              style={{ width: `${(item.headcount / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
