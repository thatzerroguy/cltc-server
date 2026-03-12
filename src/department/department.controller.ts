import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { ZodValidationPipe } from 'src/zod-validate/zod-validate.pipe';
import {
  CreateDepartmentDto,
  createDepartmentSchema,
} from './dto/create-department.dto';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  async getDepartments() {
    return await this.departmentService.getDepartments();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createDepartment(
    @Body(new ZodValidationPipe(createDepartmentSchema))
    data: CreateDepartmentDto,
  ) {
    return await this.departmentService.createDepartment(data);
  }
}
