import { Type } from "class-transformer"
import { IsOptional } from "class-validator"
import { IsEnumT, IsNotEmptyT, IsNumberT, IsStringT } from "src/common/decorators/customValidators.decorator"



export class CreateDto{
    @IsStringT()
    @IsNotEmptyT()
    plateNumber:string

    @IsStringT()
    @IsNotEmptyT()
    details:string
    
    //@IsEnumT(ColorEnum)
    @IsStringT()
    @IsNotEmptyT()
    color:string

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    truckModelId:number

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    driverId:number
}
