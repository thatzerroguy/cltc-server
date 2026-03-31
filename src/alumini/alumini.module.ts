import { Module } from '@nestjs/common';
import { AluminiService } from './alumini.service';
import { AluminiController } from './alumini.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [AluminiController],
  providers: [AluminiService],
  imports: [DatabaseModule],
})
export class AluminiModule {}
