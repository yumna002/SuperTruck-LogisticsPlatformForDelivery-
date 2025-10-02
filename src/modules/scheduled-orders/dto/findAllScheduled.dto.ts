import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsNumberT, IsOptionalT } from "src/common/decorators/customValidators.decorator";
import { FindAllDto } from "src/modules/orders/dto/findAll.dto";



export class FindAllScheduledDto extends PartialType(FindAllDto){
    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    driverId?:number
}
