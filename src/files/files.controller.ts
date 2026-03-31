import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ForwardFileDto, forwardFileSchema } from './dto/forward-file.dto';
import { ActionFileDto, actionFileSchema } from './dto/action-file.dto';
import { ZodValidationPipe } from 'src/zod-validate/zod-validate.pipe';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('files')
@UseGuards(AuthGuard('access'))
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async upload(
    @Request() req,
    @Body() body: { name: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.filesService.upload(req.user.id, {
      name: body.name,
      file_uri: `/uploads/${file.filename}`,
    });
  }

  @Post('media')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-media-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      file_uri: `/uploads/${file.filename}`
    };
  }

  @Post(':id/forward')
  @HttpCode(HttpStatus.OK)
  async forward(
    @Request() req,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(forwardFileSchema)) dto: ForwardFileDto,
  ) {
    return await this.filesService.forward(req.user.id, id, dto);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  async approve(
    @Request() req,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(actionFileSchema)) dto: ActionFileDto,
  ) {
    return await this.filesService.approve(req.user.id, id, dto);
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  async reject(
    @Request() req,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(actionFileSchema)) dto: ActionFileDto,
  ) {
    return await this.filesService.reject(req.user.id, id, dto);
  }

  @Get('my-department')
  async getMyDepartmentFiles(@Request() req) {
    return await this.filesService.getMyDepartmentFiles(req.user.id);
  }

  @Get(':id')
  async getFileDetails(@Param('id') id: string) {
    return await this.filesService.getFileDetails(id);
  }

  @Get(':id/logs')
  async getFileLogs(@Param('id') id: string) {
    return await this.filesService.getFileLogs(id);
  }
}
