import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Inject } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { CreateDto } from './dto/create.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { UpdateDto } from './dto/update.dto';
import { FindOneDto } from './dto/findOne.dto';
import { FindAllDto } from './dto/findAll.dto';
import { CustomersService } from '../customers/customers.service';
import { OrderStateEnum } from 'src/common/enums/orderState';
import { ClosedOrdersService } from '../closed-orders/closed-orders.service';
import { ProcessingOrdersService } from '../processing-orders/processing-orders.service';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { GetRecentRequestsResponseDto } from './dto/response-dto/getRecentRequestsResponse.dto';
import { ViewOrderResponseDto } from './dto/response-dto/viewOrderResponse.dto';
import { ViewCloseOrderResponseDto } from '../closed-orders/dto/response-dto/viewClosedOrderResponse.dto';
import { ViewProcessingOrderResponseDto } from '../processing-orders/dto/response-dto/viewProcessingOrderResponse.dto';
import { ConfirmOrderDto } from './dto/confirmOrder.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { generateMulterConfig } from 'src/config/multerConfig';
import { CloseOrderDto } from './dto/closeOrder.dto';
import { UpdateOrderResponseDto } from './dto/response-dto/updateOrderResponse.dto';
import { ViewScheduledOrderResponseDto } from '../scheduled-orders/dto/response-dto/viewScheduledOrderResponse.dto';
import { ScheduledOrdersService } from '../scheduled-orders/scheduled-orders.service';
import { REQUEST } from '@nestjs/core';



