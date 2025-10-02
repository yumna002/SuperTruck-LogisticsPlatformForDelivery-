import { Type } from "class-transformer"
import { IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT } from 'src/common/decorators/customValidators.decorator';



export class CreateTruckModelDto {    
    @IsStringT()
    @IsNotEmptyT()
    brand:string
    
    @IsStringT()
    @IsNotEmptyT()
    model:string
    
    @IsStringT()
    @IsNotEmptyT()
    year:string
    
    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    width:number
    
    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    height:number

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    length:number

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    maximumWeightCapacity:number
    
    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    fuelConsumption:number
    
    @IsStringT()
    @IsNotEmptyT()
    details:string

    @IsStringT()
    @IsOptionalT()
    photo?:string
    
    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    vehicleTypeId:number

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    sizeTypeId:number

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    fuelTypeId:number
}
