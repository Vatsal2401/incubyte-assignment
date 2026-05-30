import { Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeInput } from './employee.types';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateEmployeeInput): Promise<Employee> {
    return this.prisma.employee.create({ data: input });
  }
}
