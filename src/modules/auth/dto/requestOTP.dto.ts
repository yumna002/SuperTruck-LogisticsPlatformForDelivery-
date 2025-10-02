import {IsNotEmptyT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';



export class RequestOTPDto {
    @PhoneNumberRuleT()
    @IsStringT()
    @IsNotEmptyT()
    phoneNumber: string;
}
