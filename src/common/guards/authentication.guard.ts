import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { use } from 'passport';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService
  ) {}
  
  async canActivate(context:ExecutionContext):Promise<boolean>{
    const request=context.switchToHttp().getRequest();
    const token=this.extractTokenFromHeader(request);
  
    if (!token){
      throw new UnauthorizedException('Invalid or expired token');
    }

    try{
      const payload=await this.jwtService.verifyAsync(token,{secret:this.configService.get<string>('JWT_TOKEN_SECRET')});
  
      const user=await this.usersService.findOne({id:payload.sub,isActive:1});
       
      if(!user){
        throw new UnauthorizedException('Invalid or expired token');
      }
  
      request['userId']=payload.sub;
      request['role']=payload.role;
    }
    catch{
      throw new UnauthorizedException('error in authentication');
    }
    return true;
  }
  
  private extractTokenFromHeader(request:Request):string|undefined{
    const [type,token]=request.headers.authorization?.split(' ')??[];
    return type==='Bearer'?token:undefined;
  }
}
