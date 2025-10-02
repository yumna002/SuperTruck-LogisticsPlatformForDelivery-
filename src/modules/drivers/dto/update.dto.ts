import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { IsEmailT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class UpdateDto {
    @IsOptionalT()
    id?: number

    @IsStringT()
    @IsOptionalT()
    address?: string

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    isOnline?:number

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    isAvailable?:number

    @IsStringT()
    @IsOptionalT()
    firstName?: string

    @IsStringT()
    @IsOptionalT()
    lastName?: string

    @IsStringT()
    @IsOptionalT()
    fatherName?: string

    @IsStringT()
    @IsOptionalT()
    nationalNumber?: string

    //@IsEnumT(GenderEnum)
    @IsStringT()
    @IsOptionalT()
    gender?: string

    @IsOptionalT()
    birthdate?: Date

    @IsStringT()
    @IsOptionalT()
    city?: string
    
    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    rate?: number 
    
    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    rateSum?: number 

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    rateCount?: number

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    extraProfit?: number

    @PhoneNumberRuleT()
    @IsStringT()
    @IsOptionalT()
    phoneNumber?: string;
}
