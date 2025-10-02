import { Type } from "class-transformer";
import { IsNotEmptyT, IsNumberT } from "src/common/decorators/customValidators.decorator";



export class CloseOrderDto{
    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    id:number

    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    finalPrice:number   
    
    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    finalDriverPrice:number   
    
    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    finalHolderPrice:number   
}
