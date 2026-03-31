import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RegisterStudentDto } from './dto/register-student.dto';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(private readonly prisma: DatabaseService) {}

  async registerStudent(data: RegisterStudentDto) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id: data.course_id },
      });
      if (!course) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }

      const student = await this.prisma.student.create({
        data: {
          course_id: data.course_id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
        },
      });

      return {
        message: 'Student registered successfully',
        student,
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

  async getStudents(course_id?: string) {
    return await this.prisma.student.findMany({
      where: course_id ? { course_id } : {},
      orderBy: { registration_date: 'desc' },
    });
  }
}

