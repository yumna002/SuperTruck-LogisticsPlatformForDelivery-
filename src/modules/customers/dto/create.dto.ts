import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { AccountPasswordRuleT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class CreateDto {
  @PhoneNumberRuleT()
  @IsStringT()
  @IsNotEmptyT()
  phoneNumber: string;

  @AccountPasswordRuleT()
  @IsStringT()
  @IsNotEmptyT()
  password:string;

  @IsStringT()
  @IsNotEmptyT()
  fullName: string;

  @IsNotEmptyT()
  birthdate:Date;
}
