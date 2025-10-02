import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { IsEmailT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class UpdateDto {
    @IsOptionalT()
    id?: number;

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    firstFloorPrice?: number;

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    highestValueSmallWeight?: number;

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    highestValueMediumWeight?: number;

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    increaseRateMediumWeight?: number;

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    increaseRateHeavyWeight?: number;

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    netProfit?: number;
}
