import { Type } from "class-transformer"
import { IsNotEmptyT, IsNumberT } from "src/common/decorators/customValidators.decorator"



export class CreateDto{
    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    orderId:number

    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    driverId:number

    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    expectedPrice:number

    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    finalPrice:number

    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    finalDriverPrice:number

    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    finalHolderPrice:number

    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    finalDistance:number

    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    finalTime:number
}