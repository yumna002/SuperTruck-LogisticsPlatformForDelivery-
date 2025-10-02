import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { AccountPasswordRuleT, IsEmailT, IsEnumT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, NationalNumberRuleT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class CreateDto {
    @PhoneNumberRuleT()
    @IsStringT()
    @IsNotEmptyT()
    phoneNumber: string;

    @IsStringT()
    @IsNotEmptyT()
    firstName: string;

    @IsStringT()
    @IsNotEmptyT()
    lastName: string;

    @IsStringT()
    @IsNotEmptyT()
    fatherName: string;

    @IsStringT()
    @IsNotEmptyT()
    address: string;

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    roleId: number;

    //@IsEnumT(GenderEnum)
    @IsStringT()
    @IsNotEmptyT()
    gender: string;

    @IsEmailT()
    @IsStringT()
    @IsNotEmptyT()
    email: string;

    @IsNotEmptyT()
    birthdate:Date
}
