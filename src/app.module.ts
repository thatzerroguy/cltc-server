import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DepartmentModule } from './department/department.module';
import { NewsModule } from './news/news.module';
import { MagazinesModule } from './magazines/magazines.module';
import { AluminiModule } from './alumini/alumini.module';
import { SchoolModule } from './school/school.module';
import { CourseModule } from './course/course.module';
import { StudentModule } from './student/student.module';
import { FilesModule } from './files/files.module';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [config],
      expandVariables: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    DepartmentModule,
    NewsModule,
    MagazinesModule,
    AluminiModule,
    SchoolModule,
    CourseModule,
    StudentModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
