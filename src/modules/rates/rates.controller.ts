import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { CreateRateDto } from './dto/createRate.dts';
import { Role } from '../users/entities/role.entity';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { Roles } from 'src/common/decorators/roles.decorator';



@UseGuards(AuthGuard,RolesGuard)
@Controller('rates')
export class RatesController {
  constructor(
    private readonly ratesService: RatesService,
  ) {}

  @Roles(RoleTypeEnum.CUSTOMER)
  @Post('rateOrder')
  async rateOrder(@Body() createRateDto:CreateRateDto){
    const data=await this.ratesService.create(createRateDto)
    return{
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE)
  @Get('getHighLowRated')
  async getHighLowRated(){
    const data=await this.ratesService.getHighLowRated();
    return {
      data:data,
      message:I18nKeys.successMessages.success
    }
  }
  


}
