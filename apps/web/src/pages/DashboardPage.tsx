import { Building2, Globe2, Landmark, Users } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { BarCard } from '@/components/charts/BarCard';
import { DonutCard } from '@/components/charts/DonutCard';
import { PageBody } from '@/components/layout/PageBody';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/features/analytics/useAnalytics';
import { type CurrencyCode, formatMoney } from '@/lib/format';

export function DashboardPage(): JSX.Element {
  const { data, isLoading, isError } = useAnalytics();

  if (isError) {
    return (
      <PageBody>
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
          Failed to load analytics. Is the API running?
        </div>
      </PageBody>
    );
  }

  if (isLoading || !data) {
    return (
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_unused, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border bg-muted/50" />
          ))}
        </div>
      </PageBody>
    );
  }

  const totalHeadcount = data.byCurrency.reduce((sum, c) => sum + c.headcount, 0);
  const topDepartment = data.byDepartment[0];

  return (
    <PageBody className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Active headcount" value={totalHeadcount.toLocaleString()} />
        <StatCard icon={Globe2} label="Countries" value={String(data.byCountry.length)} />
        <StatCard icon={Building2} label="Departments" value={String(data.byDepartment.length)} />
        <StatCard
          icon={Landmark}
          label="Largest team"
          value={topDepartment?.key ?? '—'}
          hint={topDepartment ? `${topDepartment.headcount.toLocaleString()} people` : undefined}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarCard title="Headcount by department" data={data.byDepartment} />
        <DonutCard title="Headcount by country" data={data.byCountry} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Total spend by currency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.byCurrency.map((c) => (
              <div key={c.currency} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{c.currency}</span>
                  <span className="text-xs text-muted-foreground">{c.headcount} people</span>
                </div>
                <div className="mt-1 text-xl font-semibold tabular-nums">
                  {formatMoney(c.totalMinor, c.currency as CurrencyCode)}
                </div>
                <div className="text-xs text-muted-foreground">
                  avg {formatMoney(c.averageMinor, c.currency as CurrencyCode)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageBody>
  );
}
