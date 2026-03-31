import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto, createCourseSchema } from './dto/create-course.dto';
import { UpdateCourseStatusDto, updateCourseStatusSchema } from './dto/update-course-status.dto';
import { ZodValidationPipe } from 'src/zod-validate/zod-validate.pipe';
import { AuthGuard } from '@nestjs/passport';
import { SubRolesGuard } from 'src/guard/sub-roles.guard';
import { SubRoles } from 'src/decorators/sub-roles.decorator';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // Only COURSE_COORDINATOR can create courses
  @UseGuards(AuthGuard('access'), SubRolesGuard)
  @SubRoles('COURSE_COORDINATOR')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCourse(
    @Body(new ZodValidationPipe(createCourseSchema))
    data: CreateCourseDto,
  ) {
    return await this.courseService.createCourse(data);
  }

  @UseGuards(AuthGuard('access'))
  @Get()
  async getCourses(@Query('schoolId') school_id: string) {
    return await this.courseService.getCourses(school_id);
  }

  @UseGuards(AuthGuard('access'), SubRolesGuard)
  @SubRoles('COURSE_COORDINATOR')
  @Patch(':id/status')
  async updateCourseStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCourseStatusSchema))
    data: UpdateCourseStatusDto,
  ) {
    return await this.courseService.updateCourseStatus(id, data.status as any);
  }
}
