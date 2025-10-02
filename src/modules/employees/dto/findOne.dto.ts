import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class FindOneDto {
    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    id?: number

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    userId?: number

    @PhoneNumberRuleT()
    @IsStringT()
    @IsOptionalT()
    phoneNumber?: string
}
