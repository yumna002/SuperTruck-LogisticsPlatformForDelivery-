import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { AccountPasswordRuleT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class CreateDto {
  @IsNumberT()
  @Type(() => Number)
  @IsNotEmptyT()
  number: number;

  @IsNumberT()
  @Type(() => Number)
  @IsNotEmptyT()
  fragility: number;

  @IsNumberT()
  @Type(() => Number)
  @IsNotEmptyT()
  abilityToDisassemble: number;

  @IsNumberT()
  @Type(() => Number)
  @IsNotEmptyT()
  itemSizeId: number;

  @IsNumberT()
  @Type(() => Number)
  @IsNotEmptyT()
  itemWeightId: number;

  @IsNumberT()
  @Type(() => Number)
  @IsNotEmptyT()
  orderId: number;

  @IsNumberT()
  @Type(() => Number)
  @IsNotEmptyT()
  categoryTypeId: number;
}
