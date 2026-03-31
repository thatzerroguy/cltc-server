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
import { NewsService } from './news.service';
import { ZodValidationPipe } from 'src/zod-validate/zod-validate.pipe';
import { CreateNewsDto, createNewsSchema } from './dto/create-news.dto';
import { UpdateNewsDto, updateNewsSchema } from './dto/update-news.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // Public endpoint (landing page): published only
  @Get()
  async getNews() {
    return await this.newsService.getPublishedNews();
  }

  // Admin endpoints (dashboard): SUPER_ADMIN only
  @UseGuards(AuthGuard('access'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Get('admin')
  async getAllNewsAdmin() {
    return await this.newsService.getNews();
  }

  @UseGuards(AuthGuard('access'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createNews(
    @Body(new ZodValidationPipe(createNewsSchema)) data: CreateNewsDto,
  ) {
    return await this.newsService.createNews(data);
  }

  @UseGuards(AuthGuard('access'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch(':id')
  async updateNews(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateNewsSchema)) data: UpdateNewsDto,
  ) {
    return await this.newsService.updateNews(id, data);
  }

  @UseGuards(AuthGuard('access'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @Delete(':id')
  async deleteNews(@Param('id') id: string) {
    return await this.newsService.deleteNews(id);
  }
}
