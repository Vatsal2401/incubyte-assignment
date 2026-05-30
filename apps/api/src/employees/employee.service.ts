import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Employee, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateEmployeeInput,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  ListEmployeesQuery,
  Paginated,
} from './employee.types';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateEmployeeInput): Promise<Employee> {
    return this.prisma.employee.create({ data: input });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee ${id} not found`);
    }
    return employee;
  }

  async list(query: ListEmployeesQuery): Promise<Paginated<Employee>> {
    const page = query.page ?? DEFAULT_PAGE;
    const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
    const where = this.buildWhere(query);

    const [items, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.employee.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  private buildWhere(query: ListEmployeesQuery): Prisma.EmployeeWhereInput {
    const { salaryMin, salaryMax } = query;
    if (salaryMin !== undefined && salaryMax !== undefined && salaryMin > salaryMax) {
      throw new BadRequestException('salaryMin cannot be greater than salaryMax');
    }

    const where: Prisma.EmployeeWhereInput = {};
    if (query.country) {
      where.country = query.country;
    }
    if (query.department) {
      where.department = query.department;
    }
    if (salaryMin !== undefined || salaryMax !== undefined) {
      where.salaryMinor = {
        ...(salaryMin !== undefined ? { gte: salaryMin } : {}),
        ...(salaryMax !== undefined ? { lte: salaryMax } : {}),
      };
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { email: { contains: query.search } },
      ];
    }
    return where;
  }
}
