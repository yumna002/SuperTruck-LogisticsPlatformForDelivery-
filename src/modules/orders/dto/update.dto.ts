import { IsNotEmpty, IsString, IsEnum, IsNumber, IsPhoneNumber } from 'class-validator';
import { IsEmailT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class UpdateDto {
    @IsNotEmptyT()
    id: number;

    @IsStringT()
    @IsOptionalT()
    orderDateTime?: Date;

    @PhoneNumberRuleT()
    @IsStringT()
    @IsOptionalT()
    fromPhoneNumber?: string;
    
    @PhoneNumberRuleT()
    @IsStringT()
    @IsOptionalT()
    toPhoneNumber?: string;
    
    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    isScheduled?: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    fromHaveLift?: number;
    
    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    toHaveLift?: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    needHolders?: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    fromFloorNumber?: number;
    
    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    toFloorNumber?: number;

    @IsStringT()
    @IsOptionalT()
    note?: string;

    @IsStringT()
    @IsOptionalT()
    state?:string

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    paymentTypeId?:number

    
    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    fromAddressId?:number

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    toAddressId?:number

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    vehicleTypeId?:number

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    sizeTypeId?:number

    @IsOptionalT()
    photos?: string[]; //list of uploaded photo paths
}
