import { Type } from "class-transformer"
import { IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT } from "src/common/decorators/customValidators.decorator"

export class CreateRateDto{
    
    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    value:number

    @IsStringT()
    @IsOptionalT()
    note?:string

    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    orderId:number
}