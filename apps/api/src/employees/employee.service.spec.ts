import { Test } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'vitest-mock-extended';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeeService } from './employee.service';

const baseInput = {
  name: 'Ada Lovelace',
  email: 'ada@acme.io',
  jobTitle: 'Staff Engineer',
  department: 'Engineering',
  country: 'GB',
  currency: 'GBP' as const,
  salaryMinor: 9_000_000,
  hireDate: new Date('2020-01-01T00:00:00Z'),
};

describe('EmployeeService', () => {
  let service: EmployeeService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();
    const moduleRef = await Test.createTestingModule({
      providers: [EmployeeService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(EmployeeService);
  });

  it('creates an employee', async () => {
    const created = { id: 'emp_1', status: 'active', ...baseInput };
    prisma.employee.create.mockResolvedValue(created as never);

    const result = await service.create(baseInput);

    expect(prisma.employee.create).toHaveBeenCalledWith({ data: baseInput });
    expect(result).toEqual(created);
  });
});
