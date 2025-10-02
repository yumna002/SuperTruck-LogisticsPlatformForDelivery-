import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject } from '@nestjs/common';
import { ProcessingOrdersService } from './processing-orders.service';
import { FindAllProcessigDto } from './dto/findAllProcessing';
import { CustomersService } from '../customers/customers.service';
import { OrderStateEnum } from 'src/common/enums/orderState';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { ViewProcessingOrderResponseDto } from './dto/response-dto/viewProcessingOrderResponse.dto';
import { UpdateProcessingOrderStateDto } from './dto/updateProcessingOrderState.dto';
import { REQUEST } from '@nestjs/core';



@UseGuards(AuthGuard,RolesGuard)
@Controller('processing-orders')
export class ProcessingOrdersController {
  constructor(
    private readonly processingOrdersService: ProcessingOrdersService,
    private readonly customersService : CustomersService,
    @Inject(REQUEST) private readonly request : Request
  ) {}
  
  
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Post('getMyProcessingOrdersList')
  async getMyProcessingOrdersList(@Body() findAllProcessigDto: FindAllProcessigDto) {
    const customer=await this.customersService.getCurrentCustomer();
    findAllProcessigDto.customerId=customer.id;
    findAllProcessigDto.state=OrderStateEnum.PROCESSING;
    
    const lang=this.request.headers['accept-language'] || 'en'
    const data=await this.processingOrdersService.findAll(findAllProcessigDto);
    // const filteredData=plainToInstance(ViewProcessingOrderResponseDto,data.elements,{
    //       excludeExtraneousValues:true
    // })

    const filteredData=plainToInstance(ViewProcessingOrderResponseDto,data,{
      excludeExtraneousValues:true,
      context: { lang },
        } as ClassTransformOptions & { context?: any }
    )

    return {
      data: filteredData,
      message: I18nKeys.successMessages.getListSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.DRIVER)
  @Post('updateProcessingOrderState')
  async updateProcessingOrderState(@Body() updateProcessingOrderStateDto:UpdateProcessingOrderStateDto){
    const data= await this.processingOrdersService.updateProcessingOrderState(updateProcessingOrderStateDto);
    return {
      data:data,
      message:I18nKeys.successMessages.updateSuccess
    }
  }
}
