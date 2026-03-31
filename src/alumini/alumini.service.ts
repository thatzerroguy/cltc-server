import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateAluminiDto } from './dto/create-alumini.dto';

@Injectable()
export class AluminiService {
  private readonly logger: Logger = new Logger(AluminiService.name);
  constructor(private readonly prisma: DatabaseService) {}

  async createAlumini(data: CreateAluminiDto) {
    try {
      const { school_id, course_id, ...rest } = data;

      const alumini = await this.prisma.alumini.create({
        data: {
          ...rest,
          school: {
            connect: { id: school_id },
          },
          course: {
            connect: { id: course_id },
          },
        },
      });

      return {
        name: alumini.name,
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

  async updateAlumini() {}

  async deleteAlumini() {}
}
