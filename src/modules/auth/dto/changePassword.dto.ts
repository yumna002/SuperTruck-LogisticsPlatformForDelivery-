import { AccountPasswordRuleT, IsNotEmptyT, IsStringT } from 'src/common/decorators/customValidators.decorator';



export class ChangePasswordDto {  
    @AccountPasswordRuleT()
    @IsStringT()
    @IsNotEmptyT()
    oldPassword: string;
  
    @AccountPasswordRuleT()
    @IsStringT()
    @IsNotEmptyT()
    newPassword: string;
}
