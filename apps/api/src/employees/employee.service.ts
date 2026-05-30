import { Injectable, NotFoundException } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeInput } from './employee.types';

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
}
