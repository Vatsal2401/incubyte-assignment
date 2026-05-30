import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CurrencySummary, GroupCount } from './analytics.types';

const ACTIVE = { status: 'active' };

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Headcount and salary stats grouped by currency. Salaries are never summed
   * across currencies, so totals/averages are reported per currency.
   */
  async summaryByCurrency(): Promise<CurrencySummary[]> {
    const groups = await this.prisma.employee.groupBy({
      by: ['currency'],
      where: ACTIVE,
      _count: { _all: true },
      _sum: { salaryMinor: true },
      _avg: { salaryMinor: true },
      _min: { salaryMinor: true },
      _max: { salaryMinor: true },
    });

    return groups.map((g) => ({
      currency: g.currency,
      headcount: g._count._all,
      totalMinor: g._sum.salaryMinor ?? 0,
      averageMinor: Math.round(g._avg.salaryMinor ?? 0),
      minMinor: g._min.salaryMinor ?? 0,
      maxMinor: g._max.salaryMinor ?? 0,
    }));
  }

  async headcountByCountry(): Promise<GroupCount[]> {
    const groups = await this.prisma.employee.groupBy({
      by: ['country'],
      where: ACTIVE,
      _count: { _all: true },
      orderBy: { _count: { country: 'desc' } },
    });
    return groups.map((g) => ({ key: g.country, headcount: g._count._all }));
  }

  async headcountByDepartment(): Promise<GroupCount[]> {
    const groups = await this.prisma.employee.groupBy({
      by: ['department'],
      where: ACTIVE,
      _count: { _all: true },
      orderBy: { _count: { department: 'desc' } },
    });
    return groups.map((g) => ({ key: g.department, headcount: g._count._all }));
  }
}
