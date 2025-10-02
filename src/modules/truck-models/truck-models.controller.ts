import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Inject } from '@nestjs/common';
import { TruckModelsService } from './truck-models.service';
import { CreateTruckModelDto } from './dto/create-truck-model.dto';
import { UpdateTruckModelDto } from './dto/update-truck-model.dto';
import { I18nService } from 'nestjs-i18n';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { FileInterceptor } from '@nestjs/platform-express';
import { generateMulterConfig } from 'src/config/multerConfig';
import { FindAllDto } from './dto/findAll.dto';
import { FindOneDto } from './dto/findOne.dto';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { TrucksService } from '../trucks/trucks.service';
import { GetFuelTypesResponseDto } from './dto/response/getFuelTypesResponse.dto';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { REQUEST } from '@nestjs/core';
import { GetSizeTypesResponseDto } from './dto/response/getSizeTypesResponse.dto';
import { GetVehicleTypesResponseDto } from './dto/response/getVehicleTypesResponse.dto';



@UseGuards(AuthGuard,RolesGuard)
@Controller('truck-models')
export class TruckModelsController {
  constructor(
    private readonly truckModelsService: TruckModelsService,
    private readonly i18n: I18nService,
    @Inject(REQUEST) private readonly request:Request
  ) {}


  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE)
  @Post('createTruckModel')
  @UseInterceptors(FileInterceptor('photo',generateMulterConfig('truckModelsImages')))
  async createTruckModel(
    @Body() createTruckModelDto: CreateTruckModelDto,
    @UploadedFile() file:Express.Multer.File
  ) {
    if(file){
      createTruckModelDto.photo=file.path
    }
    const data=await this.truckModelsService.createTruckModel(createTruckModelDto);
    return {
      data:data,
      message:I18nKeys.successMessages.createTruckModelSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE)
  @Post('updateTruckModel')
  @UseInterceptors(FileInterceptor('photo',generateMulterConfig('truckModelsImages')))
  async updateTruckModel(@Body() updateTruckModelDto:UpdateTruckModelDto,@UploadedFile() file:Express.Multer.File){
    if(file){
      updateTruckModelDto.photo=file.path
    }
    const data=await this.truckModelsService.updateTruckModel(updateTruckModelDto);
    return {
      data:data,
      message:I18nKeys.successMessages.updateSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('getTruckModelsList')
  async getTruckModelsList(@Body() findAllDto:FindAllDto){
    const data=await this.truckModelsService.findAll(findAllDto);
    return {
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('viewTruckModel')
  async viewTruckModel(@Body() findOneDto:FindOneDto){
    const data=await this.truckModelsService.findOne(findOneDto);
    return {
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE)
  @Post('deleteTruckModel')
  async deleteTruckModel(@Body() findOneDto:FindOneDto){
    const data=await this.truckModelsService.deleteTruckModel(findOneDto);
    return{
      data:data,
      message:I18nKeys.successMessages.deleteSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE,RoleTypeEnum.CUSTOMER,RoleTypeEnum.DRIVER)
  @Get('getFuelTypes')
  async getFuelTypes(){

    const lang=this.request.headers['accept-language'] || 'en'
    const data=await this.truckModelsService.getFuelTypes();
    const filteredData=plainToInstance(GetFuelTypesResponseDto,data,{
      excludeExtraneousValues:true,
      context: { lang },
        } as ClassTransformOptions & { context?: any }
    )
    return {
      data:filteredData,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE,RoleTypeEnum.CUSTOMER,RoleTypeEnum.DRIVER)
  @Get('getSizeTypes')
  async getSizeTypes(){

    const lang=this.request.headers['accept-language'] || 'en'
    const data=await this.truckModelsService.getSizeTypes();
    const filteredData=plainToInstance(GetSizeTypesResponseDto,data,{
      excludeExtraneousValues:true,
      context: { lang },
        } as ClassTransformOptions & { context?: any }
    )
    return {
      data:filteredData,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE,RoleTypeEnum.CUSTOMER,RoleTypeEnum.DRIVER)
  @Get('getVehicleTypes')
  async getVehicleTypes(){

    const lang=this.request.headers['accept-language'] || 'en'
    const data=await this.truckModelsService.getVehicleTypes();
    const filteredData=plainToInstance(GetVehicleTypesResponseDto,data,{
      excludeExtraneousValues:true,
      context: { lang },
        } as ClassTransformOptions & { context?: any }
    )
    return {
      data:filteredData,
      message:I18nKeys.successMessages.success
    }
  }
}
