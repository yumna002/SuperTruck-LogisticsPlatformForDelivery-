import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduledOrderDto } from './create-scheduled-order.dto';
import { IsNotEmptyT, IsNumberT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class UpdateScheduledOrderDto extends PartialType(CreateScheduledOrderDto) {
    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    id:number
}
