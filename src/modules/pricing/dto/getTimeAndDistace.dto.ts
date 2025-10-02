import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { AccountPasswordRuleT, IsEnumT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';
import { OrderStateEnum } from 'src/common/enums/orderState';



export class GetTimeAndDistaceDto {
  @IsNumberT()
  @Type(() => Number)
  @IsNotEmptyT()
  latitudeSt: number;

  @IsNumberT()
  @Type(() => Number)
  @IsNotEmptyT()
  longitudeSt: number;

  @IsNumberT()
  @Type(() => Number)
  @IsNotEmptyT()
  latitudeEn: number;

  @IsNumberT()
  @Type(() => Number)
  @IsNotEmptyT()
  longitudeEn: number;
}
