import { Module } from '@nestjs/common';
import { EmployeeModule } from './employees/employee.module';
import { PrismaModule } from './prisma/prisma.module';

// Root module. Feature modules (employees, analytics) are added as they are built via TDD.
@Module({
  imports: [PrismaModule, EmployeeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
