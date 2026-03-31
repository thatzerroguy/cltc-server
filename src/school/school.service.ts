import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { AddInstructorsDto } from './dto/add-instructors.dto';

@Injectable()
export class SchoolService {
  private readonly logger = new Logger(SchoolService.name);

  constructor(private readonly prisma: DatabaseService) {}

  async createSchool(data: CreateSchoolDto) {
    try {
      const existing = await this.prisma.school.findUnique({
        where: { name: data.name },
      });
      if (existing) {
        throw new HttpException(
          'School with this name already exists',
          HttpStatus.CONFLICT,
        );
      }

      const coordinator = await this.prisma.user.findUnique({
        where: { id: data.coordinator_id },
      });
      if (!coordinator) {
        throw new HttpException(
          'Coordinator user not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const school = await this.prisma.school.create({
        data: {
          name: data.name,
          location: data.location,
          coordinator_id: data.coordinator_id,
          instructors: {
            connect: (data.instructor_ids ?? []).map((id) => ({ id })),
          },
        },
      });

      return {
        message: 'School created successfully',
        school,
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

  async addInstructors(school_id: string, data: AddInstructorsDto) {
    try {
      const school = await this.prisma.school.findUnique({
        where: { id: school_id },
      });
      if (!school) {
        throw new HttpException('School not found', HttpStatus.NOT_FOUND);
      }

      const schoolUpdated = await this.prisma.school.update({
        where: { id: school_id },
        data: {
          instructors: {
            connect: data.instructor_ids.map((id) => ({ id })),
          },
        },
        include: {
          instructors: true,
        },
      });

      return {
        message: 'Instructors added successfully',
        school: schoolUpdated,
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

  async getSchools() {
    return await this.prisma.school.findMany({
      include: {
        coordinator: { include: { profile: true } },
        instructors: { include: { profile: true } },
        courses: true,
      },
    });
  }
}

