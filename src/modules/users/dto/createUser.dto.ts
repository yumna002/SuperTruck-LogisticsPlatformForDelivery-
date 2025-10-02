import { Type } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { AccountPasswordRuleT, IsEnumT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';



export class CreateUserDto {
    @PhoneNumberRuleT()
    @IsStringT()
    @IsNotEmptyT()
    phoneNumber: string;

    @AccountPasswordRuleT()
    @IsStringT()
    @IsNotEmptyT()
    password: string | null

    //@IsEnumT(UserTypeEnum)
    @IsStringT()
    @IsNotEmptyT()
    userType:string

    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    roleId:number
}
