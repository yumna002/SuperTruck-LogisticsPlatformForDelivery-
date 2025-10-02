import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, Req } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { REQUEST } from '@nestjs/core';
import { UpdateDto } from './dto/update.dto';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { FindAllDto } from './dto/findAll.dto';
import { FindOneDto } from './dto/findOne.dto';
import { CreateDto } from './dto/create.dto';
import { SwitchMyOnlineStateDto } from './dto/swithMyOnlineState.dto';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { plainToInstance } from 'class-transformer';
import { TopTenRatedDto } from './dto/response-dto/TopTenRated.dto';



@UseGuards(AuthGuard,RolesGuard)
@Controller('drivers')
export class DriversController {
  constructor(
    private readonly driversService: DriversService,
    @Inject(REQUEST) private request: Request,
  ) {}


  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE)
  @Post('driverRegistration')
  async driverRegistration(@Body() createDto: CreateDto) {
    const data=await this.driversService.create(createDto);
    return {
      data: data,
      message: I18nKeys.successMessages.registrationSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('getDriversList')
  async getDriversList(@Body() findAllDto: FindAllDto) {
    const data=await this.driversService.findAll(findAllDto);
    return {
      data: data,
      message: I18nKeys.successMessages.getCustomersListSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('viewDriver')
  async viewDriver(@Body() findOneDto: FindOneDto){
    const data=await this.driversService.findOne(findOneDto);
    return {
      data:data,
      message:I18nKeys.successMessages.viewProfileSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.DRIVER)
  @Get('viewMyProfile')
  async viewMyProfile(){
    const data=await this.driversService.findOne({userId:this.request['userId']});
    return {
      data:data,
      message:I18nKeys.successMessages.viewProfileSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.DRIVER)
  @Post('editMyProfile')
  async editMyProfile(@Body() updateDto:UpdateDto){
    updateDto.id=(await this.driversService.getCurrentDriver()).id;
    const data=await this.driversService.update(updateDto);
    return {
      data:data,
      message:I18nKeys.successMessages.updateSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE)
  @Post('editDriver')
  async editDriver(@Body() updateDto:UpdateDto){
    console.log('id= ',updateDto)
    const data=await this.driversService.update(updateDto);
    return {
      data:data,
      message:I18nKeys.successMessages.updateSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.DRIVER)
  @Post('switchMyOnlineState')
  async switchMyOnlineState(@Body() switchMyOnlineStateDto:SwitchMyOnlineStateDto){
    const data=await this.driversService.switchMyOnlineState(switchMyOnlineStateDto);
    return {
      data:data,
      message:I18nKeys.successMessages.switchActiveStateSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE)
  @Get('getTopTenRatedDrivers')
  async getTopTenRatedDrivers(){
    const data=await this.driversService.getTopTenRatedDrivers();
    const filteredData=plainToInstance(TopTenRatedDto,data,{
      excludeExtraneousValues:true
    })
    return {
      data:filteredData,
      message:I18nKeys.successMessages.getListSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.CUSTOMER,RoleTypeEnum.DRIVER)
  @Get('getDriverSocketConnections')
  async getDriverSocketConnections(){
    const data=await this.driversService.getDriverSocketConnections();
    return{
      data:data,
      message:I18nKeys.successMessages.success
    }
  }
  
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.CUSTOMER,RoleTypeEnum.DRIVER)
  @Get('getGeoHash')
  async getGeoHash(){
    const data=await this.driversService.getGeoHash();
    return {
      data:data,
      message:I18nKeys.successMessages.success 
    }
  }
}
