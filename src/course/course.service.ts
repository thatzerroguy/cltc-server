import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { $Enums } from 'generated/prisma/client';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(private readonly prisma: DatabaseService) {}

  async createCourse(data: CreateCourseDto) {
    try {
      const school = await this.prisma.school.findUnique({
        where: { id: data.school_id },
      });
      if (!school) {
        throw new HttpException('School not found', HttpStatus.NOT_FOUND);
      }

      const instructor = await this.prisma.user.findUnique({
        where: { id: data.instructor_id },
      });
      if (!instructor) {
        throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);
      }

      const course = await this.prisma.course.create({
        data: {
          school_id: data.school_id,
          title: data.title,
          description: data.description,
          duration: data.duration,
          location: data.location,
          year: data.year,
          instructor_id: data.instructor_id,
          status: (data.status ?? 'DRAFT') as $Enums.CourseStatus,
          start_date: data.start_date,
        },
      });

      return {
        message: 'Course created successfully',
        course,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCourses(school_id?: string) {
    return await this.prisma.course.findMany({
      where: school_id ? { school_id } : {},
      include: {
        instructor: { include: { profile: true } },
      },
      orderBy: { start_date: 'asc' },
    });
  }

  async updateCourseStatus(id: string, status: $Enums.CourseStatus) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
      });
      if (!course) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }

      const updatedCourse = await this.prisma.course.update({
        where: { id },
        data: { status },
      });

      return {
        message: 'Course status updated successfully',
        course: updatedCourse,
        status: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

