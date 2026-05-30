import { Module } from '@nestjs/common';
import { AnalyticsModule } from './analytics/analytics.module';
import { EmployeeModule } from './employees/employee.module';
import { PrismaModule } from './prisma/prisma.module';

// Root module wiring the feature modules built via TDD.
@Module({
  imports: [PrismaModule, EmployeeModule, AnalyticsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
