import {IsNotEmptyT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';



export class VerifyCodeDto {
    @PhoneNumberRuleT()
    @IsStringT()
    @IsNotEmptyT()
    phoneNumber: string;
  
    @IsStringT()
    @IsNotEmptyT()
    code: string;
}
