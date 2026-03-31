import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateMagazineDto } from './dto/create-magazine.dto';

@Injectable()
export class MagazinesService {
  constructor(private readonly prisma: DatabaseService) {}

  async createMagazine(data: CreateMagazineDto) {
    try {
      const magazine = await this.prisma.magazine.create({
        data: {
          title: data.title,
          content: data.content,
          main_image_uri: data.main_image_uri,
          images: data.images,
          status: data.status,
          published_at: data.published_at,
        },
      });

      return {
        id: magazine.id,
        title: magazine.title,
        content: magazine.content,
        main_image_uri: magazine.main_image_uri,
        images: magazine.images,
        status: magazine.status,
        published_at: magazine.published_at,
      };
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

  async getAllMagazines() {
    try {
      const magazines = await this.prisma.magazine.findMany();
      return magazines.map((magazine) => ({
        id: magazine.id,
        title: magazine.title,
        content: magazine.content,
        main_image_uri: magazine.main_image_uri,
        images: magazine.images,
        status: magazine.status,
        published_at: magazine.published_at,
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

  async getMagazineById(id: string) {
    try {
      const magazine = await this.prisma.magazine.findUnique({
        where: { id },
      });
      if (!magazine) {
        throw new HttpException('Magazine not found', HttpStatus.NOT_FOUND);
      }
      return {
        id: magazine.id,
        title: magazine.title,
        content: magazine.content,
        main_image_uri: magazine.main_image_uri,
        images: magazine.images,
        status: magazine.status,
        published_at: magazine.published_at,
      };
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

  async updateMagazine(id: string, data: CreateMagazineDto) {
    try {
      const magazine = await this.prisma.magazine.findUnique({
        where: { id },
      });
      if (!magazine) {
        throw new HttpException('Magazine not found', HttpStatus.NOT_FOUND);
      }
      const updatedMagazine = await this.prisma.magazine.update({
        where: { id },
        data,
      });
      return {
        id: updatedMagazine.id,
        title: updatedMagazine.title,
        content: updatedMagazine.content,
        main_image_uri: updatedMagazine.main_image_uri,
        images: updatedMagazine.images,
        status: updatedMagazine.status,
        published_at: updatedMagazine.published_at,
      };
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

  async deleteMagazine(id: string) {
    try {
      const magazine = await this.prisma.magazine.findUnique({
        where: { id },
      });
      if (!magazine) {
        throw new HttpException('Magazine not found', HttpStatus.NOT_FOUND);
      }
      await this.prisma.magazine.delete({
        where: { id },
      });
      return {
        message: 'Magazine deleted successfully',
      };
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
}
