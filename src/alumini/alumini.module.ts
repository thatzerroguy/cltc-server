import { Module } from '@nestjs/common';
import { AluminiService } from './alumini.service';
import { AluminiController } from './alumini.controller';

@Module({
  controllers: [AluminiController],
  providers: [AluminiService],
})
export class AluminiModule {}
