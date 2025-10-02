import { IsNotEmpty, IsString, IsEnum, isNumber } from 'class-validator';
import { AccountPasswordRuleT, IsEnumT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';
import { OrderStateEnum } from 'src/common/enums/orderState';



export class FindAllDto {
  @IsNumberT()
  @Type(()=>Number)
  @IsOptionalT()
  customerId:number

  @IsEnumT(OrderStateEnum)
  @IsOptionalT()
  state:OrderStateEnum

  @IsNumberT()
  @Type(() => Number)
  @IsOptionalT()
  page?: number = 1;

  @IsNumberT()
  @Type(() => Number)
  @IsOptionalT()
  limit?: number = 10;
  
  /*@IsNumberT()
  @Type(() => Number)
  @IsOptionalT()
  itemWeightId?: number;*/
}
