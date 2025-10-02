import { Type } from "class-transformer";
import { IsNumberT, IsOptionalT } from "src/common/decorators/customValidators.decorator";

export class EditFormulaParametersDto{
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

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    gasolinePrice:number

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    dieselPrice:number
}