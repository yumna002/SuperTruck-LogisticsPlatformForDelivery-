import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject } from '@nestjs/common';
import { RejectedOrdersService } from './rejected-orders.service';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { GetRejectReasonsResponseDto } from './dto/response/getRejectReasonsResponse.dto';
import { REQUEST } from '@nestjs/core';



@UseGuards(AuthGuard,RolesGuard)
@Controller('rejected-orders')
export class RejectedOrdersController {
  constructor(
    private readonly rejectedOrdersService: RejectedOrdersService,
    @Inject(REQUEST) private readonly request:Request
  ){}

  
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER,RoleTypeEnum.DRIVER)
  @Get('getRejectReasonsList')
  async getRejectReasonsList() {
    const lang=this.request.headers['accept-language'] || 'en'
    const data=await this.rejectedOrdersService.findAllRejectReasons({});
    const filteredData=plainToInstance(GetRejectReasonsResponseDto,data,{
      excludeExtraneousValues:true,
      context: { lang },
        } as ClassTransformOptions & { context?: any }
    )
    return {
      data:filteredData,
      message:I18nKeys.successMessages.getListSuccess
    }
  }
}
