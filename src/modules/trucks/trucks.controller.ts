import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { FindAllDto } from './dto/findAll.dto';
import { DriversService } from '../drivers/drivers.service';
import { UpdateDto } from './dto/update.dto';
import { CreateDto } from './dto/create.dto';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { FindOneDto } from './dto/findOne.dto';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { GetTruckOptionsResponseDto } from './dto/response/getTruckOptionsResponse.dto';
import { REQUEST } from '@nestjs/core';



@UseGuards(AuthGuard,RolesGuard)
@Controller('trucks')
export class TrucksController {
  constructor(
    private readonly trucksService: TrucksService,
    private readonly driversService: DriversService,
    @Inject(REQUEST) private readonly request:Request
  ) {}


  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE)
  @Post('addTruck')
  async addTruck(@Body() createDto:CreateDto){
    const data=await this.trucksService.create(createDto);
    return {
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.DRIVER)
  @Get('getMyTrucksList')
  async getMyTrucksList(@Body() findAllDto:FindAllDto){
    const driver=await this.driversService.getCurrentDriver();
    findAllDto.driverId=driver.id
    findAllDto.isActive=1;
    const data=await this.trucksService.findAll(findAllDto);
    return {
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('getDriverTrucksList')
  async getDriverTrucksList(@Body() findAllDto:FindAllDto){
    findAllDto.isActive=1;
    const data=await this.trucksService.findAll(findAllDto);
    return {
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE)
  @Post('delete')
  async deleteTruck(@Body() findOneDto:FindOneDto) {
    const data=await this.trucksService.delete(findOneDto);
    return {
      data: data,
      message: I18nKeys.successMessages.switchActiveStateSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE,RoleTypeEnum.DRIVER,RoleTypeEnum.CUSTOMER)
  @Get('getTruckOptions')
  async getTruckOptions(){
    const lang=this.request.headers['accept-language'] || 'en'
    const data=await this.trucksService.getTruckOptions();
    const filteredData=plainToInstance(GetTruckOptionsResponseDto,data,{
      excludeExtraneousValues:true,
      context: { lang },
        } as ClassTransformOptions & { context?: any }
    )
    return {
      data:filteredData,
      message:I18nKeys.successMessages.getListSuccess
    }
    
  }  
}
