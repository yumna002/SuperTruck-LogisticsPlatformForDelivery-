import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { AccountPasswordRuleT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class FindAllDto {
  @IsNumberT()
  @Type(() => Number)
  @IsOptionalT()
  page?: number = 1;

  @IsNumberT()
  @Type(() => Number)
  @IsOptionalT()
  limit?: number = 10;

  @IsNumberT()
  @Type(() => Number)
  @IsOptionalT()
  isActive?: number;
}
