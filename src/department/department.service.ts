import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentService {
  private readonly logger: Logger = new Logger(DepartmentService.name);
  constructor(private readonly prisma: DatabaseService) {}

  async createDepartment(data: CreateDepartmentDto) {
    try {
      // Check if department already exists
      const existing_department = await this.prisma.department.findFirst({
        where: {
          name: data.name,
        },
      });
      if (existing_department) {
        throw new HttpException(
          'Department already exists',
          HttpStatus.CONFLICT,
        );
      }
      // Create department
      const department = await this.prisma.department.create({
        data: {
          name: data.name,
        },
      });
      return {
        message: 'Department created successfully',
        department,
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

  async getDepartments() {
    try {
      const departments = await this.prisma.department.findMany();
      return {
        message: 'Departments retrieved successfully',
        departments,
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

  async getDepartmentById(department_id: string) {
    try {
      const department = await this.prisma.department.findUnique({
        where: {
          id: department_id,
        },
      });
      if (!department) {
        throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Department retrieved successfully',
        department_id: department.id,
        department_name: department.name,
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

  async getDepartmentByName(department_name: string) {
    try {
      const department = await this.prisma.department.findUnique({
        where: {
          name: department_name,
        },
      });
      if (!department) {
        throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Department retrieved successfully',
        department_id: department.id,
        department_name: department.name,
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
