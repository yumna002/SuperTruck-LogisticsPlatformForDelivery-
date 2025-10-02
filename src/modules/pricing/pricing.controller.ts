import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { GetExpectedTimeAndPriceDto } from './dto/getExpectedTimeAndPrice.dto';
import { GetFinalPriceDto } from './dto/getFinalPrice.dto';
import { UpdateDto } from './dto/update.dto';
import { EditFormulaParametersDto } from './dto/editFormulaParameters.dto';
import { TruckModelsService } from '../truck-models/truck-models.service';



@UseGuards(AuthGuard,RolesGuard)
@Controller('pricing')
export class PricingController {
  constructor(
    private readonly pricingService: PricingService,
    private readonly truckModelsService:TruckModelsService
  ) {}

  
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('getExpectedTimeAndPriceAndDistance')
  async getExpectedTimeAndPriceAndDistance(@Body() getExpectedTimeAndPriceDto:GetExpectedTimeAndPriceDto){
    const data=await this.pricingService.getExpectedTimeAndPriceAndDistance(getExpectedTimeAndPriceDto);
    return {
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE)
  @Post('getFinalPrice')
  async getFinalPrice(@Body() getFinalPriceDto:GetFinalPriceDto){
    const data=await this.pricingService.getFinalPrice(getFinalPriceDto);
    return {
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE)
  @Post('editFormulaParameters')
  async editFormulaParameters(@Body() editFormulaParametersDto:EditFormulaParametersDto){
    
    const updateDto=new UpdateDto();
    updateDto.id=1;
    updateDto.firstFloorPrice=editFormulaParametersDto.firstFloorPrice;
    updateDto.highestValueMediumWeight=editFormulaParametersDto.highestValueMediumWeight;
    updateDto.highestValueSmallWeight=editFormulaParametersDto.highestValueSmallWeight;
    updateDto.increaseRateHeavyWeight=editFormulaParametersDto.increaseRateHeavyWeight
    updateDto.increaseRateMediumWeight=editFormulaParametersDto.increaseRateMediumWeight
    updateDto.netProfit=editFormulaParametersDto.netProfit;
    
    const data=await this.pricingService.update(updateDto);
    const fuelData=await this.truckModelsService.updateFuelPrices({gasolinePrice:editFormulaParametersDto.gasolinePrice,dieselPrice:editFormulaParametersDto.dieselPrice})
    
    const fullData={
      ...data,
      gasolinePrice:fuelData.gasolinePrice,
      dieselPrice:fuelData.dieselPrice
    }
    return {
      data:fullData,
      message:I18nKeys.successMessages.updateSuccess
    }
  }
  
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE)
  @Get('viewFormulaParameters')
  async viewFormulaParameters(){
    const data=await this.pricingService.findOne({id:1});
    const fuelData=await this.truckModelsService.getFuelData();

    console.log(data);
    const fullData={
      ...data,
      gasolinePrice:fuelData[0].price,
      dieselPrice:fuelData[1].price
    }

    return{
      data:fullData,
      message:I18nKeys.successMessages.success
    }

  }
  
}
