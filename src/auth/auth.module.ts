import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessStrategy } from 'src/strategy/access.strategy';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const accessSecret = config.get<string>('jwt.access.secret');
        const accessExpiresIn = config.get<string>('jwt.access.expiresIn');
        return {
          secret: accessSecret,
          signOptions: {
            expiresIn: accessExpiresIn as unknown as number,
          },
        };
      },
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessStrategy],
})
export class AuthModule {}
