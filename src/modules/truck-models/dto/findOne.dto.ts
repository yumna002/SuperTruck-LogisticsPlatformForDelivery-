import { Type } from "class-transformer"
import { IsNumberT, IsOptionalT, IsStringT } from "src/common/decorators/customValidators.decorator"



export class FindOneDto {    
    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    id?:number

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
