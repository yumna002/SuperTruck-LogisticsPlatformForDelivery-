import { Type } from "class-transformer"
import { IsNotEmptyT, IsNumberT } from "src/common/decorators/customValidators.decorator"



export class CreateScheduledOrderDto {    
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
    truckId:number

    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    expectedPrice:number

    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    expectedTime:number
}
