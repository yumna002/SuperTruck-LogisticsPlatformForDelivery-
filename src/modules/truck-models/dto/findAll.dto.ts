import { Type } from "class-transformer"
import { IsNumberT, IsOptionalT, IsStringT } from "src/common/decorators/customValidators.decorator"



export class FindAllDto {
    @IsStringT()
    @IsOptionalT()
    brand?:string
    
    @IsStringT()
    @IsOptionalT()
    model?:string
    
    @IsStringT()
    @IsOptionalT()
    year?:string
   
    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    vehicleTypeId?:number

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    sizeTypeId?:number

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    fuelTypeId?:number
}
