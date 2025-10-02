import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { comparePasswords, hashPassword } from 'src/shared/utils/hashingFunctions';
import { UsersService } from '../users/users.service';
import { TokenService } from 'src/shared/utils/tokenFunctions';
import { REQUEST } from '@nestjs/core';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { JwtService } from '@nestjs/jwt';
import { UpdateAccessTokenDto } from './dto/updateAccessToken.dto';
import { RequestOTPDto } from './dto/requestOTP.dto';
import { VerifyCodeDto } from './dto/verifyCode.dto';
import { OTPService } from './OTP.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { hash } from 'bcrypt'
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CheckIfFirstLoginDto } from './dto/checkIfFirstLogin.dto';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private jwtService: JwtService,
    @Inject(REQUEST) private request: Request,
    private readonly otpService: OTPService,
    private readonly whatsappService: WhatsappService,
    private configService: ConfigService
  ) {}


  async login(loginDto: LoginDto) {
    const user=await this.userService.findOne({phoneNumber:loginDto.phoneNumber}); 
    if(!user){
      throw new UnauthorizedException(I18nKeys.exceptionMessages.unauthorizedException);
    }

    if(loginDto.userType!=user.userType){
      throw new ForbiddenException(I18nKeys.exceptionMessages.forbiddenException);
    }

    if(!await comparePasswords(loginDto.password,user.password)){
      throw new UnauthorizedException(I18nKeys.exceptionMessages.unauthorizedException);
    }

    return await this.getTokens(user.id,user.phoneNumber,user.role.name);
  }

  async logout() {
    const cur_user = await this.userService.getCurrentUser();

    this.userService.update({id:cur_user.id,refreshToken:'#'});

    return {};
  }

  async getTokens(userId:number, userPhoneNumber:string, role:string) {
    const {accessToken,refreshToken}=await this.tokenService.generateTokens(
      userId,
      userPhoneNumber,
      role
    );

    const hashedRefreshToken=await this.tokenService.hashRefreshToken(refreshToken);

    await this.userService.update({id:userId,refreshToken:hashedRefreshToken});
    
    return {accessToken:accessToken, refreshToken:refreshToken};
  }

  async verifyRefreshToken(refreshToken:string):Promise<User> {
    //it verify refresh token then return the user
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('JWT_TOKEN_SECRET'),
    });

    const user = await this.userService.findOne({id:payload.sub});
    if(!user){
      throw new UnauthorizedException(I18nKeys.exceptionMessages.unauthorizedException);
    }

    const isValid =await this.tokenService.compareWithHashedRefreshToken(refreshToken,user.refreshToken);
    if(!isValid){
      throw new UnauthorizedException(I18nKeys.exceptionMessages.unauthorizedException);
    }

    return user;
  }

  async updateAccessToken(updateAccessTokenDto:UpdateAccessTokenDto) {
    const user =await this.verifyRefreshToken(updateAccessTokenDto.refreshToken);

    const newAccessToken=await this.tokenService.generateAccessToken(
      user.id,
      user.phoneNumber,
      user.role.name
    );

    return { newAccessToken:newAccessToken };
  }

  async requestOTP(requestOTPDto:RequestOTPDto) {
    //generate otp
    const otp=this.otpService.generateOTP(requestOTPDto);

    console.log('otp',otp);

    //send otp via whatsapp
    //here I have the id fixed as number1 this isn't very good
    const recieverNumber=requestOTPDto.phoneNumber.slice(1);
    //await this.whatsappService.sendMessage({id:'number1',recieverNumber:recieverNumber,message:otp});

    //store otp
    this.otpService.storeOTP({phoneNumber:requestOTPDto.phoneNumber,code:otp});

    return {};
  }

  async verifyCode(verifyCodeDto:VerifyCodeDto) {
    //check if the phoneNume exists in user table
    const user=await this.userService.findOne({phoneNumber:verifyCodeDto.phoneNumber});
    if(!user){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }

    const otp=this.otpService.getOTP({phoneNumber:verifyCodeDto.phoneNumber});

    if(verifyCodeDto.code!==otp){
      throw new BadRequestException("invalid OTP")
    }

    return {};
  }

  async resetPassword(resetPasswordDto:ResetPasswordDto) {
    const cur_user = await this.userService.getCurrentUser();

    const hashedPassword=await hashPassword(resetPasswordDto.password);
    await this.userService.update({id:cur_user.id,password:hashedPassword});

    return {};
  }

  async changePassword(changePasswordDto:ChangePasswordDto) {
    const cur_user = await this.userService.getCurrentUser();

    //check if the sent password is correct
    if(!await comparePasswords(changePasswordDto.oldPassword,cur_user.password)){
      throw new BadRequestException(I18nKeys.exceptionMessages.wrongPasswordException)
    }

    //change the password
    const hashedPassword=await hashPassword(changePasswordDto.newPassword)
    await this.userService.update({id:cur_user.id,password:hashedPassword})

    return {};
  }

  async checkIfFirstLogin(checkIfFirstLoginDto:CheckIfFirstLoginDto):Promise<Boolean> {
    const user=await this.userService.getOneUserIfExist({phoneNumber:checkIfFirstLoginDto.phoneNumber});

    if(user.password.length===0){
      await this.requestOTP({phoneNumber:checkIfFirstLoginDto.phoneNumber});
      return true;
    }
    else{
      return false;
    }
  }
}
