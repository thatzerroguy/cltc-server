import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { MagazinesService } from './magazines.service';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guard/roles.guard';
import { SubRolesGuard } from 'src/guard/sub-roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('magazines')
export class MagazinesController {
  constructor(private readonly magazinesService: MagazinesService) {}

  @UseGuards(AuthGuard('access'), RolesGuard, SubRolesGuard)
  @Roles('SUPER_ADMIN')
  @Post()
  async createMagazine(@Body() data: CreateMagazineDto) {
    return await this.magazinesService.createMagazine(data);
  }

  @Get()
  async getAllMagazines() {
    return await this.magazinesService.getAllMagazines();
  }

  @Get(':id')
  async getMagazineById(@Param('id') id: string) {
    return await this.magazinesService.getMagazineById(id);
  }

  @UseGuards(AuthGuard('access'), RolesGuard, SubRolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch(':id')
  async updateMagazine(
    @Param('id') id: string,
    @Body() data: CreateMagazineDto,
  ) {
    return await this.magazinesService.updateMagazine(id, data);
  }

  @UseGuards(AuthGuard('access'), RolesGuard, SubRolesGuard)
  @Roles('SUPER_ADMIN')
  @Delete(':id')
  async deleteMagazine(@Param('id') id: string) {
    return await this.magazinesService.deleteMagazine(id);
  }
}
