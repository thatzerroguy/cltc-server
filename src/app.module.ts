import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DepartmentModule } from './department/department.module';
import { NewsModule } from './news/news.module';
import { MagazinesModule } from './magazines/magazines.module';
import { AluminiModule } from './alumini/alumini.module';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [config],
      expandVariables: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    DepartmentModule,
    NewsModule,
    MagazinesModule,
    AluminiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
