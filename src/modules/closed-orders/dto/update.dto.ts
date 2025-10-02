import { Type } from "class-transformer"
import { IsNotEmptyT, IsNumberT, IsOptionalT } from "src/common/decorators/customValidators.decorator"

export class UpdateDto{
    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    id:number

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    isPaid?:number
}