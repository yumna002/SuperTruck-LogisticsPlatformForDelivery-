import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsNumberT, IsOptionalT, IsStringT } from "src/common/decorators/customValidators.decorator";
import { FindOneDto } from "src/modules/orders/dto/findOne.dto";



export class FindOneScheduledDto extends PartialType(FindOneDto){
    
    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    driverId?:number

    //left side of the interval
    @IsOptionalT()
    startDateTime?:string

    //right side of the interval
    @IsOptionalT()
    endDateTime?:string
}
