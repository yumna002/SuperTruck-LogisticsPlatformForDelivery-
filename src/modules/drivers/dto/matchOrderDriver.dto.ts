import { Type } from "class-transformer";
import { IsNotEmptyT, IsNumberT } from "src/common/decorators/customValidators.decorator";
import { Order } from "src/modules/orders/entities/order.entity";



export class MatchOrderDriverDto{
    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    order:Order

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    expectedTime:number

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    expectedPrice:number

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    distance:number

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    holdersProfit:number

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    driverProfit:number
}
