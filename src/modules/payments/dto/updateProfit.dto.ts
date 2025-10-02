import { Type } from "class-transformer";
import { IsNotEmptyT, IsNumberT } from "src/common/decorators/customValidators.decorator";

export class UpdateProfitDto{
    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    newProfitPercentage:number
}