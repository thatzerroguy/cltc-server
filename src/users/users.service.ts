import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/interfaces/user.interface';
import { CreateUserDto } from './dto/create-users.dto';
import { $Enums } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);
  constructor(private readonly prisma: DatabaseService) {}

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany({
        include: {
          profile: true,
        },
      });
      return users.map((user) => ({
        id: user.id,
        username: user.username,
        first_name: user.profile?.first_name,
        last_name: user.profile?.last_name,
        email: user.profile?.email,
        role: user.role,
        sub_role: user.sub_role,
        department_id: user.department_id,
        message: 'Users fetched successfully',
        status: HttpStatus.FOUND,
      }));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** */
  async createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.$transaction(async (tx) => {
      // Check if a profile with the email exists
      const existing_profile = await tx.profile.findUnique({
        where: {
          email: data.email,
        },
      });
      if (existing_profile) {
        throw new HttpException(
          `Profile with email ${data.email} already exists`,
          HttpStatus.CONFLICT,
        );
      }

      // Check if department exists
      const existing_department = await tx.department.findUnique({
        where: {
          name: data.department,
        },
      });
      if (!existing_department) {
        throw new HttpException(
          `Department with name ${data.department} does not exist`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Hash password
      const hashed_password = await bcrypt.hash(data.password, 10);

      // Create user
      const user = await tx.user.create({
        data: {
          username: data.user_name,
          password: hashed_password,
          role: data.role as $Enums.Role,
          sub_role: data.sub_role as $Enums.SubRole,
          department_id: existing_department.id,
          profile: {
            create: {
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              position: data.position,
            },
          },
        },
        include: {
          profile: true,
        },
      });
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        sub_role: user.sub_role,
        department_id: user.department_id,
        first_name: user.profile?.first_name,
        last_name: user.profile?.last_name,
        email: user.profile?.email,
        position: user.profile?.position,
        message: 'User created successfully',
        status: HttpStatus.CREATED,
      };
    });
  }
  // TODO: Implement update user
  async updateUser() {}

  /**
   * @author thatzerroguy
   * Get all users in a department
   * @param department_id
   * @returns
   */
  async getUsersInDepartment(department_id: string) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          department_id,
        },
        include: {
          profile: true,
        },
      });
      return users.map((user) => ({
        id: user.id,
        username: user.username,
        role: user.role,
        sub_role: user.sub_role,
        first_name: user.profile?.first_name,
        last_name: user.profile?.last_name,
        email: user.profile?.email,
        position: user.profile?.position,
        total_number_of_users: users.length,
      }));
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
