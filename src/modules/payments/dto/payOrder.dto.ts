import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray } from "class-validator";
import { IsNotEmptyT, IsNumberT } from "src/common/decorators/customValidators.decorator";

export class PayOrderDto{
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Number)
    orderIds: number[];
}