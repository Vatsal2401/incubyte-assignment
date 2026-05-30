import { NotFoundException } from '@nestjs/common';
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

  it('returns an employee by id', async () => {
    const employee = { id: 'emp_1', status: 'active', ...baseInput };
    prisma.employee.findUnique.mockResolvedValue(employee as never);

    const result = await service.findOne('emp_1');

    expect(prisma.employee.findUnique).toHaveBeenCalledWith({ where: { id: 'emp_1' } });
    expect(result).toEqual(employee);
  });

  it('throws NotFound when the employee does not exist', async () => {
    prisma.employee.findUnique.mockResolvedValue(null as never);

    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });
});
