import { Type } from "class-transformer";
import { IsNotEmptyT, IsNumberT } from "src/common/decorators/customValidators.decorator";

export class StartScheduledOrderDto{
    
    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    orderId:number
}