import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nKeys } from '../i18n/i18n-keys';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const request=context.switchToHttp().getRequest();
    const token=this.extractTokenFromHeader(request);
  
    if (!token){
      throw new UnauthorizedException('Invalid or expired token');
    }

    try{
      const payload=await this.jwtService.verifyAsync(token,{secret:this.configService.get<string>('JWT_TOKEN_SECRET')});

      const role=payload.role;

      if (!role || !requiredRoles.includes(role)) {
        throw new ForbiddenException(I18nKeys.exceptionMessages.forbiddenException);
      }
    }
    catch{
      throw new UnauthorizedException('error in authorization');
    }
    return true;
  }

  private extractTokenFromHeader(request:Request):string|undefined{
    const [type,token]=request.headers.authorization?.split(' ')??[];
    return type==='Bearer'?token:undefined;
  }
}
