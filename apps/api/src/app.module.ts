import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';

// Root module. Feature modules (employees, analytics) are added as they are built via TDD.
@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
