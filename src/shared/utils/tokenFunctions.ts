import { JwtService } from '@nestjs/jwt'; 
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'; 
import { comparePasswords, hashPassword } from './hashingFunctions';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(userId:number,phoneNumber:string,role:string){
    const payload={sub:userId,phoneNumber,role};
    const accessToken=await this.generateAccessToken(userId,phoneNumber,role);
    const refreshToken=await this.generateRefreshToken(userId,phoneNumber,role);
    
    return {accessToken,refreshToken};
  }

  async generateRefreshToken(userId:number,phoneNumber:string,role:string):Promise<string>{
    const payload={sub:userId,phoneNumber,role};
    const refreshToken=this.jwtService.sign(payload,{
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    });

    return refreshToken;
  }

  async generateAccessToken(userId:number,phoneNumber:string,role:string):Promise<string>{
    const payload={sub:userId,phoneNumber,role};
    const accessToken=this.jwtService.sign(payload,{
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    });

    return accessToken;
  }

  async hashRefreshToken(refreshToken:string):Promise<string>{
    return await hashPassword(refreshToken);
  }

  async compareWithHashedRefreshToken(plainToken:string,hashedToken:string):Promise<boolean>{
    return comparePasswords(plainToken,hashedToken);
  }
}
