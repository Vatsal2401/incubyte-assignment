import { BadRequestException, NotFoundException } from '@nestjs/common';
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

  it('updates an existing employee', async () => {
    const existing = { id: 'emp_1', status: 'active', ...baseInput };
    prisma.employee.findUnique.mockResolvedValue(existing as never);
    const updated = { ...existing, jobTitle: 'Principal Engineer' };
    prisma.employee.update.mockResolvedValue(updated as never);

    const result = await service.update('emp_1', { jobTitle: 'Principal Engineer' });

    expect(prisma.employee.update).toHaveBeenCalledWith({
      where: { id: 'emp_1' },
      data: { jobTitle: 'Principal Engineer' },
    });
    expect(result).toEqual(updated);
  });

  it('throws NotFound when updating a missing employee', async () => {
    prisma.employee.findUnique.mockResolvedValue(null as never);

    await expect(service.update('missing', { jobTitle: 'X' })).rejects.toThrow(NotFoundException);
    expect(prisma.employee.update).not.toHaveBeenCalled();
  });

  it('deactivates an employee by setting status to inactive', async () => {
    const existing = { id: 'emp_1', status: 'active', ...baseInput };
    prisma.employee.findUnique.mockResolvedValue(existing as never);
    prisma.employee.update.mockResolvedValue({ ...existing, status: 'inactive' } as never);

    const result = await service.deactivate('emp_1');

    expect(prisma.employee.update).toHaveBeenCalledWith({
      where: { id: 'emp_1' },
      data: { status: 'inactive' },
    });
    expect(result.status).toBe('inactive');
  });

  describe('list', () => {
    const row = { id: 'emp_1', status: 'active', ...baseInput };

    it('returns a page with default pagination (page 1, size 25)', async () => {
      prisma.employee.findMany.mockResolvedValue([row] as never);
      prisma.employee.count.mockResolvedValue(1 as never);

      const result = await service.list({});

      expect(prisma.employee.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 25,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual({ items: [row], total: 1, page: 1, pageSize: 25 });
    });

    it('computes skip from page and pageSize', async () => {
      prisma.employee.findMany.mockResolvedValue([] as never);
      prisma.employee.count.mockResolvedValue(120 as never);

      const result = await service.list({ page: 3, pageSize: 20 });

      expect(prisma.employee.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 40, take: 20 }),
      );
      expect(result).toMatchObject({ total: 120, page: 3, pageSize: 20 });
    });

    it('composes country, department and salary-range filters into the where clause', async () => {
      prisma.employee.findMany.mockResolvedValue([] as never);
      prisma.employee.count.mockResolvedValue(0 as never);

      await service.list({
        country: 'IN',
        department: 'Engineering',
        salaryMin: 1_000_000,
        salaryMax: 5_000_000,
      });

      expect(prisma.employee.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            country: 'IN',
            department: 'Engineering',
            salaryMinor: { gte: 1_000_000, lte: 5_000_000 },
          },
        }),
      );
    });

    it('omits the salary filter when no bounds are given', async () => {
      prisma.employee.findMany.mockResolvedValue([] as never);
      prisma.employee.count.mockResolvedValue(0 as never);

      await service.list({ country: 'US' });

      expect(prisma.employee.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { country: 'US' } }),
      );
    });

    it('rejects a salary range where min is greater than max', async () => {
      await expect(service.list({ salaryMin: 5_000_000, salaryMax: 1_000_000 })).rejects.toThrow(
        BadRequestException,
      );
      expect(prisma.employee.findMany).not.toHaveBeenCalled();
    });

    it('matches name or email when searching', async () => {
      prisma.employee.findMany.mockResolvedValue([] as never);
      prisma.employee.count.mockResolvedValue(0 as never);

      await service.list({ search: 'ada' });

      expect(prisma.employee.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [{ name: { contains: 'ada' } }, { email: { contains: 'ada' } }],
          },
        }),
      );
    });
  });
});
