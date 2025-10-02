import { Type } from "class-transformer"
import { IsNumberT, IsOptionalT } from "src/common/decorators/customValidators.decorator"



export class FindOneDto{
    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    id?:number

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    orderId?:number
}
