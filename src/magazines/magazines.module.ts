import { Module } from '@nestjs/common';
import { MagazinesService } from './magazines.service';
import { MagazinesController } from './magazines.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [MagazinesController],
  providers: [MagazinesService],
  imports: [DatabaseModule],
})
export class MagazinesModule {}
