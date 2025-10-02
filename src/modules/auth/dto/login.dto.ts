import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { AccountPasswordRuleT, IsEnumT, IsNotEmptyT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';



export class LoginDto {
    @PhoneNumberRuleT()
    @IsStringT()
    @IsNotEmptyT()
    phoneNumber: string;
  
    @AccountPasswordRuleT()
    @IsStringT()
    @IsNotEmptyT()
    password: string;
  
    //@IsEnumT(UserTypeEnum)
    @IsStringT()
    @IsNotEmptyT()
    userType: string;
}
