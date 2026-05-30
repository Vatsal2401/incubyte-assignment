import { Test } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'vitest-mock-extended';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();
    const moduleRef = await Test.createTestingModule({
      providers: [AnalyticsService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(AnalyticsService);
  });

  describe('summaryByCurrency', () => {
    it('aggregates headcount, total spend and avg/min/max per currency for active employees', async () => {
      prisma.employee.groupBy.mockResolvedValue([
        {
          currency: 'USD',
          _count: { _all: 2 },
          _sum: { salaryMinor: 30_000_00 },
          _avg: { salaryMinor: 15_000_00 },
          _min: { salaryMinor: 10_000_00 },
          _max: { salaryMinor: 20_000_00 },
        },
      ] as never);

      const result = await service.summaryByCurrency();

      expect(prisma.employee.groupBy).toHaveBeenCalledWith({
        by: ['currency'],
        where: { status: 'active' },
        _count: { _all: true },
        _sum: { salaryMinor: true },
        _avg: { salaryMinor: true },
        _min: { salaryMinor: true },
        _max: { salaryMinor: true },
      });
      expect(result).toEqual([
        {
          currency: 'USD',
          headcount: 2,
          totalMinor: 30_000_00,
          averageMinor: 15_000_00,
          minMinor: 10_000_00,
          maxMinor: 20_000_00,
        },
      ]);
    });
  });

  describe('headcountByCountry', () => {
    it('counts active employees per country, most populous first', async () => {
      prisma.employee.groupBy.mockResolvedValue([
        { country: 'IN', _count: { _all: 5 } },
        { country: 'US', _count: { _all: 3 } },
      ] as never);

      const result = await service.headcountByCountry();

      expect(prisma.employee.groupBy).toHaveBeenCalledWith({
        by: ['country'],
        where: { status: 'active' },
        _count: { _all: true },
        orderBy: { _count: { country: 'desc' } },
      });
      expect(result).toEqual([
        { key: 'IN', headcount: 5 },
        { key: 'US', headcount: 3 },
      ]);
    });
  });

  describe('headcountByDepartment', () => {
    it('counts active employees per department, largest first', async () => {
      prisma.employee.groupBy.mockResolvedValue([
        { department: 'Engineering', _count: { _all: 8 } },
        { department: 'Sales', _count: { _all: 4 } },
      ] as never);

      const result = await service.headcountByDepartment();

      expect(prisma.employee.groupBy).toHaveBeenCalledWith({
        by: ['department'],
        where: { status: 'active' },
        _count: { _all: true },
        orderBy: { _count: { department: 'desc' } },
      });
      expect(result).toEqual([
        { key: 'Engineering', headcount: 8 },
        { key: 'Sales', headcount: 4 },
      ]);
    });
  });

  describe('overview', () => {
    it('combines the currency summary with country and department breakdowns', async () => {
      prisma.employee.groupBy.mockImplementation((args: { by: string[] }) => {
        if (args.by[0] === 'currency') {
          return Promise.resolve([
            {
              currency: 'USD',
              _count: { _all: 1 },
              _sum: { salaryMinor: 10_000_00 },
              _avg: { salaryMinor: 10_000_00 },
              _min: { salaryMinor: 10_000_00 },
              _max: { salaryMinor: 10_000_00 },
            },
          ]) as never;
        }
        if (args.by[0] === 'country') {
          return Promise.resolve([{ country: 'US', _count: { _all: 1 } }]) as never;
        }
        return Promise.resolve([{ department: 'Engineering', _count: { _all: 1 } }]) as never;
      });

      const result = await service.overview();

      expect(result).toEqual({
        byCurrency: [
          {
            currency: 'USD',
            headcount: 1,
            totalMinor: 10_000_00,
            averageMinor: 10_000_00,
            minMinor: 10_000_00,
            maxMinor: 10_000_00,
          },
        ],
        byCountry: [{ key: 'US', headcount: 1 }],
        byDepartment: [{ key: 'Engineering', headcount: 1 }],
      });
    });
  });
});
