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
    rejectReasonId:number
}
