import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { FindOneDto } from './dto/findOne.dto';
import { I18nService } from 'nestjs-i18n';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { FindAllDto } from './dto/findAll.dto';
import { REQUEST } from '@nestjs/core';
import { CreateDto } from './dto/create.dto';
import { CustomersService } from '../customers/customers.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { RoleTypeEnum } from 'src/common/enums/roleType';



@UseGuards(AuthGuard,RolesGuard)
@Controller('addresses')
export class AddressesController {
  constructor(
    private readonly addressesService: AddressesService,
    private readonly customersService: CustomersService,
    private readonly i18n: I18nService,
    @Inject(REQUEST) private request: Request,
  ) {}


  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Post('create')
  async create(@Body() createDto: CreateDto) {
    createDto.customerId=(await this.customersService.getCurrentCustomer()).id;
    const data=await this.addressesService.create(createDto);
    return {
      data:data,
      message:I18nKeys.successMessages.createAddressSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Get('getMyAddressesList')
  async getMyAddressesList(@Body() findAllDto:FindAllDto) {
    findAllDto.isActive=1;
    findAllDto.customerId=(await this.customersService.getCurrentCustomer()).id;
    const data=await this.addressesService.findAll(findAllDto);
    return{
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Post('viewAddress')
  async viewAddress(@Body() findOneDto:FindOneDto) {
    const data=await  this.addressesService.findOne(findOneDto);
    return {
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Post('deleteAddress')
  async deleteAddress(@Body() findOneDto:FindOneDto){
    const data=await this.addressesService.delete(findOneDto);
    return {
      data:data,
      message:I18nKeys.successMessages.deleteSuccess
    }
  }
}
