import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseInterceptors } from '@nestjs/common';
import { TryService } from './try.service';
import { CreateTryDto } from './dto/create-try.dto';
import { isNumber } from 'class-validator';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { UsersService } from 'src/modules/users/users.service';

//@UseInterceptors(AnyFilesInterceptor())
@Controller('try')
export class TryController {
  constructor(
    private readonly tryService: TryService,
  ){}

  @Post('test')
  async create(@Body() body: CreateTryDto) {
    //return await this.usersService.findOne({id:1});
    //throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    const pass='';
    console.log('pass= ',pass);
    console.log(pass.length);
    //return this.tryService.create(body);
  }

}
