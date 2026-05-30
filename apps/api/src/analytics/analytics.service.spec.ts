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
});