@UseGuards(AuthGuard,RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly customersService: CustomersService,
    private readonly closedOrdersService: ClosedOrdersService,
    private readonly processingOrdersService: ProcessingOrdersService,
    private readonly scheduledOrdersService : ScheduledOrdersService,
    @Inject(REQUEST) private readonly request:Request
  ) {}


  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Post('createOrder')
  async createOrder(@Body() createDto:CreateDto){
    const data=await this.ordersService.create(createDto);
    return {
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Post('updateOrder')
  @UseInterceptors(FilesInterceptor('photos', 10, generateMulterConfig('orderImages'))) //10 is the max number of photos allowed
  async updateOrder(@Body() updateDto: UpdateDto,@UploadedFiles() files: Express.Multer.File[],){
    if (files?.length) {
      updateDto.photos = files.map(file => file.path); //store file paths
    }

    const lang=this.request.headers['accept-language'] || 'en';
    const data=await this.ordersService.update(updateDto);
    const filteredData=plainToInstance(UpdateOrderResponseDto,data,{
      excludeExtraneousValues:true,
        context: { lang },
        } as ClassTransformOptions & { context?: any }
    )

    return {
      data: filteredData,
      message:I18nKeys.successMessages.updateSuccess
    }
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('getOrdersList')
  async getCustomersList(@Body() findAllDto: FindAllDto) {
    const data=await this.ordersService.findAll(findAllDto);
    return {
      data: data,
      message: I18nKeys.successMessages.getListSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.DRIVER,RoleTypeEnum.CUSTOMER,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('viewOrder')
  async viewDriver(@Body() findOneDto: FindOneDto){
    let order=await this.ordersService.findOne(findOneDto);
    const lang=this.request.headers['accept-language'] || 'en'
    
    let filteredData;
    if(order && order.state==OrderStateEnum.CLOSED){
      const data=await this.closedOrdersService.findOne(findOneDto)
      filteredData=plainToInstance(ViewCloseOrderResponseDto,data,{
          excludeExtraneousValues: true,
          context: { lang },
        } as ClassTransformOptions & { context?: any }
      )
    }
    else if(order && order.state==OrderStateEnum.PROCESSING){
      const data=await this.processingOrdersService.findOne(findOneDto)
      filteredData=plainToInstance(ViewProcessingOrderResponseDto,data,{
        excludeExtraneousValues:true,
        context: { lang },
        } as ClassTransformOptions & { context?: any }
      )
    }
    else if(order && order.state==OrderStateEnum.SCHEDULED){
      const data=await this.scheduledOrdersService.findOne(findOneDto)
      filteredData=plainToInstance(ViewScheduledOrderResponseDto,data,{
        excludeExtraneousValues:true,
        context: { lang },
        } as ClassTransformOptions & { context?: any }
      )
    }
    else{
      const data=order;
      filteredData=plainToInstance(ViewOrderResponseDto,data,{
        excludeExtraneousValues:true,
        context: { lang },
        } as ClassTransformOptions & { context?: any }
      )
    }

    return {
      data: filteredData,
      message:I18nKeys.successMessages.success
    }
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Post('getMyDraftOrdersList')
  async getMyDraftOrdersList(@Body() findAllDto: FindAllDto) {
    const customer=await this.customersService.getCurrentCustomer();
    findAllDto.customerId=customer.id;
    findAllDto.state=OrderStateEnum.DRAFT;
    
    const lang=this.request.headers['accept-language'] || 'en'
    const data=await this.ordersService.findAll(findAllDto);
    // const filteredData=plainToInstance(ViewOrderResponseDto,data.elements,{
    //   excludeExtraneousValues:true
    // })

    const filteredData=plainToInstance(ViewOrderResponseDto,data,{
      excludeExtraneousValues:true,
        context: { lang },
        } as ClassTransformOptions & { context?: any }
    )

    return {
      data: filteredData,
      message: I18nKeys.successMessages.getListSuccess
    }
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Post('deleteDraftOrder')
  async deleteDraftOrder(@Body() findOneDto: FindOneDto) {
    const data=await this.ordersService.delete(findOneDto);
    return {
      data: data,
      message: I18nKeys.successMessages.deleteSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('getRecentRequests')
  async getRecentRequests(@Body() findAllDto:FindAllDto) {

    const lang=this.request.headers['accept-language'] || 'en'
    const data=await this.ordersService.findAll(findAllDto);
    // const filteredData=plainToInstance(GetRecentRequestsResponseDto,data.elements, {
    //   excludeExtraneousValues: true,
    // });

    //remove draft orders
    const nonDraftOrders = data.filter(order => order.state !== OrderStateEnum.DRAFT);

    const filteredData=plainToInstance(GetRecentRequestsResponseDto,nonDraftOrders, {
      excludeExtraneousValues: true,
        context: { lang },
        } as ClassTransformOptions & { context?: any }
    )

    return {
      data: filteredData,
      message: I18nKeys.successMessages.getListSuccess
    }
    }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('getPendingRequests')
  async getPendingRequests(@Body() findAllDto:FindAllDto) {
    findAllDto.state=OrderStateEnum.PENDING;

    const lang=this.request.headers['accept-language'] || 'en'
    const data=await this.ordersService.findAll(findAllDto);
    // const filteredData=plainToInstance(GetRecentRequestsResponseDto,data.elements, {
    //   excludeExtraneousValues: true,
    // });

    const filteredData=plainToInstance(GetRecentRequestsResponseDto,data, {
      excludeExtraneousValues: true,
        context: { lang },
        } as ClassTransformOptions & { context?: any }
    )

    return {
      data: filteredData,
      message: I18nKeys.successMessages.getListSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Post('confirmOrder')
  async confirmOrder(@Body() confirmOrderDto:ConfirmOrderDto) {
    console.log('44')
    const data=await this.ordersService.confirmOrder(confirmOrderDto)
    return {
      data: data,
      message: I18nKeys.successMessages.confirmOrderSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Post('cancelPendingOrder')
  async cancelPendingOrder(@Body() findOneDto:FindOneDto) {
    const data=await this.ordersService.cancelPendingOrder(findOneDto);
    return {
      data: data,
      message: I18nKeys.successMessages.cancelPendingOrderSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.DRIVER)
  @Post('closeOrder')
  async closeOrder(@Body() closeOrderDto:CloseOrderDto){
    const data =await this.ordersService.closeOrder(closeOrderDto);
    return {
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.DRIVER)
  @Get('getOrdersStatistics')
  async getOrdersStatistics(){
    const data=await this.ordersService.getOrdersStatistics();
    return {
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.CUSTOMER,RoleTypeEnum.DRIVER)
    @Get('getCustomerSocketConnections')
    async getCustomerSocketConnections(){
      const data=await this.ordersService.getCustomerSocketConnections();
      return{
        data:data,
        message:I18nKeys.successMessages.success
      }
    }
}
