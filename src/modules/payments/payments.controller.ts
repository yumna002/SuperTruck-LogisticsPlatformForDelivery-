import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { getPaymentTypesListResponseDto } from './dto/response/getPaymentTypesListResponse.dto';
import { REQUEST } from '@nestjs/core';
import { GetDriverPaymentsDto } from './dto/getDriverPayments.dto';
import { PayOrderDto } from './dto/payOrder.dto';
import { UpdateProfitDto } from './dto/updateProfit.dto';
import { GetDriversPaymentsListDto } from './dto/getDriversPaymentsList.dto';
import { GetDriverPaymentsResponseDto } from './dto/response/getDriverPaymentsResponse.dto';



@UseGuards(AuthGuard,RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    @Inject(REQUEST) private readonly request : Request
  ) {}


  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE,RoleTypeEnum.CUSTOMER)
  @Get('getPaymentTypesList')
  async getPaymentTypesList(){
    const lang=this.request.headers['accept-language'] || 'en'
    const data=await this.paymentsService.findAll({});
    const filteredData=plainToInstance(getPaymentTypesListResponseDto,data,{
      excludeExtraneousValues:true,
      context: { lang },
        } as ClassTransformOptions & { context?: any }
    )
    return {
      data:filteredData,
      message:I18nKeys.successMessages.getListSuccess
    }
  }

  @Roles(RoleTypeEnum.DRIVER)
  @Get('driver/getMyPaymentDetails')
  async getMyPaymentDetails(){
    const data=await this.paymentsService.getMyPaymentDetails();
    return {
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE)
  @Post('getDriversPaymentsList')
  async getDriversPaymentsList(@Body() getDriversPaymentsListDto:GetDriversPaymentsListDto){
    const data=await this.paymentsService.getDriversPaymentsList(getDriversPaymentsListDto);
    return{
      data:data,
      message:I18nKeys.successMessages.getListSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE)
  @Post('getDriverPayments')
  async getDriverPayments(@Body() getDriverPaymentsDto:GetDriverPaymentsDto){
    const data=await this.paymentsService.getDriverPayments(getDriverPaymentsDto);
    const filteredOrdersData=plainToInstance(GetDriverPaymentsResponseDto,data.orders,{
      excludeExtraneousValues:true
    });
    return{
      data:{
        orders:filteredOrdersData,
        driverName:data.driverName,
        driverNumber:data.driverNumber
      },
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE)
  @Post('PayOrder')
  async payOrder(@Body() payOrderDto:PayOrderDto){
    const data=await this.paymentsService.payOrder(payOrderDto);
    return{
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE)
  @Post('adjustProfit')
  async adjustProfit(@Body() updateProfitDto:UpdateProfitDto){
    const data=await this.paymentsService.updateProfit(updateProfitDto);
    return {
      data:data,
      message:I18nKeys.successMessages.updateSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE)
  @Get('viewProfit')
  async viewProfit(){
    const profit=await this.paymentsService.getGeneralProfitPercentage();
    const data={
      profit:profit
    }
    return {
      data:data,
      message:I18nKeys.successMessages.success
    }
  }
}
