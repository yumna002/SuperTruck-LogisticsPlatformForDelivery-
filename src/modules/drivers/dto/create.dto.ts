import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { AccountPasswordRuleT, IsEnumT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, NationalNumberRuleT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class CreateDto {
    @PhoneNumberRuleT()
    @IsStringT()
    @IsNotEmptyT()
    phoneNumber: string;

    @NationalNumberRuleT()
    @IsStringT()
    @IsNotEmptyT()
    nationalNumber: string;

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

    @IsStringT()
    @IsNotEmptyT()
    city: string;

    //@IsEnumT(GenderEnum)
    @IsStringT()
    @IsNotEmptyT()
    gender: string;

    @IsNotEmptyT()
    birthdate:Date
}
