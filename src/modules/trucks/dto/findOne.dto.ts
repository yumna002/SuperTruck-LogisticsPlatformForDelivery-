import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';



export class FindOneDto {    
    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    id?: number;

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    driverId?: number;

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    isAvailable?: number;

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    isActive?: number;

    @IsStringT()
    @IsOptionalT()
    plateNumber?: string;

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    truckModelId?: number;    

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    sizeTypeId?:number

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    vehicleTypeId?:number

    
}
