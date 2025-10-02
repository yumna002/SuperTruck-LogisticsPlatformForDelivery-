import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Inject } from '@nestjs/common';
import { ClosedOrdersService } from './closed-orders.service';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { FindAllClosedDto } from './dto/findAllClosed.dto';
import { CustomersService } from '../customers/customers.service';
import { OrderStateEnum } from 'src/common/enums/orderState';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { ViewCloseOrderResponseDto } from './dto/response-dto/viewClosedOrderResponse.dto';
import { DriversService } from '../drivers/drivers.service';
import { LanguageInterceptor } from 'src/common/interceptors/language.interceptor';
import { REQUEST } from '@nestjs/core';



@UseGuards(AuthGuard,RolesGuard)  
//@UseInterceptors(LanguageInterceptor)
@Controller('closed-orders')
export class ClosedOrdersController {
  constructor(
    private readonly closedOrdersService: ClosedOrdersService,
    private readonly customersService : CustomersService,
    private readonly driversService : DriversService,
    @Inject(REQUEST) private readonly request: Request
  ) {}


  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Post('customer/getMyClosedOrdersList')
  async getMyCustomerClosedOrdersList(@Body() findAllClosedDto:FindAllClosedDto) {
    const customer=await this.customersService.getCurrentCustomer();
    findAllClosedDto.customerId=customer.id;
    findAllClosedDto.state=OrderStateEnum.CLOSED;
    const data=await this.closedOrdersService.findAll(findAllClosedDto);

    // const filteredData=plainToInstance(ViewCloseOrderResponseDto,data.elements,{
    //   excludeExtraneousValues:true
    // })

    const lang=this.request.headers['accept-language'] || 'en';

    const filteredData=plainToInstance(ViewCloseOrderResponseDto,data,{
        excludeExtraneousValues: true,
        context: { lang },
      } as ClassTransformOptions & { context?: any }
    )
    
    return {
      data: filteredData,
      message: I18nKeys.successMessages.getListSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.DRIVER)
  @Post('driver/getMyClosedOrdersList')
  async getMyDriverOrdersList(@Body() findAllClosedDto:FindAllClosedDto) {
    const driver=await this.driversService.getCurrentDriver();
    findAllClosedDto.driverId=driver.id;
    findAllClosedDto.state=OrderStateEnum.CLOSED;

    const lang=this.request.headers['accept-language'] || 'en';
    const data=await this.closedOrdersService.findAll(findAllClosedDto);

    // const filteredData=plainToInstance(ViewCloseOrderResponseDto,data.elements,{
    //   excludeExtraneousValues:true
    // })

    const filteredData=plainToInstance(ViewCloseOrderResponseDto,data,{
      excludeExtraneousValues:true,
        context: { lang },
      } as ClassTransformOptions & { context?: any }
    )
    
    return {
      data: filteredData,
      message: I18nKeys.successMessages.getListSuccess
    }
  }

  @Roles(RoleTypeEnum.CUSTOMER)
  @Get('customer/getLastTransferOrder')
  async getLastTransferOrder(){
    const customer=await this.customersService.getCurrentCustomer();
    const lastClosedOrder= await this.closedOrdersService.getLastTransferOrder({customerId:customer.id});

    let filteredData={};
    if(lastClosedOrder){
      const data=await this.closedOrdersService.findOne({id:lastClosedOrder?.orderId})
      filteredData=plainToInstance(ViewCloseOrderResponseDto,data,{
        excludeExtraneousValues:true
      })
    }

    return {
      data:filteredData,
      message:I18nKeys.successMessages.success
    }
  }
}
