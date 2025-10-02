import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { AccountPasswordRuleT, IsEnumT, IsNotEmptyT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';



export class CheckIfFirstLoginDto {
    @PhoneNumberRuleT()
    @IsStringT()
    @IsNotEmptyT()
    phoneNumber: string;
}
