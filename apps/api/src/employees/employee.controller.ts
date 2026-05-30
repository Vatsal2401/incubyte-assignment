import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Employee } from '@prisma/client';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { QueryEmployeesDto } from './dto/query-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';
import { Paginated } from './employee.types';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employees: EmployeeService) {}

  @Post()
  create(@Body() dto: CreateEmployeeDto): Promise<Employee> {
    return this.employees.create({ ...dto, hireDate: new Date(dto.hireDate) });
  }

  @Get()
  list(@Query() query: QueryEmployeesDto): Promise<Paginated<Employee>> {
    return this.employees.list(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Employee> {
    return this.employees.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto): Promise<Employee> {
    const { hireDate, ...rest } = dto;
    return this.employees.update(id, {
      ...rest,
      ...(hireDate ? { hireDate: new Date(hireDate) } : {}),
    });
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string): Promise<Employee> {
    return this.employees.deactivate(id);
  }
}
