import { BarCard } from '@/components/charts/BarCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAnalytics } from '@/features/analytics/useAnalytics';
import { type CurrencyCode, formatMoney } from '@/lib/format';

export function AnalyticsPage(): JSX.Element {
  const { data, isLoading, isError } = useAnalytics();

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
        Failed to load analytics. Is the API running?
      </div>
    );
  }

  if (isLoading || !data) {
    return <div className="h-64 animate-pulse rounded-lg border bg-muted/50" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Salary statistics by currency</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">People</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Average</TableHead>
                <TableHead className="text-right">Min</TableHead>
                <TableHead className="text-right">Max</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.byCurrency.map((c) => {
                const cur = c.currency as CurrencyCode;
                return (
                  <TableRow key={c.currency}>
                    <TableCell className="font-medium">{c.currency}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {c.headcount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(c.totalMinor, cur)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(c.averageMinor, cur)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(c.minMinor, cur)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(c.maxMinor, cur)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarCard title="Headcount by country" data={data.byCountry} color="hsl(var(--chart-2))" />
        <BarCard
          title="Headcount by department"
          data={data.byDepartment}
          color="hsl(var(--chart-1))"
        />
      </div>
    </div>
  );
}
