import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TokenService } from 'src/shared/utils/tokenFunctions';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/auth.constant';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { OTPService } from './OTP.service';
import { ConfigModule, ConfigService } from '@nestjs/config';



@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_TOKEN_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_TOKEN_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    /*JwtModule.register({
      global: true,
      secret: jwtConstants.jwtTokenSecret, 
      signOptions: { expiresIn: '1d' },
    }),*/
    UsersModule,
    WhatsappModule
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, OTPService],
  exports: [AuthService, TokenService, JwtModule]
})
export class AuthModule {}
