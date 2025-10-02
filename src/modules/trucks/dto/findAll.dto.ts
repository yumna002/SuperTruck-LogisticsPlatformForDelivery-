import { Type } from "class-transformer"
import { IsOptional } from "class-validator"
import { IsNumberT, IsOptionalT } from "src/common/decorators/customValidators.decorator"



export class FindAllDto{
    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    driverId?:number

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    truckModelId?:number

    @IsOptionalT()
    truckModelIds?:number[]

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    isActive?:number

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    isAvailable?:number
}
