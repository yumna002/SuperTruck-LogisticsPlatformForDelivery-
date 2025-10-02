import { Type } from "class-transformer";
import { IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT } from "src/common/decorators/customValidators.decorator";
import { ProcessingOrderStateEnum } from "src/common/enums/processingOrderState";



export class UpdateProcessingDto{
    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    id:number

    @IsStringT()
    @IsOptionalT()
    state?:string

    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    currDistance?:number

    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    currTime?:number
}
