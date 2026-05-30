import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsString,
  Length,
  Min,
  MinLength,
} from 'class-validator';
import { CurrencyCode, SUPPORTED_CURRENCIES } from '../../domain/money';

export class CreateEmployeeDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  jobTitle!: string;

  @IsString()
  @MinLength(1)
  department!: string;

  @IsString()
  @Length(2, 2)
  country!: string;

  @IsIn(SUPPORTED_CURRENCIES)
  currency!: CurrencyCode;

  @IsInt()
  @Min(0)
  salaryMinor!: number;

  @IsDateString()
  hireDate!: string;
}
