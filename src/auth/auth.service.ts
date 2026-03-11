import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { LoginResponse } from 'src/interfaces/auth.interface';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { AuthPayLoad, RefreshTokenPayload } from 'src/types/auth-payload';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: DatabaseService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(data: LoginDto): Promise<LoginResponse> {
    try {
      // Check if user exists
      const user = await this.prisma.user.findFirst({
        where: { username: data.username },
        include: {
          profile: true,
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }

      // Generate access and refresh tokens
      const payload = { sub: user.id, username: user.username };
      const refreshPayload = { sub: user.id };

      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(refreshPayload);

      this.logger.log(`User ${user.username} logged in successfully`);

      return {
        message: 'User Logged in successfully',
        status: HttpStatus.FOUND,
        id: user.id,
        username: user.username,
        first_name: user.profile?.first_name,
        last_name: user.profile?.last_name,
        email: user.profile?.email,
        role: user.role,
        sub_role: user.sub_role,
        department_id: user.department_id,
        access_token: accessToken,
        refresh_token: refreshToken,
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

  private generateAccessToken(payload: AuthPayLoad): string {
    return this.jwt.sign(payload);
  }

  public generateRefreshToken(payload: RefreshTokenPayload): string {
    const refreshSecret = this.config.get<string>('jwt.refresh.secret');
    const refreshExpiresIn = this.config.get<number>('jwt.refresh.expiresIn');

    if (!refreshSecret || !refreshExpiresIn) {
      this.logger.error('JWT refresh secret or expires in not found in config');
      throw new HttpException(
        'JWT refresh secret or expires in not found in config',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.jwt.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });
  }
}
