import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { TokenService } from 'src/shared/utils/tokenFunctions';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { OTPService } from './OTP.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: {};
  let mockTokenService: {};
  let mockJwtService: {};
  let mockOTPService: {};
  let mockWhatsappService: {};
  let mockconfigService={};
  let mockRequest: any;

  beforeEach(async () => {
    mockRequest = { userId: 1 };
    mockUsersService= {};
    mockTokenService= {};
    mockJwtService= {};
    mockOTPService= {};
    mockconfigService= {};
    mockWhatsappService= {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: OTPService, useValue: mockOTPService },
        { provide: ConfigService, useValue: mockconfigService },
        { provide: WhatsappService, useValue: mockWhatsappService },
        { provide: REQUEST, useValue: mockRequest, },
      ],
    }).compile();



    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
