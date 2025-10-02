import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';



export class FindOneDto {
    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    id?: number;
    
    @PhoneNumberRuleT()
    @IsStringT()
    @IsOptionalT()
    phoneNumber?: string;

    @IsStringT()
    @IsOptionalT()
    refreshToken?: string;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    isActive?: number;
}
