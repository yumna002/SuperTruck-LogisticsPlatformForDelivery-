import { Type } from "class-transformer"
import { IsNotEmptyT, IsNumberT, IsStringT } from "src/common/decorators/customValidators.decorator"



export class CreateDto {
    @IsStringT()
    @IsNotEmptyT()
    city:string
    
    @IsStringT()
    @IsNotEmptyT()
    area:string
    
    @IsStringT()
    @IsNotEmptyT()
    street:string
    
    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    floor:number
    
    @IsStringT()
    @IsNotEmptyT()
    name:string
    
    @IsStringT()
    @IsNotEmptyT()
    details:string

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    latitude: number;

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    longitude: number;

    @IsStringT()
    @IsNotEmptyT()
    googlePlaceId: string;

    customerId:number
}
