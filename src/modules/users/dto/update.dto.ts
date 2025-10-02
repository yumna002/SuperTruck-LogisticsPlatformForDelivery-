import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class UpdateDto {
    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    id: number;

    @IsStringT()
    @IsOptionalT()
    refreshToken?: string;

    @IsStringT()
    @IsOptionalT()
    fcmToken?: string;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    isActive?: number;

    @IsStringT()
    @IsOptionalT()
    password?: string;

    @PhoneNumberRuleT()
    @IsStringT()
    @IsOptionalT()
    phoneNumber?: string;
}
