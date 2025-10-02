import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { I18nService } from 'nestjs-i18n';
import { FindAllDto } from './dto/findAll.dto';
import { UpdateDto } from './dto/update.dto';
import { UsersService } from '../users/users.service';
import { REQUEST } from '@nestjs/core';
import { CreateDto } from './dto/create.dto';
import { FindOneCustomerWithAddressesDto } from './dto/findOneCustomerWithAddresses.dto';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleTypeEnum } from 'src/common/enums/roleType';



@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    @Inject(REQUEST) private request: Request,
    private readonly i18n: I18nService,
  ) {}
 
  
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('getCustomersList')
  async getCustomersList(@Body() findAllDto: FindAllDto) {
    const data=await this.customersService.findAll(findAllDto);
    return {
      data: data,
      message: I18nKeys.successMessages.getCustomersListSuccess
    }
  }

  @Post('register')
  async register(@Body() createDto:CreateDto){
    const data=await this.customersService.create(createDto);
    return {
      data:data,
      message:I18nKeys.successMessages.createCustomerSuccess
    }
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Get('viewMyProfile')
  async viewMyProfile(){
    const data=await this.customersService.findOneCustomerWithAddresses({id:this.request['userId']});
    return {
      data:data,
      message:I18nKeys.successMessages.viewProfileSuccess
    }
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Post('editMyProfile')
  async editMyProfile(@Body() updateDto:UpdateDto){
    updateDto.id=(await this.customersService.getCurrentCustomer()).id;
    const data=await this.customersService.update(updateDto);
    return {
      data:data,
      message:I18nKeys.successMessages.updateSuccess
    }
  }

   
}
