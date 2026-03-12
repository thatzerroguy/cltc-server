import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, createUserSchema } from './dto/create-users.dto';
import { ZodValidationPipe } from 'src/zod-validate/zod-validate.pipe';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { SubRoles } from 'src/decorators/sub-roles.decorator';
import { RolesGuard } from 'src/guard/roles.guard';
import { SubRolesGuard } from 'src/guard/sub-roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return await this.usersService.getAllUsers();
  }

  @UseGuards(AuthGuard('access'), RolesGuard, SubRolesGuard)
  @Roles('SUPER_ADMIN')
  @SubRoles('HEAD')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createUser(
    @Body(new ZodValidationPipe(createUserSchema)) data: CreateUserDto,
  ) {
    return await this.usersService.createUser(data);
  }

  @HttpCode(HttpStatus.OK)
  @Get('department/:id')
  async getUsersInDepartment(@Param('id') id: string) {
    return await this.usersService.getUsersInDepartment(id);
  }
}
