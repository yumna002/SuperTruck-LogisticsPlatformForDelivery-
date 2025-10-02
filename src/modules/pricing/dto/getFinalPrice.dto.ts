import { Type } from "class-transformer";
import { IsNotEmptyT, IsNumberT } from "src/common/decorators/customValidators.decorator";



export class GetFinalPriceDto{
    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    orderId:number
}
