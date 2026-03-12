import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { News } from 'src/interfaces/news.interface';
import { CreateNewsDto } from './dto/create-news.dto';
import { $Enums } from 'generated/prisma/browser';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  private readonly logger: Logger = new Logger(NewsService.name);

  constructor(private readonly prisma: DatabaseService) {}

  /**
   * @author thatzerroguy
   * @description Returns an array of news articles.
   * @returns Promise<News[]>
   */
  async getNews(): Promise<News[]> {
    try {
      const news = await this.prisma.news.findMany();
      return news.map((item) => {
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          excerpt: item.excerpt,
          author_id: item.author_id,
          main_image_uri: item.main_image_uri,
          images: item.images,
          status: item.status,
          published_at: item.published_at,
        };
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * @author thatzerroguy
   * @description Creates a new news article
   * @param data - CreateNewsDto
   * @returns Promise<News>
   */
  async createNews(data: CreateNewsDto) {
    try {
      const news = await this.prisma.news.create({
        data: {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          author_id: data.author_id,
          main_image_uri: data.main_image_uri,
          images: data.images,
          status: data.status as $Enums.NewsStatus,
          published_at: data.published_at,
        },
      });
      return {
        id: news.id,
        title: news.title,
        content: news.content,
        excerpt: news.excerpt,
        author_id: news.author_id,
        main_image_uri: news.main_image_uri,
        images: news.images,
        status: news.status,
        published_at: news.published_at,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateNews(id: string, data: UpdateNewsDto) {
    try {
      // Check if news exists
      const news = await this.prisma.news.findUnique({
        where: {
          id: id,
        },
      });
      if (!news) {
        throw new HttpException('News not found', HttpStatus.NOT_FOUND);
      }

      // Update news
      const updatedNews = await this.prisma.news.update({
        where: {
          id: id,
        },
        data: {
          ...data,
        },
      });

      return {
        id: updatedNews.id,
        title: updatedNews.title,
        content: updatedNews.content,
        excerpt: updatedNews.excerpt,
        author_id: updatedNews.author_id,
        main_image_uri: updatedNews.main_image_uri,
        images: updatedNews.images,
        status: updatedNews.status,
        published_at: updatedNews.published_at,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
