import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject } from '@nestjs/common';
import { ScheduledOrdersService } from './scheduled-orders.service';
import { CreateScheduledOrderDto } from './dto/create-scheduled-order.dto';
import { UpdateScheduledOrderDto } from './dto/update-scheduled-order.dto';
import { FindAllScheduledDto } from './dto/findAllScheduled.dto';
import { CustomersService } from '../customers/customers.service';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { DriversService } from '../drivers/drivers.service';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { ViewScheduledOrderResponseDto } from './dto/response-dto/viewScheduledOrderResponse.dto';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { Roles } from 'src/common/decorators/roles.decorator';
import { OrderStateEnum } from 'src/common/enums/orderState';
import { REQUEST } from '@nestjs/core';
import { StartScheduledOrderDto } from './dto/startScheduledOrder.dto';



@Controller('scheduled-orders')
export class ScheduledOrdersController {
  constructor(
    private readonly scheduledOrdersService: ScheduledOrdersService,
    private readonly customersService : CustomersService,
    private readonly driversService : DriversService,
    @Inject(REQUEST) private readonly request: Request
  ) {}


  @UseGuards(AuthGuard,RolesGuard)
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Post('customer/getMyScheduledOrdersList')
  async getMyCustomerScheduledOrdersList(@Body() findAllScheduledDto:FindAllScheduledDto){
    const customer=await this.customersService.getCurrentCustomer();
    findAllScheduledDto.customerId=customer.id;
    findAllScheduledDto.state=OrderStateEnum.SCHEDULED

    const lang=this.request.headers['accept-language'] || 'en'
    const data=await this.scheduledOrdersService.findAll(findAllScheduledDto);
    const filterdDate=plainToInstance(ViewScheduledOrderResponseDto,data,{
          excludeExtraneousValues:true,
          context: { lang },
            } as ClassTransformOptions & { context?: any }
    )
    return {
      data:filterdDate,
      message:I18nKeys.successMessages.getListSuccess
    }
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.DRIVER)
  @Post('driver/getMyScheduledOrdersList')
  async getMyDriverScheduledOrdersList(@Body() findAllScheduledDto:FindAllScheduledDto){
    const driver=await this.driversService.getCurrentDriver();
    findAllScheduledDto.driverId=driver.id;
    findAllScheduledDto.state=OrderStateEnum.SCHEDULED

    const lang=this.request.headers['accept-language'] || 'en'
    const data=await this.scheduledOrdersService.findAll(findAllScheduledDto);
    // const filterdDate=plainToInstance(ViewScheduledOrderResponseDto,data.elements,{
    //       excludeExtraneousValues:true
    // })

    const filterdDate=plainToInstance(ViewScheduledOrderResponseDto,data,{
          excludeExtraneousValues:true,
          context: { lang },
            } as ClassTransformOptions & { context?: any }
    )
    return {
      data:filterdDate,
      message:I18nKeys.successMessages.getListSuccess
    }
  } 

  @Post('startScheduledOrder')
  async startScheduledOrder(@Body() startScheduledOrderDto:StartScheduledOrderDto){
    const data=await this.scheduledOrdersService.startScheduledOrder(startScheduledOrderDto);
    return {
      data:data,
      message:I18nKeys.successMessages.startScheduledOrderSuccess
    }
  }
}
