import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from 'src/database/database.service';

interface JwtPayload {
  sub: string;
  username: string;
}
@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: DatabaseService,
  ) {
    const accessTokenSecret = config.get<string>('jwt.access.secret');
    if (!accessTokenSecret) {
      new Logger(AccessStrategy.name).error('JWT access secret is not defined');
      throw new Error('JWT access secret is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: accessTokenSecret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    return {
      ...result,
      role: result.role.toUpperCase(),
      sub_role: result.sub_role.toUpperCase(),
    };
  }
}
