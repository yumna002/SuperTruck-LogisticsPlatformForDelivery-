import { AccountPasswordRuleT, IsNotEmptyT, IsStringT } from 'src/common/decorators/customValidators.decorator';



export class ResetPasswordDto {
    @AccountPasswordRuleT()
    @IsStringT()
    @IsNotEmptyT() 
    password: string;
}
