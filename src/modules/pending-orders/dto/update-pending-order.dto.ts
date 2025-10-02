import { PartialType } from '@nestjs/mapped-types';
import { CreatePendingOrderDto } from './create-pending-order.dto';
import { IsNotEmptyT, IsNumberT, IsOptionalT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class UpdatePendingOrderDto {
    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    id:number

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    orderId?:number

    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    driverId?:number
}
