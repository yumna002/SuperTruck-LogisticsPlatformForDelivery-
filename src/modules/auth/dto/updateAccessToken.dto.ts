import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { AccountPasswordRuleT, IsNotEmptyT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';



export class UpdateAccessTokenDto {
    @IsStringT()
    @IsNotEmptyT()
    refreshToken: string;
}
