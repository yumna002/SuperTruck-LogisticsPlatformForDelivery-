import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { AccountPasswordRuleT, IsEnumT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';
import { OrderStateEnum } from 'src/common/enums/orderState';



export class GetFinalDistanceAndTimeDto {
  @IsNumberT()
  @Type(() => Number)
  @IsNotEmptyT()
  orderId: number
}
