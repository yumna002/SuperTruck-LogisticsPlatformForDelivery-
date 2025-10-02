import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { AccountPasswordRuleT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class FindAllDto {
  @IsNumberT()
  @Type(() => Number)
  @IsOptionalT()
  orderId?: number;

  @IsNumberT()
  @Type(() => Number)
  @IsOptionalT()
  itemSizeId?: number;

  @IsNumberT()
  @Type(() => Number)
  @IsOptionalT()
  itemWeightId?: number;
}
