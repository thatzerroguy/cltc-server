import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import {
  RegisterStudentDto,
  registerStudentSchema,
} from './dto/register-student.dto';
import { ZodValidationPipe } from 'src/zod-validate/zod-validate.pipe';
import { AuthGuard } from '@nestjs/passport';
import { SubRolesGuard } from 'src/guard/sub-roles.guard';
import { SubRoles } from 'src/decorators/sub-roles.decorator';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // COURSE_COORDINATOR and COURSE_INSTRUCTOR can register students
  @UseGuards(AuthGuard('access'), SubRolesGuard)
  @SubRoles('COURSE_COORDINATOR', 'COURSE_INSTRUCTOR')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async registerStudent(
    @Body(new ZodValidationPipe(registerStudentSchema))
    data: RegisterStudentDto,
  ) {
    return await this.studentService.registerStudent(data);
  }

  @UseGuards(AuthGuard('access'))
  @Get()
  async getStudents(@Query('courseId') course_id: string) {
    return await this.studentService.getStudents(course_id);
  }
}
