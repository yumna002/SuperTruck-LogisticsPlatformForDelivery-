import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { hashPassword } from 'src/shared/utils/hashingFunctions';
import { I18nService } from 'nestjs-i18n';
import { RegisterDto } from './dto/registerCustomer.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { UpdateAccessTokenDto } from './dto/updateAccessToken.dto';
import { RequestOTPDto } from './dto/requestOTP.dto';
import { VerifyCodeDto } from './dto/verifyCode.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UsersService } from '../users/users.service';
import { NotFoundError } from 'rxjs';
import { CheckIfFirstLoginDto } from './dto/checkIfFirstLogin.dto';
import { RoleTypeEnum } from 'src/common/enums/roleType';



@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly i18n: I18nService,
  ) {}


  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const data= await this.authService.login(loginDto);
    return {
      data: data,
      message: I18nKeys.successMessages.loginSuccess
    }
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER,RoleTypeEnum.DRIVER,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('logout')
  async logout() {
    const data=await this.authService.logout();
    return {
      data: data,
      message: I18nKeys.successMessages.logoutSuccess
    }
  }

  @Post('updateAccessToken')
  async updateAccessToken(@Body() updateAccessTokenDto:UpdateAccessTokenDto) {
    const data=await this.authService.updateAccessToken(updateAccessTokenDto);
    return {
      data: data,
      message: I18nKeys.successMessages.updateAccessTokenSuccess
    }
  }

  @Post('requestOTPRegister')
  async requestOtpRegister(@Body() requestOTPDto:RequestOTPDto){
    const data=await this.authService.requestOTP(requestOTPDto);
    return {
      data: data,
      message: I18nKeys.successMessages.requestOTPSuccess
    }
  }

  @Post('requestOTPLogin')
  async requestOtpLogin(@Body() requestOTPDto:RequestOTPDto){
    const user=await this.userService.getOneUserIfExist({phoneNumber:requestOTPDto.phoneNumber})
    const data=await this.authService.requestOTP(requestOTPDto);
    return {
      data: data,
      message: I18nKeys.successMessages.requestOTPSuccess
    }
  }

  @Post('verifyCodeRegister')
  async verifyCodeRegister(@Body() verifyCodeDto:VerifyCodeDto){
    const data=await this.authService.verifyCode(verifyCodeDto);
    return {
      data: data,
      message: I18nKeys.successMessages.verifyCodeSuccess
    }
  }

  @Post('verifyCodeLogin')
  async verifyCodeLogin(@Body() verifyCodeDto:VerifyCodeDto){
    await this.authService.verifyCode(verifyCodeDto)
    const user=await this.userService.getOneUserIfExist({phoneNumber:verifyCodeDto.phoneNumber});
    const data=await this.authService.getTokens(user.id,user.phoneNumber,user.role.name)
    return {
      data: data,
      message: I18nKeys.successMessages.verifyCodeSuccess
    }
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER,RoleTypeEnum.DRIVER,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('resetPassword')
  async resetPassword(@Body() resetPasswordDto:ResetPasswordDto){
    const data = await this.authService.resetPassword(resetPasswordDto);
    return {
      data:data,
      message:I18nKeys.successMessages.resetPasswordSuccess
    }
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER,RoleTypeEnum.DRIVER,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('changePassword')
  async changePassword(@Body() changePasswordDto:ChangePasswordDto){
    const data= await this.authService.changePassword(changePasswordDto);
    return {
      data:data,
      message:I18nKeys.successMessages.resetPasswordSuccess
    }
  }

  @Post('checkIfFirstLogin')
  async checkIfFirstLogin(@Body() checkIfFirstLoginDto:CheckIfFirstLoginDto){
    const data= await this.authService.checkIfFirstLogin(checkIfFirstLoginDto);
    return{
      data:data,
      message:I18nKeys.successMessages.success
    };
  }
}
