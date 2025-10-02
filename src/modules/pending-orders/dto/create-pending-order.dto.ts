import { Type } from "class-transformer"
import { IsNotEmptyT, IsNumberT, IsOptionalT } from "src/common/decorators/customValidators.decorator"



export class CreatePendingOrderDto {
    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    orderId:number

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    driverId?:number
}
