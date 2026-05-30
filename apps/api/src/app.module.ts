import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AnalyticsModule } from './analytics/analytics.module';
import { EmployeeModule } from './employees/employee.module';
import { PrismaModule } from './prisma/prisma.module';

// Root module wiring the feature modules built via TDD.
// In production the built SPA is copied to ./public and served at the root;
// /api/* is excluded so API routes return JSON (not the SPA index) on 404.
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      exclude: ['/api/{*splat}'],
    }),
    PrismaModule,
    EmployeeModule,
    AnalyticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
