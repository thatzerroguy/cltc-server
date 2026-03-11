import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService],
  imports: [DatabaseModule],
})
export class DepartmentModule {}
