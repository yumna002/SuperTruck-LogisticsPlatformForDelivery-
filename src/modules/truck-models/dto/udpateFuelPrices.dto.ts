import { Type } from "class-transformer"
import { IsNumberT, IsOptionalT } from "src/common/decorators/customValidators.decorator"

export class UpdateFuelPricesDto{
    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    gasolinePrice:number

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    dieselPrice:number
}