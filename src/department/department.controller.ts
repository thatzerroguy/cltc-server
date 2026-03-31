import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { ZodValidationPipe } from 'src/zod-validate/zod-validate.pipe';
import {
  CreateDepartmentDto,
  createDepartmentSchema,
} from './dto/create-department.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @UseGuards(AuthGuard('access'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get()
  async getDepartments() {
    return await this.departmentService.getDepartments();
  }

  @UseGuards(AuthGuard('access'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createDepartment(
    @Body(new ZodValidationPipe(createDepartmentSchema))
    data: CreateDepartmentDto,
  ) {
    return await this.departmentService.createDepartment(data);
  }

  @UseGuards(AuthGuard('access'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch(':id')
  async updateDepartment(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createDepartmentSchema))
    data: CreateDepartmentDto,
  ) {
    return await this.departmentService.updateDepartment(id, data);
  }

  @UseGuards(AuthGuard('access'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Delete(':id')
  async deleteDepartment(@Param('id') id: string) {
    return await this.departmentService.deleteDepartment(id);
  }
}
