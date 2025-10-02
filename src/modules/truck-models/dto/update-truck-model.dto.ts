import { PartialType } from '@nestjs/mapped-types';
import { CreateTruckModelDto } from './create-truck-model.dto';
import { Type } from 'class-transformer';
import { IsNotEmptyT, IsNumberT } from 'src/common/decorators/customValidators.decorator';



export class UpdateTruckModelDto extends PartialType(CreateTruckModelDto) {
    @IsNumberT()
    @Type(()=>Number)
    @IsNotEmptyT()
    id:number
}
