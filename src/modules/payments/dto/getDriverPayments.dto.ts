import { Type } from "class-transformer";
import { IsNotEmptyT, IsNumberT } from "src/common/decorators/customValidators.decorator";

export class GetDriverPaymentsDto{
    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    driverId:number
}