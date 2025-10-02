import { PartialType } from "@nestjs/mapped-types"
import { Type } from "class-transformer"
import { IsEnumT, IsNumberT, IsOptionalT } from "src/common/decorators/customValidators.decorator"
import { OrderStateEnum } from "src/common/enums/orderState"
import { FindAllDto } from "src/modules/orders/dto/findAll.dto"



export class FindAllClosedDto extends PartialType(FindAllDto){
    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    driverId?:number

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    isPaid?:number

}
