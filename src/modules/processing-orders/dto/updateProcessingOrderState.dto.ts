import { Type } from "class-transformer"
import { IsNotEmptyT, IsStringT } from "src/common/decorators/customValidators.decorator"
import { ProcessingOrderStateEnum } from "src/common/enums/processingOrderState"



export class UpdateProcessingOrderStateDto{    
    @IsNotEmptyT()
    @Type(()=>Number)
    @IsNotEmptyT()
    orderId:number

    @IsStringT()
    @IsNotEmptyT()
    state:string
}