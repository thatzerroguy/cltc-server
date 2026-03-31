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
import { SchoolService } from './school.service';
import { CreateSchoolDto, createSchoolSchema } from './dto/create-school.dto';
import {
  AddInstructorsDto,
  addInstructorsSchema,
} from './dto/add-instructors.dto';
import { ZodValidationPipe } from 'src/zod-validate/zod-validate.pipe';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { SubRolesGuard } from 'src/guard/sub-roles.guard';
import { SubRoles } from 'src/decorators/sub-roles.decorator';

@Controller('schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  // Only SUPER_ADMIN can create schools
  @UseGuards(AuthGuard('access'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createSchool(
    @Body(new ZodValidationPipe(createSchoolSchema))
    data: CreateSchoolDto,
  ) {
    return await this.schoolService.createSchool(data);
  }

  @UseGuards(AuthGuard('access'))
  @Get()
  async getSchools() {
    return await this.schoolService.getSchools();
  }

  // Only COURSE_COORDINATOR can add instructors to a school
  @UseGuards(AuthGuard('access'), SubRolesGuard)
  @SubRoles('COURSE_COORDINATOR')
  @HttpCode(HttpStatus.OK)
  @Post(':id/instructors')
  async addInstructors(
    @Param('id') school_id: string,
    @Body(new ZodValidationPipe(addInstructorsSchema))
    data: AddInstructorsDto,
  ) {
    return await this.schoolService.addInstructors(school_id, data);
  }
}
