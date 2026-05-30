import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';

// All fields optional — same validation rules apply when present.
export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
