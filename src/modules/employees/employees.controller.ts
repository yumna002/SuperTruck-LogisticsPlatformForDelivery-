import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { REQUEST } from '@nestjs/core';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateDto } from './dto/create.dto';
import { FindAllDto } from './dto/findAll.dto';
import { FindOneDto } from './dto/findOne.dto';
import { UpdateDto } from './dto/update.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';



@UseGuards(AuthGuard,RolesGuard)
@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
    @Inject(REQUEST) private request: Request,
  ) {}


  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE)
  @Post('employeeRegistration')
  async employeeRegistration(@Body() createDto: CreateDto) {
    const data=await this.employeesService.create(createDto);
    return {
      data: data,
      message: I18nKeys.successMessages.registrationSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE)
  @Post('getEmployeesList')
  async getEmployeesList(@Body() findAllDto: FindAllDto) {
    const data=await this.employeesService.findAll(findAllDto);
    return {
      data: data,
      message: I18nKeys.successMessages.getCustomersListSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE)
  @Post('viewEmployee')
  async viewEmployee(@Body() findOneDto: FindOneDto){
    const data=await this.employeesService.findOne(findOneDto);
    return {
      data:data,
      message:I18nKeys.successMessages.viewProfileSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Get('viewMyProfile')
  async viewMyProfile(){
    const data=await this.employeesService.findOne({userId:this.request['userId']});
    return {
      data:data,
      message:I18nKeys.successMessages.viewProfileSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('editMyProfile')
  async editMyProfile(@Body() updateDto:UpdateDto){
    updateDto.id=(await this.employeesService.getCurrentEmployee()).id;
    const data=await this.employeesService.update(updateDto);
    return {
      data:data,
      message:I18nKeys.successMessages.updateSuccess
    }
  }
}
